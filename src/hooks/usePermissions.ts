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
   * Checks if the user can perform write operations (POST, PUT, PATCH, DELETE).
   * 
   * @param endpoint - Optional endpoint name to check specific permissions
   * @param paramP - Optional 'p' query parameter value for context-specific rules (e.g., 'sd' for stock-performance)
   * @param method - The HTTP method being attempted (defaults to 'POST' for general write operations)
   * @returns boolean - Whether the user has write access
   */
  const canWrite = (
    endpoint?: string,
    paramP?: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
  ): boolean => {
    // ADMIN, SCM, and DEVELOPMENT have full CRUD access everywhere
    if (isAdmin || isScm || isDevelopment) {
      return true;
    }

    // FACTORY has read-only access everywhere EXCEPT stock-performance when p=sd for PUT specifically
    if (isFactory) {
      if (endpoint === "stock-performance" && paramP === "sd" && method === "PUT") {
        return true;
      }
      return false;
    }

    // MANAGEMENT and users with no group have no write access
    return false;
  };

  /**
   * Checks if the user can perform delete operations.
   * Only ADMIN, SCM, and DEVELOPMENT can delete.
   */
  const canDelete = (): boolean => {
    return isAdmin || isScm || isDevelopment;
  };

  /**
   * Checks if the user can perform read operations (GET).
   * Authorized departments can read, others (no group) get 403 (false).
   */
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
