const normalizeDate = (dateValue) => {
  const date = new Date(dateValue);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const calculateTaskHealth = (task) => {
  if (task.stage === "Done") {
    return "Healthy";
  }

  if (!task.dueDate) {
    if (task.priority === "High" && task.stage === "Todo") {
      return "Needs Attention";
    }

    return "Healthy";
  }

  const today = normalizeDate(new Date());
  const dueDate = normalizeDate(task.dueDate);

  const oneDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.round((dueDate - today) / oneDay);

  if (daysLeft < 0) {
    return "Overdue";
  }

  if (task.priority === "High" && daysLeft <= 1) {
    return "High Risk";
  }

  if (task.priority === "Medium" && daysLeft <= 1) {
    return "Needs Attention";
  }

  if (task.priority === "High" && task.stage === "Todo") {
    return "Needs Attention";
  }

  return "Healthy";
};

const addHealthToTask = (task) => {
  const plainTask = task.toObject();

  plainTask.healthStatus = calculateTaskHealth(plainTask);

  return plainTask;
};

module.exports = {
  calculateTaskHealth,
  addHealthToTask
};