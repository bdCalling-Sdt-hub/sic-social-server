import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { User } from '../User/user.model';
import { monthNames } from '../../constants/month.constant';
import { Payment } from '../Payment/payment.model';

const getDashboardMetricsFromDB = async () => {
  // Get today's start and end dates
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  // Get total users
  const totalUser = await User.countDocuments({
    role: 'user',
    isVerified: true,
  });

  const todayUser = await User.countDocuments({
    role: 'user',
    isVerified: true,
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  // Get total donors
  const totalDoner = await Payment.countDocuments();

  // Get donors created today
  const todayDoner = await Payment.countDocuments({
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  // Get total donation amount
  const totalDonationResult = await Payment.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
  const totalDonation = totalDonationResult[0]?.totalAmount || 0;

  // Get donations created today
  const todayDonationResult = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: todayStart, $lte: todayEnd },
      },
    },
    {
      $group: {
        _id: null,
        todayAmount: { $sum: '$amount' },
      },
    },
  ]);
  const todayDonation = todayDonationResult[0]?.todayAmount || 0;

  return {
    totalUser,
    todayUser,
    totalDoner,
    todayDoner,
    totalDonation,
    todayDonation,
  };
};

const getUserCountsByYearFromDB = async (year: number) => {
  const monthlyUserCounts = [];

  for (let month = 1; month <= 12; month++) {
    // Define the start and end dates for the current month
    const startDate = startOfMonth(new Date(year, month - 1, 1));
    const endDate = endOfMonth(new Date(year, month - 1, 1));

    // Aggregate user counts for the specified month
    const userCounts = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          role: 'user',
          isVerified: true,
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    // Add the result to monthly User Counts
    monthlyUserCounts.push({
      month: monthNames[month - 1],
      totalUsers: userCounts?.length > 0 ? userCounts[0]?.count : 0,
    });
  }

  return monthlyUserCounts;
};

const getDonerCountsByYearFromDB = async (year: number) => {
  const monthlyDonerCounts = [];

  for (let month = 1; month <= 12; month++) {
    // Define the start and end dates for the current month
    const startDate = startOfMonth(new Date(year, month - 1, 1));
    const endDate = endOfMonth(new Date(year, month - 1, 1));

    // Aggregate user counts for the specified month
    const donerCounts = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    // Add the result to monthly User Counts
    monthlyDonerCounts?.push({
      month: monthNames[month - 1],
      totalDoners: donerCounts?.length > 0 ? donerCounts[0]?.count : 0,
    });
  }

  return monthlyDonerCounts;
};

const getDonationAmountsCountByYearFromDB = async (year: number) => {
  const monthlyDonationAmounts = [];

  for (let month = 1; month <= 12; month++) {
    // Define the start and end dates for the current month
    const startDate = startOfMonth(new Date(year, month - 1, 1));
    const endDate = endOfMonth(new Date(year, month - 1, 1));

    // Aggregate user counts for the specified month
    const donationAmountsCount = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: '$amount' },
        },
      },
    ]);

    // Add the result to monthly User Counts
    monthlyDonationAmounts?.push({
      month: monthNames[month - 1],
      totalAmount:
        donationAmountsCount?.length > 0 ? donationAmountsCount[0]?.count : 0,
    });
  }

  return monthlyDonationAmounts;
};

export const DashboardServices = {
  getDashboardMetricsFromDB,
  getUserCountsByYearFromDB,
  getDonerCountsByYearFromDB,
  getDonationAmountsCountByYearFromDB,
};
