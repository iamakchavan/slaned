import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DatePicker } from "./DatePicker";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: Date;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (taskId: string, updatedTask: Partial<Task>) => void;
}

export const EditTaskModal = ({ isOpen, onClose, task, onSave }: EditTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    dueDate: undefined as Date | undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPriorityChanging, setIsPriorityChanging] = useState(false);
  const [displayedPriority, setDisplayedPriority] = useState<"high" | "medium" | "low">("medium");
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.dueDate
      });
      setDisplayedPriority(task.priority);
    }
  }, [task]);

  // Sync displayedPriority with priority on initial load
  useEffect(() => {
    if (!isTextTransitioning) {
      setDisplayedPriority(formData.priority);
    }
  }, [formData.priority, isTextTransitioning]);

  // Handle modal visibility animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !formData.title.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onSave(task.id, {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate
    });
    
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (formData.title.trim()) {
        handleSubmit(e as any);
      }
    }
  };



  if (!isOpen || !task) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Modal */}
      <div 
        className={`bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white w-full max-w-md sm:max-w-2xl mx-auto flex flex-col border border-gray-200 dark:border-[#3a3a3c] transition-all duration-300 ease-out transform shadow-2xl ${
          isVisible
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-4'
        }`}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#3a3a3c]">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Edit Task
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-0.5">
              Update task details
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-400 dark:text-[#a1a1a6] hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] h-9 w-9 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
          {/* Task Name - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-xs font-medium text-gray-900 dark:text-white">
              Task Name
            </Label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task name..."
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all bg-gray-50 dark:bg-[#1c1c1e] focus:bg-white dark:focus:bg-[#2c2c2e] placeholder-gray-400 dark:placeholder-[#6d6d70]"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-xs font-medium text-gray-900 dark:text-white">
              Description (Optional)
            </Label>
            <Textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all bg-gray-50 dark:bg-[#1c1c1e] focus:bg-white dark:focus:bg-[#2c2c2e] placeholder-gray-400 dark:placeholder-[#6d6d70] resize-none"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-900 dark:text-white">
              Priority
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-500 dark:text-[#a1a1a6] hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3c] px-2 py-1.5 h-auto transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] justify-start"
              onClick={() => {
                setIsPriorityChanging(true);
                setIsTextTransitioning(true);

                const priorities: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];
                const currentIndex = priorities.indexOf(formData.priority);
                const nextIndex = (currentIndex + 1) % priorities.length;
                const nextPriority = priorities[nextIndex];

                // Smooth text transition with blur effect
                setTimeout(() => {
                  // First: blur out current text
                  setIsTextTransitioning(true);
                }, 50);

                setTimeout(() => {
                  // Then: change the text while blurred
                  setFormData(prev => ({ ...prev, priority: nextPriority }));
                  setDisplayedPriority(nextPriority);
                }, 100);

                setTimeout(() => {
                  // Finally: blur back in with new text
                  setIsTextTransitioning(false);
                  setIsPriorityChanging(false);
                }, 200);
              }}
            >
              <div className={`flex space-x-0.5 transition-transform duration-100 ${isPriorityChanging ? 'scale-95' : 'scale-100'
                }`}>
                <div className={`w-1 h-2.5 rounded-full transition-all duration-300 ease-out transform ${formData.priority === 'low'
                  ? 'bg-green-400 scale-110 shadow-sm'
                  : 'bg-gray-200 scale-100'
                  } ${isPriorityChanging ? 'animate-pulse' : ''}`} />
                <div className={`w-1 h-2.5 rounded-full transition-all duration-300 ease-out transform ${['medium', 'high'].includes(formData.priority)
                  ? 'bg-yellow-400 scale-110 shadow-sm'
                  : 'bg-gray-200 scale-100'
                  } ${isPriorityChanging ? 'animate-pulse' : ''}`} />
                <div className={`w-1 h-2.5 rounded-full transition-all duration-300 ease-out transform ${formData.priority === 'high'
                  ? 'bg-red-400 scale-110 shadow-sm'
                  : 'bg-gray-200 scale-100'
                  } ${isPriorityChanging ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-xs transition-all duration-200 ease-out transform ${['low', 'medium', 'high'].includes(formData.priority) ? 'font-medium text-gray-700 dark:text-white' : 'font-normal text-gray-500 dark:text-[#a1a1a6]'
                } ${isTextTransitioning
                  ? 'blur-sm scale-95 opacity-70'
                  : 'blur-0 scale-100 opacity-100'
                }`}>
                {displayedPriority.charAt(0).toUpperCase() + displayedPriority.slice(1)}
              </span>
            </Button>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-900 dark:text-white">
              Due Date (Optional)
            </Label>
            <DatePicker
              value={formData.dueDate}
              onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
              placeholder="Set due date"
              className="w-full"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-[#3a3a3c] bg-gray-50 dark:bg-[#1c1c1e]">
          <div className="text-xs text-gray-400 dark:text-[#6d6d70] hidden sm:block">
            esc to close • {/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) ? '⌘↵' : 'C+↵'} to save
          </div>
          <div className="flex items-center space-x-2 sm:ml-0 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 dark:text-[#a1a1a6] hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] px-4 py-2 text-xs transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              onClick={handleSubmit}
              disabled={!formData.title.trim() || isSubmitting}
              className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 text-xs disabled:bg-gray-200 dark:disabled:bg-[#3a3a3c] disabled:text-gray-400 dark:disabled:text-[#6d6d70] shadow-sm transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 