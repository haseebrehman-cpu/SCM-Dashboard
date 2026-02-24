/**
 * Utility functions to check if an upload has been made today
 */

/**
 * Extracts the date part from a timestamp string (format: "2026-02-24 13:33:52 PKT")
 * @param timestamp - The timestamp string from the upload
 * @returns Date object at start of day or null if parsing fails
 */
export const getDateFromTimestamp = (timestamp: string): Date | null => {
  try {
    // Extract the date part (format: "2026-02-24")
    const datePart = timestamp.split(' ')[0];
    if (!datePart) return null;

    // Create date object - adding 'T00:00:00' to ensure correct UTC date parsing
    const dateObj = new Date(datePart + 'T00:00:00Z');
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    return dateObj;
  } catch {
    return null;
  }
};

/**
 * Checks if a given date is today
 * @param date - The date to check
 * @returns true if the date is today, false otherwise
 */
export const isDateToday = (date: Date | null): boolean => {
  if (!date) return false;

  const today = new Date();
  // Compare only the date parts (year, month, day)
  return (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate()
  );
};

/**
 * Checks if the latest upload session is from today
 * @param latestUploadTimestamp - The upload_timestamp from the latest session
 * @returns true if latest upload is from today, false otherwise
 */
export const isLatestUploadFromToday = (latestUploadTimestamp: string | undefined): boolean => {
  if (!latestUploadTimestamp) return false;

  const uploadDate = getDateFromTimestamp(latestUploadTimestamp);
  return isDateToday(uploadDate);
};

/**
 * Formats a timestamp for display in user-friendly messages
 * @param timestamp - The timestamp string
 * @returns Formatted date string or the original timestamp if parsing fails
 */
export const formatTimestampForDisplay = (timestamp: string): string => {
  try {
    const date = new Date(timestamp.replace(' PKT', '').replace(' ', 'T'));
    if (isNaN(date.getTime())) {
      return timestamp;
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return timestamp;
  }
};
