import * as universityService from './universities.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getAllUniversities = async (req, res, next) => {
  try {
    const list = await universityService.getAllUniversities();
    return ApiResponse.success(res, list, 'Universities retrieved successfully.');
  } catch (err) {
    next(err);
  }
};

export const getUniversityByCode = async (req, res, next) => {
  try {
    const university = await universityService.getUniversityByCode(req.params.code);
    return ApiResponse.success(res, university, 'University profile retrieved.');
  } catch (err) {
    next(err);
  }
};

export const compareUniversities = async (req, res, next) => {
  try {
    const { codeA, codeB } = req.query;
    if (!codeA || !codeB) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAMS', message: 'Query params codeA and codeB are required for comparison.' },
      });
    }
    const comparison = await universityService.compareUniversities(codeA, codeB);
    return ApiResponse.success(res, comparison, 'Universities comparison generated.');
  } catch (err) {
    next(err);
  }
};

