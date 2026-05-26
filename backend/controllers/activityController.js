const Activity = require("../models/Activity");

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities: activities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activities.",
      error: error.message
    });
  }
};

module.exports = {
  getActivities
};