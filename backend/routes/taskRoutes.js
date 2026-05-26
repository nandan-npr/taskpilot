const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStage,
  deleteTask
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.patch("/:id/stage", protect, updateTaskStage);
router.delete("/:id", protect, deleteTask);

module.exports = router;