import Resident from '../models/Resident.js';
import User from '../models/User.js';

export const getAllResidentsWithDetails = async (req, res) => {
  try {
    const residents = await Resident.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'user_details'
        }
      },
      {
        $unwind: '$user_details'
      },
      {
        $project: {
          resident_id: 1,
          user_id: 1,
          house_number: 1,
          street: 1,
          area: 1,
          city: 1,
          postal_code: 1,
          reward_points: 1,
          total_waste_contributed: 1,
          created_at: 1,
          full_name: '$user_details.full_name',
          email: '$user_details.email',
          phone: '$user_details.phone',
          address: '$user_details.address',
          is_active: '$user_details.is_active',
          last_login: '$user_details.last_login'
        }
      },
      {
        $sort: { created_at: -1 }
      }
    ]);

    res.json({
      success: true,
      data: residents,
      count: residents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching residents',
      error: error.message
    });
  }
};