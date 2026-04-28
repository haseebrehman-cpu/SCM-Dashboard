import useUser from "./useUser";

/**
 * Custom hook to manage and check user permissions based on department codes.
 */
export const usePermissions = () => {
  const { user } = useUser();
  const departmentCode = user?.department?.code;

  const isAdmin = departmentCode === "ADMIN";
  const isScm = departmentCode === "SCM";
  const isDevelopment = departmentCode === "DEVELOPMENT";
  const isManagement = departmentCode === "MANAGEMENT";
  const isFactory = departmentCode === "FACTORY";

  /**
   * @param endpoint - Optional endpoint name to check specific permissions
   * @param paramP - Optional 'p' query parameter value for context-specific rules (e.g., 'sd' for stock-performance)
   * @param method - The HTTP method being attempted (defaults to 'POST' for general write operations)
   * @returns boolean - Whether the user has write access
   */
  const canWrite = (
    endpoint?: string,
    paramP?: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  ): boolean => {
    if (isAdmin || isScm || isDevelopment) {
      return true;
    }

    if (isFactory) {
      if (
        endpoint === "stock-performance" &&
        paramP === "sd" &&
        (method === "PUT" || method === "PATCH")
      ) {
        return true;
      }
      return false;
    }

    return false;
  };
  const canDelete = (): boolean => {
    return isAdmin || isScm || isDevelopment;
  };

  const canRead = (): boolean => {
    return true;
  };

  return {
    isAdmin,
    isScm,
    isDevelopment,
    isManagement,
    isFactory,
    canRead,
    canWrite,
    canDelete,
    user,
  };
};

export default usePermissions;
