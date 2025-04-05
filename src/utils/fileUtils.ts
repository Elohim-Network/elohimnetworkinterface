
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
 */
export async function importChatsFromFile(file: File): Promise<ChatSession[]> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsedContent = JSON.parse(content);
          
          // Add type guard to ensure we have a valid ChatSession array
          if (Array.isArray(parsedContent) && 
              parsedContent.every(item => isChatSession(item))) {
            resolve(parsedContent as ChatSession[]);
          } else {
            reject(new Error("Invalid chat session format"));
          }
        } catch (err) {
          reject(new Error("Invalid JSON file"));
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Type guard to check if an object is a valid ChatSession
 */
function isChatSession(item: any): item is ChatSession {
  return item && 
         typeof item === 'object' && 
         'id' in item &&
         'title' in item &&
         'messages' in item &&
         'createdAt' in item &&
         'updatedAt' in item;
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
