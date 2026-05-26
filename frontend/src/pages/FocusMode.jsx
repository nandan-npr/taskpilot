import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Pause,
  Play,
  RotateCcw,
  TimerReset
} from "lucide-react";
import { toast } from "react-toastify";

import API from "../api/axios";
import Navbar from "../components/Navbar";

const FOCUS_TIME = 25 * 60;

const FocusMode = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/tasks/${taskId}`);

      setTask(response.data.task);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load task");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft((previousValue) => {
        if (previousValue <= 1) {
          setIsRunning(false);
          toast.success("Focus session completed");
          return 0;
        }

        return previousValue - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, secondsLeft]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [secondsLeft]);

  const progress = useMemo(() => {
    return Math.round(((FOCUS_TIME - secondsLeft) / FOCUS_TIME) * 100);
  }, [secondsLeft]);

  const getNextStage = (stage) => {
    if (stage === "Todo") {
      return "In Progress";
    }

    if (stage === "In Progress") {
      return "Done";
    }

    return null;
  };

  const nextStage = task ? getNextStage(task.stage) : null;

  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(FOCUS_TIME);
  };

  const handleMoveStage = async () => {
    if (!nextStage) {
      return;
    }

    try {
      const response = await API.patch(`/tasks/${task._id}/stage`, {
        stage: nextStage
      });

      setTask(response.data.task);
      toast.success(`Task moved to ${nextStage}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move task");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] text-[#1F1D1A]">
        <Navbar />

        <div className="min-h-[70vh] flex items-center justify-center px-5">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full border-4 border-[#D8C9B3] border-t-[#295142] animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-[#6F675D]">Opening focus mode...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#1F1D1A]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#D8C9B3] bg-white px-5 py-3 text-sm font-extrabold text-[#1F1D1A] hover:bg-[#F1E7D8] transition"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>
        </div>

        <section className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-6 sm:p-8 soft-shadow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 border-b border-[#E8DCCB] pb-6">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#295142]">
                  Focus Mode
                </p>

                <h1 className="font-display text-4xl sm:text-5xl mt-3 leading-tight">
                  {task.title}
                </h1>

                <p className="text-[#6F675D] leading-7 mt-4 max-w-2xl">
                  {task.description ||
                    "No description added. Use this focus session to work on the task clearly."}
                </p>
              </div>

              <HealthBadge healthStatus={task.healthStatus} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <InfoCard
                icon={<Clock3 size={20} />}
                label="Current stage"
                value={task.stage}
              />

              <InfoCard
                icon={<AlertTriangle size={20} />}
                label="Priority"
                value={task.priority}
              />

              <InfoCard
                icon={<CalendarDays size={20} />}
                label="Due date"
                value={formatDate(task.dueDate)}
              />
            </div>

            <div className="mt-8 rounded-[2rem] border border-[#E5D9C7] bg-[#F8F3EA] p-6 sm:p-8 text-center">
              <div className="mx-auto h-56 w-56 rounded-full border-[14px] border-[#E5D9C7] flex items-center justify-center bg-white card-shadow">
                <div>
                  <TimerReset
                    size={34}
                    className="mx-auto mb-3 text-[#295142]"
                  />
                  <p className="text-6xl font-extrabold tracking-tight">
                    {formattedTime}
                  </p>
                  <p className="text-sm font-bold text-[#6F675D] mt-2">
                    {progress}% session completed
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F1D1A] px-7 py-4 text-white font-extrabold hover:bg-[#295142] transition"
                >
                  {isRunning ? <Pause size={18} /> : <Play size={18} />}
                  {isRunning ? "Pause focus" : "Start focus"}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8C9B3] bg-white px-7 py-4 font-extrabold text-[#1F1D1A] hover:bg-[#EFE7D8] transition"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-6 card-shadow">
              <h2 className="text-2xl font-extrabold">Task progress</h2>
              <p className="text-sm text-[#6F675D] leading-6 mt-2">
                Move the task when the current stage is complete.
              </p>

              <div className="mt-6 space-y-3">
                <StageItem title="Todo" active={task.stage === "Todo"} />
                <StageItem
                  title="In Progress"
                  active={task.stage === "In Progress"}
                />
                <StageItem title="Done" active={task.stage === "Done"} />
              </div>

              {nextStage ? (
                <button
                  onClick={handleMoveStage}
                  className="mt-6 w-full rounded-full bg-[#1F1D1A] py-3.5 font-extrabold text-white hover:bg-[#295142] transition flex items-center justify-center gap-2"
                >
                  Move to {nextStage}
                  <ArrowRight size={17} />
                </button>
              ) : (
                <div className="mt-6 w-full rounded-full bg-[#DDEBDF] py-3.5 font-extrabold text-[#295142] flex items-center justify-center gap-2">
                  <CheckCircle2 size={17} />
                  Task completed
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-6 card-shadow">
              <h2 className="text-2xl font-extrabold">Focus note</h2>
              <p className="text-sm text-[#6F675D] leading-7 mt-3">
                This screen is designed to reduce noise. It keeps only the task,
                timer, priority, deadline, and stage controls visible.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-3xl border border-[#E5D9C7] bg-white p-5 card-shadow">
      <div className="h-11 w-11 rounded-full bg-[#F1E7D8] text-[#295142] flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#6F675D]">
        {label}
      </p>
      <h3 className="font-extrabold mt-2">{value}</h3>
    </div>
  );
};

const StageItem = ({ title, active }) => {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${
        active
          ? "border-[#295142] bg-[#DDEBDF] text-[#295142]"
          : "border-[#E5D9C7] bg-[#F8F3EA] text-[#6F675D]"
      }`}
    >
      <div
        className={`h-3 w-3 rounded-full ${
          active ? "bg-[#295142]" : "bg-[#D8C9B3]"
        }`}
      ></div>
      <p className="font-extrabold">{title}</p>
    </div>
  );
};

const HealthBadge = ({ healthStatus }) => {
  const styles = {
    Healthy: "bg-[#DDEBDF] text-[#295142]",
    "Needs Attention": "bg-[#F4E3C6] text-[#8A5B24]",
    "High Risk": "bg-[#F2D9D3] text-[#8B2E20]",
    Overdue: "bg-[#1F1D1A] text-white"
  };

  return (
    <div
      className={`rounded-full px-4 py-2 text-sm font-extrabold ${
        styles[healthStatus] || styles.Healthy
      }`}
    >
      {healthStatus || "Healthy"}
    </div>
  );
};

export default FocusMode;