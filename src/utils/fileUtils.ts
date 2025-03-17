
/**
 * Utilities for importing/exporting chat data to local files
 */

import { ChatSession } from "@/types/chat";

/**
 * Export chat sessions to a JSON file that will be downloaded
 */
export function exportChatsToFile(sessions: ChatSession[], filename = "agent-elohim-chats"): void {
  try {
    // Create a JSON blob
    const data = JSON.stringify(sessions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error exporting chats:", error);
    throw new Error("Failed to export chats");
  }
}

/**
 * Import chat sessions from a local JSON file
 * @param mergeWithExisting Whether to merge with existing chats or replace them
 */
export function importChatsFromFile(mergeWithExisting = false): Promise<{sessions: ChatSession[], merged: boolean}> {
  return new Promise((resolve, reject) => {
    try {
      // Create file input element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error("No file selected"));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            const sessions = JSON.parse(content) as ChatSession[];
            resolve({ sessions, merged: mergeWithExisting });
          } catch (err) {
            reject(new Error("Invalid JSON file"));
          }
        };
        
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
      };
      
      // Trigger file selection dialog
      input.click();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Set a custom save location for future exports
 * Note: Due to browser security, we can only suggest a filename,
 * but the actual save location depends on browser settings
 */
export function setSaveLocation(): void {
  // In a browser context, we can't directly access the file system
  // We can only show a message explaining the limitations
  alert(
    "Due to browser security restrictions, we cannot set a specific save folder. " + 
    "Files will be downloaded to your browser's default download location. " +
    "You can change this in your browser settings."
  );
}
