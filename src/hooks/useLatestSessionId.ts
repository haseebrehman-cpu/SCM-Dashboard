import { useLatestUploadSession } from '../api/scmFileUpload';

/**
 * Custom hook to get the latest session ID from the files log grid
 * Returns the most recent session ID (first session in the array)
 */
export const useLatestSessionId = (): number | null => {
  const { data: latestSessions } = useLatestUploadSession();
  
  if (!latestSessions?.sessions || latestSessions.sessions.length === 0) {
    return null;
  }
  
  // Return the ID of the first (most recent) session
  return latestSessions.sessions[0].session.id;
};

/**
 * Custom hook to get all session IDs from the files log grid
 * Returns an array of all session IDs ordered by most recent first
 */
export const useAllSessionIds = (): number[] => {
  const { data: latestSessions } = useLatestUploadSession();
  
  if (!latestSessions?.sessions || latestSessions.sessions.length === 0) {
    return [];
  }
  
  // Return all session IDs ordered by most recent first
  return latestSessions.sessions.map(session => session.session.id);
};
