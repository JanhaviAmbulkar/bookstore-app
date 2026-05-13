const recyclingService = require('../services/recyclingService');
const { successResponse } = require('../utils/response');

// Requests
const submitRequest = async (req, res, next) => {
  try {
    const request = await recyclingService.submitRequest(req.user._id, req.body);
    return successResponse(res, 201, 'Recycling request submitted successfully', { request });
  } catch (error) {
    next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await recyclingService.getUserRequests(req.user._id);
    return successResponse(res, 200, 'Recycling requests fetched', { requests });
  } catch (error) {
    next(error);
  }
};

const getRequest = async (req, res, next) => {
  try {
    const request = await recyclingService.getRequestById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return successResponse(res, 200, 'Request fetched', { request });
  } catch (error) {
    next(error);
  }
};

// Admin - all requests
const getAllRequests = async (req, res, next) => {
  try {
    const result = await recyclingService.getAllRequests(req.query);
    return successResponse(res, 200, 'All recycling requests fetched', result);
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const request = await recyclingService.updateRequestStatus(
      req.params.id,
      req.body
    );
    return successResponse(res, 200, 'Request status updated', { request });
  } catch (error) {
    next(error);
  }
};

// Companies
const getCompanies = async (req, res, next) => {
  try {
    const companies = await recyclingService.getCompanies();
    return successResponse(res, 200, 'Companies fetched', { companies });
  } catch (error) {
    next(error);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const company = await recyclingService.getCompanyById(req.params.id);
    return successResponse(res, 200, 'Company fetched', { company });
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const company = await recyclingService.createCompany(req.body);
    return successResponse(res, 201, 'Company created', { company });
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await recyclingService.updateCompany(req.params.id, req.body);
    return successResponse(res, 200, 'Company updated', { company });
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    await recyclingService.deleteCompany(req.params.id);
    return successResponse(res, 200, 'Company removed');
  } catch (error) {
    next(error);
  }
};

const sendContactMessage = async (req, res, next) => {
  try {
    await recyclingService.sendContactMessage(req.params.id, req.body);
    return successResponse(res, 200, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
};

// Impact Config
const getImpactConfig = async (req, res, next) => {
  try {
    const config = await recyclingService.getImpactConfig();
    return successResponse(res, 200, 'Impact config fetched', { config });
  } catch (error) {
    next(error);
  }
};

const updateImpactConfig = async (req, res, next) => {
  try {
    const config = await recyclingService.updateImpactConfig(req.body, req.user._id);
    return successResponse(res, 200, 'Impact config updated', { config });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRequest, getMyRequests, getRequest, getAllRequests, updateRequestStatus,
  getCompanies, getCompany, createCompany, updateCompany, deleteCompany, sendContactMessage,
  getImpactConfig, updateImpactConfig,
};
