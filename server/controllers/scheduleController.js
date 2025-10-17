import CollectionSchedule from '../models/CollectionSchedule.js';
import Resident from '../models/Resident.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

// Create new schedule
export const createSchedule = async (req, res) => {
  try {
    const {
      route_id,
      collection_date,
      start_time,
      end_time,
      day_of_week,
      vehicle_id,
      driver_id,
      resident_ids
    } = req.body;

    // Validate driver exists
    const driver = await User.findOne({ user_id: driver_id });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Validate vehicle exists
    const vehicle = await Vehicle.findOne({ vehicle_id });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Validate residents exist
    if (resident_ids && resident_ids.length > 0) {
      const residents = await Resident.find({ resident_id: { $in: resident_ids } });
      if (residents.length !== resident_ids.length) {
        return res.status(404).json({
          success: false,
          message: 'Some residents not found'
        });
      }
    }

    const schedule = new CollectionSchedule({
      schedule_id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      route_id,
      collection_date,
      start_time,
      end_time,
      day_of_week,
      vehicle_id,
      driver_id,
      resident_ids: resident_ids || [],
      status: 'scheduled'
    });

    await schedule.save();

    // Update vehicle with assigned driver
    await Vehicle.findOneAndUpdate(
      { vehicle_id },
      { driver_id }
    );

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating schedule',
      error: error.message
    });
  }
};

// Get all schedules with resident details
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await CollectionSchedule.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'driver_id',
          foreignField: 'user_id',
          as: 'driver_details'
        }
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle_id',
          foreignField: 'vehicle_id',
          as: 'vehicle_details'
        }
      },
      {
        $lookup: {
          from: 'residents',
          localField: 'resident_ids',
          foreignField: 'resident_id',
          as: 'resident_details'
        }
      },
      {
        $unwind: {
          path: '$driver_details',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$vehicle_details',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          schedule_id: 1,
          route_id: 1,
          collection_date: 1,
          start_time: 1,
          end_time: 1,
          day_of_week: 1,
          vehicle_id: 1,
          driver_id: 1,
          resident_ids: 1,
          status: 1,
          created_at: 1,
          driver_name: '$driver_details.full_name',
          driver_phone: '$driver_details.phone',
          vehicle_number: '$vehicle_details.vehicle_number',
          vehicle_type: '$vehicle_details.vehicle_type',
          capacity: '$vehicle_details.capacity',
          resident_details: {
            $map: {
              input: '$resident_details',
              as: 'resident',
              in: {
                resident_id: '$$resident.resident_id',
                full_name: '$$resident.full_name',
                phone: '$$resident.phone',
                house_number: '$$resident.house_number',
                street: '$$resident.street',
                area: '$$resident.area',
                city: '$$resident.city',
                reward_points: '$$resident.reward_points',
                total_waste_contributed: '$$resident.total_waste_contributed'
              }
            }
          },
          // Fix: Check if resident_ids exists and is an array before using $size
          resident_count: {
            $cond: {
              if: { $isArray: '$resident_ids' },
              then: { $size: '$resident_ids' },
              else: 0
            }
          }
        }
      },
      {
        $sort: { collection_date: 1, start_time: 1 }
      }
    ]);

    res.json({
      success: true,
      data: schedules,
      count: schedules.length
    });
  } catch (error) {
    console.error('Error in getAllSchedules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message
    });
  }
};

// Update schedule
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate residents if being updated
    if (updateData.resident_ids && updateData.resident_ids.length > 0) {
      const residents = await Resident.find({ resident_id: { $in: updateData.resident_ids } });
      if (residents.length !== updateData.resident_ids.length) {
        return res.status(404).json({
          success: false,
          message: 'Some residents not found'
        });
      }
    }

    const schedule = await CollectionSchedule.findOneAndUpdate(
      { schedule_id: id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: error.message
    });
  }
};

// Delete schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await CollectionSchedule.findOneAndDelete({ schedule_id: id });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting schedule',
      error: error.message
    });
  }
};

// Get available drivers
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ 
      is_active: true,
      role: "driver",
    }).select('user_id full_name phone email');

    res.json({
      success: true,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching drivers',
      error: error.message
    });
  }
};

// Get available vehicles
export const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ 
      status: 'active' 
    }).select('vehicle_id vehicle_number vehicle_type capacity');

    res.json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// Get all residents for schedule creation
export const getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.find({})
      .select('resident_id full_name phone house_number street area city reward_points total_waste_contributed')
      .sort({ full_name: 1 });

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

// Get driver's schedules with resident details
export const getDriverSchedules = async (req, res) => {
  try {
    const driverId = req.user.user_id;

    const schedules = await CollectionSchedule.aggregate([
      {
        $match: { driver_id: driverId }
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle_id',
          foreignField: 'vehicle_id',
          as: 'vehicle_details'
        }
      },
      {
        $lookup: {
          from: 'routes',
          localField: 'route_id',
          foreignField: 'route_id',
          as: 'route_details'
        }
      },
      {
        $lookup: {
          from: 'residents',
          localField: 'resident_ids',
          foreignField: 'resident_id',
          as: 'resident_details'
        }
      },
      {
        $unwind: {
          path: '$vehicle_details',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$route_details',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          schedule_id: 1,
          route_id: 1,
          route_name: '$route_details.route_name',
          collection_date: 1,
          start_time: 1,
          end_time: 1,
          day_of_week: 1,
          vehicle_id: 1,
          driver_id: 1,
          resident_ids: 1,
          status: 1,
          created_at: 1,
          vehicle_number: '$vehicle_details.vehicle_number',
          vehicle_type: '$vehicle_details.vehicle_type',
          capacity: '$vehicle_details.capacity',
          area: '$route_details.area',
          resident_details: {
            $map: {
              input: '$resident_details',
              as: 'resident',
              in: {
                resident_id: '$$resident.resident_id',
                full_name: '$$resident.full_name',
                phone: '$$resident.phone',
                house_number: '$$resident.house_number',
                street: '$$resident.street',
                area: '$$resident.area',
                city: '$$resident.city'
              }
            }
          },
          resident_count: { $size: '$resident_ids' }
        }
      },
      {
        $sort: { collection_date: 1, start_time: 1 }
      }
    ]);

    res.json({
      success: true,
      data: schedules,
      count: schedules.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver schedules',
      error: error.message
    });
  }
};

// Update schedule status
export const updateScheduleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const schedule = await CollectionSchedule.findOneAndUpdate(
      { schedule_id: id, driver_id: req.user.user_id },
      { status },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found or not assigned to you'
      });
    }

    res.json({
      success: true,
      message: 'Schedule status updated successfully',
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating schedule status',
      error: error.message
    });
  }
};