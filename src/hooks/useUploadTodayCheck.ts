import { useMemo } from 'react';
import { useLatestUploadSession } from '../api/scmFileUpload';
import { isLatestUploadFromToday, formatTimestampForDisplay } from '../utils/uploadDateChecker';

/**
 * Hook to check if an upload has been made today and return relevant info
 * Used to prevent multiple uploads on the same day
 * hook will return false for uploadedToday and null for errorMessage.
 */
export const useUploadTodayCheck = (enabled: boolean = true) => {
  const { data: uploadSessionData, isLoading } = useLatestUploadSession();

  const uploadTodayInfo = useMemo(() => {
    if (!uploadSessionData?.sessions || uploadSessionData.sessions.length === 0) {
      return {
        uploadedToday: false,
        latestUploadTimestamp: null,
        formattedTimestamp: null,
        errorMessage: null,
      };
    }

    const latestSession = uploadSessionData.sessions[0];
    const timestamp = latestSession.session.upload_timestamp;
    const uploadedToday = isLatestUploadFromToday(timestamp) && enabled;

    return {
      uploadedToday,
      latestUploadTimestamp: timestamp,
      formattedTimestamp: (uploadedToday && enabled) ? formatTimestampForDisplay(timestamp) : null,
      errorMessage: (uploadedToday && enabled)
        ? `An upload has already been made today at ${formatTimestampForDisplay(timestamp)}. Please delete the existing entry before uploading again.`
        : null,
    };
  }, [uploadSessionData, enabled]);

  return {
    ...uploadTodayInfo,
    isLoading,
  };
};
