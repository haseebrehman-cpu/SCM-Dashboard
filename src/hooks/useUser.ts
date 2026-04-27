import { useAuthUserInfo } from "../api/auth";

/**
 * Custom hook to access the current user's information.
 * Uses the useAuthUserInfo query to fetch and cache user data.
 */
export const useUser = () => {
  const { data, isLoading, isError, error } = useAuthUserInfo();

  return {
    user: data?.user || null,
    isLoading,
    isError,
    error,
    isAuthenticated: !!data?.user,
  };
};

export default useUser;
