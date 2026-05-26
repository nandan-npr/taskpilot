import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Edit3,
  TimerReset,
  Trash2
} from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete, onMove, onFocus }) => {
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "No due date";
    }

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getNextStage = (stage) => {
    if (stage === "Todo") {
      return "In Progress";
    }

    if (stage === "In Progress") {
      return "Done";
    }

    return null;
  };

  const nextStage = getNextStage(task.stage);

  return (
    <div className="rounded-2xl border border-[#E5D9C7] bg-white p-4 card-shadow hover:-translate-y-0.5 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-extrabold leading-5 text-[#1F1D1A]">
            {task.title}
          </h4>

          <div className="mt-3 flex flex-wrap gap-2">
            <PriorityBadge priority={task.priority} />
            <HealthBadge healthStatus={task.healthStatus} />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="h-8 w-8 rounded-full border border-[#E5D9C7] bg-[#F8F3EA] flex items-center justify-center hover:bg-[#EFE7D8] transition"
            title="Edit task"
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="h-8 w-8 rounded-full border border-[#F1C9C2] bg-[#FFF1EF] text-[#9B2C1F] flex items-center justify-center hover:bg-[#F8D8D3] transition"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-[#6F675D] leading-6 mt-3">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#6F675D]">
        <CalendarDays size={14} />
        <span>{formatDate(task.dueDate)}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          onClick={() => onFocus(task._id)}
          className="w-full rounded-full border border-[#D8C9B3] bg-white py-2.5 text-sm font-extrabold text-[#1F1D1A] hover:bg-[#F1E7D8] transition flex items-center justify-center gap-2"
        >
          <TimerReset size={15} />
          Focus on task
        </button>

        {nextStage ? (
          <button
            onClick={() => onMove(task._id, nextStage)}
            className="w-full rounded-full border border-[#D8C9B3] bg-[#F8F3EA] py-2.5 text-sm font-extrabold text-[#1F1D1A] hover:bg-[#295142] hover:text-white transition flex items-center justify-center gap-2"
          >
            Move to {nextStage}
            <ArrowRight size={15} />
          </button>
        ) : (
          <div className="w-full rounded-full bg-[#DDEBDF] py-2.5 text-sm font-extrabold text-[#295142] flex items-center justify-center gap-2">
            <CheckCircle2 size={15} />
            Completed
          </div>
        )}
      </div>
    </div>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "bg-[#F2D9D3] text-[#8B2E20]",
    Medium: "bg-[#F4E3C6] text-[#8A5B24]",
    Low: "bg-[#DDEBDF] text-[#295142]"
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
};

const HealthBadge = ({ healthStatus }) => {
  const styles = {
    Healthy: "bg-[#DDEBDF] text-[#295142]",
    "Needs Attention": "bg-[#F4E3C6] text-[#8A5B24]",
    "High Risk": "bg-[#F2D9D3] text-[#8B2E20]",
    Overdue: "bg-[#1F1D1A] text-white"
  };

  const showWarning =
    healthStatus === "High Risk" ||
    healthStatus === "Needs Attention" ||
    healthStatus === "Overdue";

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-extrabold flex items-center gap-1 ${
        styles[healthStatus] || styles.Healthy
      }`}
    >
      {showWarning && <AlertTriangle size={12} />}
      {healthStatus || "Healthy"}
    </span>
  );
};

export default TaskCard;