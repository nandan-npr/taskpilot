const mongoose = require("mongoose");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const { addHealthToTask } = require("../utils/taskHealth");

const createActivity = async (userId, taskId, action, message) => {
  await Activity.create({
    user: userId,
    task: taskId,
    action: action,
    message: message
  });
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    });

    const tasksWithHealth = tasks.map((task) => {
      return addHealthToTask(task);
    });

    return res.status(200).json({
      success: true,
      count: tasksWithHealth.length,
      tasks: tasksWithHealth
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks.",
      error: error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID."
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    return res.status(200).json({
      success: true,
      task: addHealthToTask(task)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task.",
      error: error.message
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, stage, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required."
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title,
      description: description || "",
      stage: stage || "Todo",
      priority: priority || "Medium",
      dueDate: dueDate || null
    });

    await createActivity(
      req.user._id,
      task._id,
      "CREATED",
      `Created task "${task.title}"`
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: addHealthToTask(task)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task.",
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID."
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    const oldStage = task.stage;

    task.title = req.body.title || task.title;
    task.description =
      req.body.description !== undefined ? req.body.description : task.description;
    task.stage = req.body.stage || task.stage;
    task.priority = req.body.priority || task.priority;
    task.dueDate =
      req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;

    await task.save();

    if (oldStage !== task.stage) {
      await createActivity(
        req.user._id,
        task._id,
        "MOVED",
        `Moved "${task.title}" from ${oldStage} to ${task.stage}`
      );
    } else {
      await createActivity(
        req.user._id,
        task._id,
        "UPDATED",
        `Updated task "${task.title}"`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task: addHealthToTask(task)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task.",
      error: error.message
    });
  }
};

const updateTaskStage = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { stage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID."
      });
    }

    if (!["Todo", "In Progress", "Done"].includes(stage)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stage value."
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    const oldStage = task.stage;

    task.stage = stage;

    await task.save();

    const action = stage === "Done" ? "COMPLETED" : "MOVED";

    await createActivity(
      req.user._id,
      task._id,
      action,
      `Moved "${task.title}" from ${oldStage} to ${stage}`
    );

    return res.status(200).json({
      success: true,
      message: "Task stage updated successfully.",
      task: addHealthToTask(task)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task stage.",
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID."
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    await createActivity(
      req.user._id,
      task._id,
      "DELETED",
      `Deleted task "${task.title}"`
    );

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete task.",
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStage,
  deleteTask
};