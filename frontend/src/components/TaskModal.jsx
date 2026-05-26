import { useEffect, useState } from "react";
import { X } from "lucide-react";

const TaskModal = ({ isOpen, onClose, onSubmit, editingTask, submitting }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stage: "Todo",
    priority: "Medium",
    dueDate: ""
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        stage: editingTask.stage || "Todo",
        priority: editingTask.priority || "Medium",
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split("T")[0]
          : ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        stage: "Todo",
        priority: "Medium",
        dueDate: ""
      });
    }
  }, [editingTask, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      stage: formData.stage,
      priority: formData.priority,
      dueDate: formData.dueDate ? formData.dueDate : null
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-[2rem] bg-[#FFFDF8] border border-[#D8C9B3] soft-shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DCCB]">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1F1D1A]">
              {editingTask ? "Update task" : "Create new task"}
            </h2>
            <p className="text-sm text-[#6F675D] mt-1">
              Keep it simple and clear for your workflow.
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-[#F8F3EA] border border-[#D8C9B3] flex items-center justify-center hover:bg-[#EFE7D8] transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-[#1F1D1A]">
              Task title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Finish dashboard design"
              className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#1F1D1A]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a short note about this task"
              rows="4"
              className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition resize-none"
            ></textarea>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold text-[#1F1D1A]">Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-[#1F1D1A]">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-[#1F1D1A]">
                Due date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-[#D8C9B3] bg-white py-3.5 font-extrabold text-[#1F1D1A] hover:bg-[#F1E7D8] transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#1F1D1A] py-3.5 font-extrabold text-white hover:bg-[#295142] disabled:opacity-60 transition"
            >
              {submitting
                ? "Saving..."
                : editingTask
                ? "Save changes"
                : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;