import { TFileSystem } from "./apiTypes";

/* Endpoint for fetch filesystem */

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchFileSystem(path: string = ''): Promise<TFileSystem[] | undefined> {
  try {
    const response = await fetch(`${API_URL}/filesystem?path=${encodeURIComponent(path)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch fileSystem');
    }

    const fileSystemData = await response.json();

    return fileSystemData;
  } catch (error) {
    console.error('Error fetching filesystem contents:', error);
  }
}