const useDashboard = (userRole, authData) => {
  // Determine effective user role, falling back to "1100" if not provided
  const effectiveUserRole = userRole || authData?.role || "1100";

  return { effectiveUserRole };
};

export default useDashboard;