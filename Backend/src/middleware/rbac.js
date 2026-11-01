export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required for this operation.'
        }
      });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    // Super Admin has access to all admin routes
    if (userRole === 'super_admin' && normalizedAllowed.includes('admin')) {
      return next();
    }

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Role '${req.user.role}' does not have sufficient permissions for this endpoint.`
        }
      });
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin', 'super_admin']);
export const requireFaculty = requireRole(['faculty', 'admin', 'super_admin']);
export const requireStudent = requireRole(['student', 'faculty', 'admin', 'super_admin']);

