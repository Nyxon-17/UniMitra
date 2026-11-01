/**
 * Standardized API response helper
 */
export class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
    const payload = {
      success: true,
      message,
      data,
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }

  static created(res, data = null, message = 'Created successfully', meta = null) {
    return ApiResponse.success(res, data, message, 201, meta);
  }

  static paginated(res, items, total, page = 1, limit = 20, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / (Number(limit) || 1)),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  }
}
