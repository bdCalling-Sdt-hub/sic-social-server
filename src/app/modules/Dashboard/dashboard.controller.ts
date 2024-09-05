import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

const getDashboardMetrics = catchAsync(async (req, res) => {
  const result = await DashboardServices.getDashboardMetricsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard metrics retrieved successfully!',
    data: result,
  });
});

const getUserCountsByYear = catchAsync(async (req, res) => {
  const result = await DashboardServices.getUserCountsByYearFromDB(
    Number(req?.params?.year),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Monthly user counts for ${req?.params?.year} retrieved successfully!`,
    data: result,
  });
});

const getDonerCountsByYear = catchAsync(async (req, res) => {
  const result = await DashboardServices.getDonerCountsByYearFromDB(
    Number(req?.params?.year),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Monthly doners counts for ${req?.params?.year} retrieved successfully!`,
    data: result,
  });
});

const getDonationAmountsCountByYear = catchAsync(async (req, res) => {
  const result = await DashboardServices.getDonationAmountsCountByYearFromDB(
    Number(req?.params?.year),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Monthly donation amounts for ${req?.params?.year} retrieved successfully!`,
    data: result,
  });
});

export const DashboardControllers = {
  getDashboardMetrics,
  getUserCountsByYear,
  getDonerCountsByYear,
  getDonationAmountsCountByYear,
};
