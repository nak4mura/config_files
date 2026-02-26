import type { Plugin } from "@opencode-ai/plugin"
import { platform } from "os"

// ---------------------------------------------------------------------------
// Cross-platform notification plugin for OpenCode
//
// Supports macOS, Windows (PowerShell toast), and Linux (notify-send).
// Uses only OS-native commands -- no external npm dependencies required.
//
// Alacritty does not expose a unique window class, so we use wmctrl / xdotool
// on Linux and osascript on macOS to bring the terminal back to focus.
// ---------------------------------------------------------------------------

const APP_TITLE = "OpenCode"

type EventConfig = {
  title: string
  message: string
  sound: boolean
}

/** Map event types to notification content */
function eventToConfig(eventType: string): EventConfig | null {
  switch (eventType) {
    case "session.idle":
      return {
        title: APP_TITLE,
        message: "Session completed -- ready for input.",
        sound: true,
      }
    case "permission.asked":
      return {
        title: `${APP_TITLE} - Action Required`,
        message: "User permission is required to continue.",
        sound: true,
      }
    case "session.error":
      return {
        title: `${APP_TITLE} - Error`,
        message: "The session encountered an error.",
        sound: true,
      }
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// OS-specific notification helpers
// ---------------------------------------------------------------------------

/** Escape single quotes for AppleScript strings */
function escapeAppleScript(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

/** Escape single quotes for PowerShell strings */
function escapePowerShell(s: string): string {
  return s.replace(/'/g, "''")
}

/** Escape for shell single-quote context */
function escapeShell(s: string): string {
  return s.replace(/'/g, "'\\''")
}

// -- macOS ------------------------------------------------------------------

async function notifyMacOS(
  $: any,
  config: EventConfig,
): Promise<void> {
  const title = escapeAppleScript(config.title)
  const message = escapeAppleScript(config.message)
  const soundClause = config.sound ? ' sound name "Glass"' : ""
  await $`osascript -e ${"display notification \"" + message + "\" with title \"" + title + "\"" + soundClause}`
}

async function focusAlacrittyMacOS($: any): Promise<void> {
  try {
    await $`osascript -e 'tell application "Alacritty" to activate'`
  } catch {
    // Alacritty may not be running -- ignore
  }
}

// -- Linux ------------------------------------------------------------------

async function notifyLinux(
  $: any,
  config: EventConfig,
): Promise<void> {
  const title = escapeShell(config.title)
  const message = escapeShell(config.message)
  // notify-send is the de-facto standard on most Linux desktops
  try {
    await $`notify-send --app-name='OpenCode' --urgency=normal '${title}' '${message}'`
  } catch {
    // Fallback: try gdbus (GNOME)
    try {
      await $`gdbus call --session --dest=org.freedesktop.Notifications --object-path=/org/freedesktop/Notifications --method=org.freedesktop.Notifications.Notify 'OpenCode' 0 '' '${title}' '${message}' '[]' '{}' 5000`
    } catch {
      // No notification daemon available
    }
  }
}

async function focusAlacrittyLinux($: any): Promise<void> {
  // Try wmctrl first, then xdotool
  try {
    await $`wmctrl -a Alacritty`
    return
  } catch {}
  try {
    await $`xdotool search --name Alacritty windowactivate`
  } catch {
    // Neither wmctrl nor xdotool is available
  }
}

// -- Windows ----------------------------------------------------------------

async function notifyWindows(
  $: any,
  config: EventConfig,
): Promise<void> {
  const title = escapePowerShell(config.title)
  const message = escapePowerShell(config.message)

  // Use BurntToast if available, otherwise fall back to .NET toast
  const script = `
    if (Get-Command New-BurntToastNotification -ErrorAction SilentlyContinue) {
      New-BurntToastNotification -Text '${title}', '${message}'
    } else {
      [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
      [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
      $xml = [Windows.Data.Xml.Dom.XmlDocument]::new()
      $xml.LoadXml("<toast><visual><binding template='ToastGeneric'><text>'${title}'</text><text>'${message}'</text></binding></visual></toast>")
      $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
      [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('OpenCode').Show($toast)
    }
  `.trim()

  try {
    await $`powershell -NoProfile -NonInteractive -Command ${script}`
  } catch {
    // PowerShell not available or notification failed
  }
}

async function focusAlacrittyWindows($: any): Promise<void> {
  const script = `
    Add-Type @"
      using System;
      using System.Runtime.InteropServices;
      public class Win32 {
        [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
      }
"@
    $proc = Get-Process -Name alacritty -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($proc) { [Win32]::SetForegroundWindow($proc.MainWindowHandle) }
  `.trim()

  try {
    await $`powershell -NoProfile -NonInteractive -Command ${script}`
  } catch {
    // Alacritty process not found or focus failed
  }
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

async function sendNotification($: any, config: EventConfig): Promise<void> {
  const os = platform()

  switch (os) {
    case "darwin":
      await notifyMacOS($, config)
      break
    case "linux":
      await notifyLinux($, config)
      break
    case "win32":
      await notifyWindows($, config)
      break
    default:
      // Unsupported platform -- silently skip
      break
  }
}

async function focusAlacritty($: any): Promise<void> {
  const os = platform()

  switch (os) {
    case "darwin":
      await focusAlacrittyMacOS($)
      break
    case "linux":
      await focusAlacrittyLinux($)
      break
    case "win32":
      await focusAlacrittyWindows($)
      break
    default:
      break
  }
}

// ---------------------------------------------------------------------------
// Plugin export
// ---------------------------------------------------------------------------

export const NotificationPlugin: Plugin = async ({ $}) => {
  return {
    event: async ({ event }) => {
      const config = eventToConfig(event.type)
      if (!config) return

      await sendNotification($, config)

      // Bring Alacritty to the foreground so the user can respond
      if (event.type === "permission.asked") {
        await focusAlacritty($)
      }
    },
  }
}
