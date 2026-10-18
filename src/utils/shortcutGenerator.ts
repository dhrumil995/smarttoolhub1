/**
 * Apple Shortcuts .shortcut Plist Generator
 * Converts generated shortcut automation recipes into valid Apple Property List (.shortcut) files
 * compatible with iOS / iPadOS / macOS Shortcuts app.
 */

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().toUpperCase();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16).toUpperCase();
  });
}

export function extractShortcutName(text: string, defaultName = 'SmartToolHub Shortcut'): string {
  // Matches "### Shortcut Name: "Name"" or "Shortcut Name: Name"
  const match = text.match(/Shortcut Name:?\s*["“]?([^"\n”]+)["”]?/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return defaultName;
}

export function generateShortcutPlist(recipeText: string, inputDescription = ''): string {
  const shortcutName = extractShortcutName(recipeText);
  const cleanDescription = inputDescription || 'Configured via SmartToolHub';

  // Extract individual numbered steps
  const steps: string[] = [];
  const lines = recipeText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^\d+\.\s+/.test(trimmed)) {
      steps.push(trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*/g, ''));
    }
  }

  // If no numbered steps parsed, fallback to paragraphs
  if (steps.length === 0) {
    steps.push('Open Shortcuts and configure initial trigger');
    steps.push('Execute automation actions');
    steps.push('Notify on completion');
  }

  // Build WFWorkflowActions array elements
  let actionsXml = `
    <!-- Header Documentation Action -->
    <dict>
      <key>WFWorkflowActionIdentifier</key>
      <string>is.workflow.actions.comment</string>
      <key>WFWorkflowActionParameters</key>
      <dict>
        <key>WFCommentActionText</key>
        <string>${escapeXml(`[SmartToolHub] Shortcut: ${shortcutName}\nObjective: ${cleanDescription}\nGenerated at smarttoolhub.net`)}</string>
      </dict>
    </dict>`;

  // Add initial Notification / Vibration for feedback
  actionsXml += `
    <dict>
      <key>WFWorkflowActionIdentifier</key>
      <string>is.workflow.actions.vibrate</string>
      <key>WFWorkflowActionParameters</key>
      <dict/>
    </dict>`;

  // Add Step commentary and action blocks
  steps.forEach((step, index) => {
    const actionUuid = generateUUID();
    actionsXml += `
    <dict>
      <key>WFWorkflowActionIdentifier</key>
      <string>is.workflow.actions.comment</string>
      <key>WFWorkflowActionParameters</key>
      <dict>
        <key>WFCommentActionText</key>
        <string>${escapeXml(`Step ${index + 1}: ${step}`)}</string>
      </dict>
    </dict>
    <dict>
      <key>WFWorkflowActionIdentifier</key>
      <string>is.workflow.actions.gettext</string>
      <key>WFWorkflowActionParameters</key>
      <dict>
        <key>UUID</key>
        <string>${actionUuid}</string>
        <key>WFTextActionText</key>
        <string>${escapeXml(step)}</string>
      </dict>
    </dict>`;
  });

  // Add final notification action
  actionsXml += `
    <dict>
      <key>WFWorkflowActionIdentifier</key>
      <string>is.workflow.actions.notification</string>
      <key>WFWorkflowActionParameters</key>
      <dict>
        <key>WFNotificationActionTitle</key>
        <string>${escapeXml(shortcutName)}</string>
        <key>WFNotificationActionBody</key>
        <string>Completed via SmartToolHub</string>
      </dict>
    </dict>`;

  // Complete Property List Envelope
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>WFWorkflowClientVersion</key>
  <string>2607.0.2</string>
  <key>WFWorkflowMinimumClientVersion</key>
  <integer>900</integer>
  <key>WFWorkflowMinimumClientVersionString</key>
  <string>900</string>
  <key>WFWorkflowIcon</key>
  <dict>
    <key>WFWorkflowIconGlyphNumber</key>
    <integer>59511</integer>
    <key>WFWorkflowIconStartColor</key>
    <integer>4282601983</integer>
  </dict>
  <key>WFWorkflowImportQuestions</key>
  <array/>
  <key>WFWorkflowTypes</key>
  <array>
    <string>NCWidget</string>
    <string>WatchKit</string>
    <string>ActionExtension</string>
  </array>
  <key>WFWorkflowInputContentItemClasses</key>
  <array>
    <string>WFStringContentItem</string>
  </array>
  <key>WFWorkflowActions</key>
  <array>${actionsXml}
  </array>
</dict>
</plist>`;
}

export function downloadShortcutFile(recipeText: string, inputDescription = ''): { filename: string; success: boolean } {
  try {
    const rawName = extractShortcutName(recipeText);
    const safeName = rawName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'shortcut';
    const filename = `${safeName}.shortcut`;

    const plistXml = generateShortcutPlist(recipeText, inputDescription);
    const blob = new Blob([plistXml], { type: 'application/x-apple-shortcut;charset=utf-8' });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    return { filename, success: true };
  } catch (err) {
    console.error('Failed to download .shortcut file:', err);
    return { filename: 'shortcut.shortcut', success: false };
  }
}
