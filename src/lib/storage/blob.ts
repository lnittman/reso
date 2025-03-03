import { put, list, del, head } from '@vercel/blob';
import { randomUUID } from 'crypto';

/**
 * Upload a file to Vercel Blob storage
 * @param file The file to upload
 * @param options Upload options
 * @returns The blob URL and other metadata
 */
export async function uploadFile(
  file: File | Blob,
  options?: {
    filename?: string;
    folder?: string;
    contentType?: string;
    access?: 'public' | 'private';
  }
) {
  const {
    filename = `${randomUUID()}-${Date.now()}`,
    folder = '',
    contentType,
    access = 'public',
  } = options || {};
  
  const pathname = folder ? `${folder}/${filename}` : filename;
  
  const blob = await put(pathname, file, {
    contentType,
    access,
  });
  
  return blob;
}

/**
 * Upload a profile image and generate different sizes
 * @param file The image file to upload
 * @param userId The user ID to associate with the image
 * @returns Object with URLs for different image sizes
 */
export async function uploadProfileImage(file: File | Blob, userId: string) {
  // Main profile image
  const blob = await uploadFile(file, {
    filename: `${userId}.jpg`,
    folder: 'profiles',
    access: 'public',
  });
  
  // The URLs will be provided by Vercel Blob with the following patterns:
  return {
    original: blob.url,
    thumbnail: `${blob.url}?width=150&height=150&fit=crop`,
    medium: `${blob.url}?width=300&height=300&fit=crop`,
    large: `${blob.url}?width=600&height=600&fit=crop`,
  };
}

/**
 * Upload a playlist cover image
 * @param file The image file to upload
 * @param playlistId The playlist ID to associate with the image
 * @returns Object with URLs for different image sizes
 */
export async function uploadPlaylistCover(file: File | Blob, playlistId: string) {
  const blob = await uploadFile(file, {
    filename: `${playlistId}.jpg`,
    folder: 'playlists',
    access: 'public',
  });
  
  return {
    original: blob.url,
    thumbnail: `${blob.url}?width=150&height=150&fit=crop`,
    medium: `${blob.url}?width=300&height=300&fit=crop`,
    large: `${blob.url}?width=600&height=600&fit=crop`,
    card: `${blob.url}?width=400&height=225&fit=crop`,
  };
}

/**
 * List files in a folder
 * @param options List options
 * @returns Array of blob metadata
 */
export async function listFiles(options?: {
  folder?: string;
  limit?: number;
  prefix?: string;
  cursor?: string;
}) {
  const { folder = '', limit = 100, prefix, cursor } = options || {};
  
  const pathname = folder ? `${folder}/` : '';
  
  return list({
    prefix: pathname + (prefix || ''),
    limit,
    cursor,
  });
}

/**
 * Delete a file from Vercel Blob storage
 * @param url The URL of the file to delete
 * @returns Whether the deletion was successful
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Check if a file exists in Vercel Blob storage
 * @param url The URL of the file to check
 * @returns Whether the file exists
 */
export async function fileExists(url: string): Promise<boolean> {
  try {
    const result = await head(url);
    return !!result;
  } catch (error) {
    return false;
  }
} 