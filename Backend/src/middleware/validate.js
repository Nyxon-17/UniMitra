export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params
      };

      const result = schema.safeParse(dataToValidate);
      if (!result.success) {
        const issues = result.error.errors.map(err => ({
          field: err.path.slice(1).join('.'),
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data provided.',
            details: issues
          }
        });
      }

      // Assign parsed/sanitized data back
      if (result.data.body) req.body = result.data.body;
      if (result.data.query) req.query = result.data.query;
      if (result.data.params) req.params = result.data.params;

      next();
    } catch (err) {
      next(err);
    }
  };
};

