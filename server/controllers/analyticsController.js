// controllers/analyticsController.js
import User from '../models/User.js';
import WasteCollection from '../models/WasteCollection.js';
import FactoryWasteRequest from '../models/FactoryWasteRequest.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import Vehicle from '../models/Vehicle.js';

export const getSystemAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get date range for analytics (last 12 months)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Execute all analytics queries in parallel
    const [
      userStats,
      wasteStats,
      revenueStats,
      systemStats,
      userGrowth,
      wasteByType,
      monthlyRevenue
    ] = await Promise.all([
      getUserStatistics(),
      getWasteStatistics(startDate, endDate),
      getRevenueStatistics(startDate, endDate),
      getSystemStatistics(),
      getUserGrowth(startDate, endDate),
      getWasteByType(startDate, endDate),
      getMonthlyRevenue(startDate, endDate)
    ]);

    res.json({
      userStats,
      wasteStats,
      revenueStats,
      systemStats,
      userGrowth,
      wasteByType,
      monthlyRevenue
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserStatistics = async () => {
  const totalUsers = await User.countDocuments();
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const activeUsers = await User.countDocuments({ is_active: true });
  
  return {
    totalUsers,
    usersByRole: usersByRole.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    activeUsers,
    inactiveUsers: totalUsers - activeUsers
  };
};

const getWasteStatistics = async (startDate, endDate) => {
  const totalWaste = await WasteCollection.aggregate([
    {
      $match: {
        collection_date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalWeight: { $sum: '$weight' },
        averageWeight: { $avg: '$weight' },
        collectionCount: { $sum: 1 }
      }
    }
  ]);

  const wasteByMonth = await WasteCollection.aggregate([
    {
      $match: {
        collection_date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$collection_date' },
          month: { $month: '$collection_date' }
        },
        totalWeight: { $sum: '$weight' },
        collectionCount: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  return {
    totalWeight: totalWaste[0]?.totalWeight || 0,
    averageWeight: totalWaste[0]?.averageWeight || 0,
    collectionCount: totalWaste[0]?.collectionCount || 0,
    wasteByMonth
  };
};

const getRevenueStatistics = async (startDate, endDate) => {
  const revenueStats = await Order.aggregate([
    {
      $match: {
        order_date: { $gte: startDate, $lte: endDate },
        payment_status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total_amount' },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: '$total_amount' }
      }
    }
  ]);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        order_date: { $gte: startDate, $lte: endDate },
        payment_status: 'completed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$order_date' },
          month: { $month: '$order_date' }
        },
        revenue: { $sum: '$total_amount' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  return {
    totalRevenue: revenueStats[0]?.totalRevenue || 0,
    orderCount: revenueStats[0]?.orderCount || 0,
    averageOrderValue: revenueStats[0]?.averageOrderValue || 0,
    monthlyRevenue
  };
};

const getSystemStatistics = async () => {
  const pendingRequests = await FactoryWasteRequest.countDocuments({ status: 'pending' });
  const activeVehicles = await Vehicle.countDocuments({ status: 'active' });
  const activeCoupons = await Coupon.countDocuments({ status: 'active' });
  
  // Calculate collection efficiency (completed vs scheduled)
  const totalScheduled = await WasteCollection.countDocuments();
  const completedCollections = await WasteCollection.countDocuments({
    collection_date: { $exists: true, $ne: null }
  });

  const efficiency = totalScheduled > 0 ? (completedCollections / totalScheduled) * 100 : 0;

  return {
    pendingRequests,
    activeVehicles,
    activeCoupons,
    collectionEfficiency: Math.round(efficiency * 100) / 100,
    totalScheduled,
    completedCollections
  };
};

const getUserGrowth = async (startDate, endDate) => {
  const userGrowth = await User.aggregate([
    {
      $match: {
        created_at: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' }
        },
        residents: {
          $sum: { $cond: [{ $eq: ['$role', 'resident'] }, 1, 0] }
        },
        factories: {
          $sum: { $cond: [{ $eq: ['$role', 'factory'] }, 1, 0] }
        },
        drivers: {
          $sum: { $cond: [{ $eq: ['$role', 'driver'] }, 1, 0] }
        },
        total: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  return userGrowth;
};

const getWasteByType = async (startDate, endDate) => {
  const wasteByType = await WasteCollection.aggregate([
    {
      $match: {
        collection_date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$waste_type',
        totalWeight: { $sum: '$weight' },
        collectionCount: { $sum: 1 }
      }
    }
  ]);

  return wasteByType;
};

const getMonthlyRevenue = async (startDate, endDate) => {
  return await Order.aggregate([
    {
      $match: {
        order_date: { $gte: startDate, $lte: endDate },
        payment_status: 'completed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$order_date' },
          month: { $month: '$order_date' }
        },
        revenue: { $sum: '$total_amount' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
};