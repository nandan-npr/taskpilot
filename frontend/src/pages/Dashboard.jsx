import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  RefreshCcw,
  TimerReset
} from "lucide-react";
import { toast } from "react-toastify";

import API from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";

const stages = ["Todo", "In Progress", "Done"];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const [tasksLoading, setTasksLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      setError("");

      const response = await API.get("/tasks");

      setTasks(response.data.tasks || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load tasks");
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivityLoading(true);

      const response = await API.get("/activities");

      setActivities(response.data.activities || []);
    } catch (error) {
      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchActivities();
  }, []);

  const analytics = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter(
      (task) => task.stage === "In Progress"
    ).length;
    const done = tasks.filter((task) => task.stage === "Done").length;

    const risky = tasks.filter((task) => {
      return (
        task.healthStatus === "High Risk" ||
        task.healthStatus === "Needs Attention" ||
        task.healthStatus === "Overdue"
      );
    }).length;

    const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

    return {
      total,
      inProgress,
      done,
      risky,
      completionRate
    };
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const priorityWeight = {
      High: 1,
      Medium: 2,
      Low: 3
    };

    const healthWeight = {
      Overdue: 1,
      "High Risk": 2,
      "Needs Attention": 3,
      Healthy: 4
    };

    return [...tasks].sort((firstTask, secondTask) => {
      const firstHealth = healthWeight[firstTask.healthStatus] || 5;
      const secondHealth = healthWeight[secondTask.healthStatus] || 5;

      if (firstHealth !== secondHealth) {
        return firstHealth - secondHealth;
      }

      const firstPriority = priorityWeight[firstTask.priority] || 4;
      const secondPriority = priorityWeight[secondTask.priority] || 4;

      if (firstPriority !== secondPriority) {
        return firstPriority - secondPriority;
      }

      const firstDate = firstTask.dueDate
        ? new Date(firstTask.dueDate).getTime()
        : Infinity;
      const secondDate = secondTask.dueDate
        ? new Date(secondTask.dueDate).getTime()
        : Infinity;

      return firstDate - secondDate;
    });
  }, [tasks]);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (payload) => {
    try {
      setSubmitting(true);

      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, payload);
        toast.success("Task updated successfully");
      } else {
        await API.post("/tasks", payload);
        toast.success("Task created successfully");
      }

      setIsModalOpen(false);
      setEditingTask(null);

      await fetchTasks();
      await fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/tasks/${taskId}`);

      toast.success("Task deleted successfully");

      await fetchTasks();
      await fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleMoveTask = async (taskId, nextStage) => {
    try {
      await API.patch(`/tasks/${taskId}/stage`, {
        stage: nextStage
      });

      toast.success(`Task moved to ${nextStage}`);

      await fetchTasks();
      await fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move task");
    }
  };

  const handleFocusTask = (taskId) => {
    navigate(`/focus/${taskId}`);
  };

  const refreshDashboard = async () => {
    await fetchTasks();
    await fetchActivities();
    toast.success("Dashboard refreshed");
  };

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#1F1D1A]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#295142]">
              Dashboard
            </p>

            <h1 className="font-display text-4xl sm:text-5xl mt-2">
              Good to see you, {user?.name}.
            </h1>

            <p className="text-[#6F675D] mt-3 max-w-2xl">
              Add tasks, move them through stages, and keep your progress
              visible without making the workflow complicated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={refreshDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8C9B3] bg-white px-5 py-3.5 text-[#1F1D1A] font-extrabold hover:bg-[#F1E7D8] transition"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F1D1A] px-6 py-3.5 text-white font-extrabold hover:bg-[#295142] transition"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SummaryCard
            title="Total Tasks"
            value={analytics.total}
            note={`${analytics.completionRate}% completion rate`}
            icon={<ListTodo size={22} />}
          />

          <SummaryCard
            title="In Progress"
            value={analytics.inProgress}
            note="Tasks currently being handled"
            icon={<Clock3 size={22} />}
          />

          <SummaryCard
            title="Completed"
            value={analytics.done}
            note="Finished work"
            icon={<CheckCircle2 size={22} />}
          />

          <SummaryCard
            title="Needs Attention"
            value={analytics.risky}
            note="Risky or overdue tasks"
            icon={<AlertTriangle size={22} />}
          />
        </section>

        {error && (
          <section className="mb-6 rounded-3xl border border-[#F1C9C2] bg-[#FFF1EF] p-5 text-[#8B2E20] font-bold">
            {error}
          </section>
        )}

        <section className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-5 soft-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-extrabold">Workflow Board</h2>
                <p className="text-sm text-[#6F675D] mt-1">
                  Tasks are sorted by health status, priority, and due date.
                </p>
              </div>

              <div className="rounded-full border border-[#D8C9B3] bg-[#F8F3EA] px-4 py-2 text-sm font-extrabold text-[#295142]">
                {analytics.total} active records
              </div>
            </div>

            {tasksLoading ? (
              <TaskBoardLoading />
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {stages.map((stage) => (
                  <TaskColumn
                    key={stage}
                    title={stage}
                    description={getStageDescription(stage)}
                    tasks={sortedTasks.filter((task) => task.stage === stage)}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                    onMove={handleMoveTask}
                    onFocus={handleFocusTask}
                    onCreate={openCreateModal}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-6 card-shadow">
              <div className="h-12 w-12 rounded-full bg-[#295142] text-white flex items-center justify-center mb-5">
                <TimerReset size={22} />
              </div>

              <h3 className="text-xl font-extrabold">Focus Mode</h3>
              <p className="text-sm leading-6 text-[#6F675D] mt-2">
                Open any task in focus mode to view the task clearly, start a
                25-minute session, and move it forward when ready.
              </p>

              <button
                onClick={() => {
                  const firstActiveTask = sortedTasks.find(
                    (task) => task.stage !== "Done"
                  );

                  if (firstActiveTask) {
                    navigate(`/focus/${firstActiveTask._id}`);
                  } else {
                    toast.info("Create an active task to use focus mode");
                  }
                }}
                className="mt-5 w-full rounded-full border border-[#D8C9B3] bg-[#F8F3EA] py-3 font-extrabold text-[#1F1D1A] hover:bg-[#EFE7D8] transition"
              >
                Start Focus
              </button>
            </div>

            <div className="rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-6 card-shadow">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-extrabold">Activity</h3>
                  <p className="text-xs text-[#6F675D] mt-1">
                    Latest task changes
                  </p>
                </div>

                <CalendarDays size={20} className="text-[#295142]" />
              </div>

              {activityLoading ? (
                <div className="space-y-4">
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                </div>
              ) : activities.length === 0 ? (
                <div className="rounded-2xl border border-[#E5D9C7] bg-[#F8F3EA] p-4">
                  <p className="text-sm font-bold text-[#1F1D1A]">
                    No activity yet
                  </p>
                  <p className="text-xs leading-5 text-[#6F675D] mt-1">
                    Create or update a task to see activity here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 8).map((activity) => (
                    <ActivityItem key={activity._id} activity={activity} />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        submitting={submitting}
      />
    </div>
  );
};

const SummaryCard = ({ title, value, note, icon }) => {
  return (
    <div className="rounded-[1.7rem] border border-[#D8C9B3] bg-[#FFFDF8] p-5 card-shadow">
      <div className="flex items-center justify-between mb-5">
        <div className="h-11 w-11 rounded-full bg-[#F1E7D8] text-[#295142] flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-sm font-bold text-[#6F675D]">{title}</p>
      <h3 className="text-4xl font-extrabold mt-1">{value}</h3>
      <p className="text-xs text-[#6F675D] mt-3 leading-5">{note}</p>
    </div>
  );
};

const TaskColumn = ({
  title,
  description,
  tasks,
  onEdit,
  onDelete,
  onMove,
  onFocus,
  onCreate
}) => {
  return (
    <div className="rounded-[1.7rem] border border-[#E5D9C7] bg-[#F8F3EA] p-4 min-h-[430px]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold">{title}</h3>
          <p className="text-xs font-semibold text-[#6F675D] mt-1">
            {description}
          </p>
        </div>

        <span className="rounded-full bg-white border border-[#E5D9C7] px-3 py-1 text-xs font-extrabold text-[#6F675D]">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="h-[320px] rounded-2xl border border-dashed border-[#D8C9B3] bg-white/60 flex items-center justify-center text-center p-5">
          <div>
            <p className="font-extrabold text-[#1F1D1A]">No tasks here</p>
            <p className="text-sm text-[#6F675D] leading-6 mt-2">
              {title === "Todo"
                ? "Add a new task to start planning your work."
                : title === "In Progress"
                ? "Move a task here when you start working on it."
                : "Completed tasks will appear here."}
            </p>

            {title === "Todo" && (
              <button
                onClick={onCreate}
                className="mt-4 rounded-full bg-[#1F1D1A] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#295142] transition"
              >
                Create task
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskBoardLoading = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[1, 2, 3].map((column) => (
        <div
          key={column}
          className="rounded-[1.7rem] border border-[#E5D9C7] bg-[#F8F3EA] p-4 min-h-[430px]"
        >
          <div className="h-5 w-24 bg-[#E5D9C7] rounded-full animate-pulse mb-5"></div>

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#E5D9C7] bg-white p-4"
              >
                <div className="h-4 w-3/4 bg-[#E5D9C7] rounded-full animate-pulse"></div>
                <div className="h-3 w-full bg-[#EFE7D8] rounded-full animate-pulse mt-4"></div>
                <div className="h-3 w-2/3 bg-[#EFE7D8] rounded-full animate-pulse mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const formattedDate = new Date(activity.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="flex gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#295142] shrink-0"></div>

      <div>
        <p className="text-sm font-bold text-[#1F1D1A] leading-5">
          {activity.message}
        </p>
        <p className="text-xs text-[#6F675D] mt-1">{formattedDate}</p>
      </div>
    </div>
  );
};

const ActivitySkeleton = () => {
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#E5D9C7] shrink-0"></div>
      <div className="w-full">
        <div className="h-3 w-full rounded-full bg-[#E5D9C7] animate-pulse"></div>
        <div className="h-3 w-20 rounded-full bg-[#EFE7D8] animate-pulse mt-2"></div>
      </div>
    </div>
  );
};

const getStageDescription = (stage) => {
  if (stage === "Todo") {
    return "Planned tasks";
  }

  if (stage === "In Progress") {
    return "Currently active";
  }

  return "Completed work";
};

export default Dashboard;