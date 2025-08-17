import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Settings, Trash2, List, CheckSquare, Square, AlertCircle, PanelLeft, Calendar, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onCreateTask: () => void;
  onSetFilter: (filterId: string) => void;
  onClearCompleted: () => void;
  onToggleSidebar: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onCreateTask,
  onSetFilter,
  onClearCompleted,
  onToggleSidebar,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandsContainerRef = useRef<HTMLDivElement>(null);
  const commandRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const commands: Command[] = [
    {
      id: 'new-task',
      label: 'Create New Task',
      icon: Plus,
      action: () => {
        onCreateTask();
        handleClose();
      },
      shortcut: 'T'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: () => {
        onOpenSettings();
        handleClose();
      }
    },
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      icon: PanelLeft,
      action: () => {
        onToggleSidebar();
        handleClose();
      }
    },
    {
      id: 'filter-all',
      label: 'Show All Tasks',
      icon: List,
      action: () => {
        onSetFilter('1');
        handleClose();
      }
    },
    {
      id: 'filter-active',
      label: 'Show Active Tasks',
      icon: Square,
      action: () => {
        onSetFilter('2');
        handleClose();
      }
    },
    {
      id: 'filter-completed',
      label: 'Show Completed Tasks',
      icon: CheckSquare,
      action: () => {
        onSetFilter('3');
        handleClose();
      }
    },
    {
      id: 'filter-high-priority',
      label: 'Show High Priority Tasks',
      icon: AlertCircle,
      action: () => {
        onSetFilter('4');
        handleClose();
      }
    },
    {
      id: 'filter-due-today',
      label: 'Show Due Today Tasks',
      icon: Calendar,
      action: () => {
        onSetFilter('5');
        handleClose();
      }
    },
    {
      id: 'filter-overdue',
      label: 'Show Overdue Tasks',
      icon: Clock,
      action: () => {
        onSetFilter('6');
        handleClose();
      }
    },
    {
      id: 'clear-completed',
      label: 'Clear Completed',
      icon: Trash2,
      action: () => {
        onClearCompleted();
        handleClose();
      }
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = commandRefs.current[selectedIndex];
    if (selectedElement && commandsContainerRef.current) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-start justify-center pt-20 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        className={`bg-white dark:bg-[#2c2c2e] w-full max-w-lg mx-4 flex flex-col border border-gray-200/60 dark:border-[#3a3a3c] shadow-lg rounded-sm transition-all duration-300 ease-out transform ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200/60 dark:border-[#3a3a3c]">
          <Search className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xs bg-transparent outline-none placeholder-gray-400 dark:placeholder-[#6d6d70] text-gray-900 dark:text-white"
            style={{ caretColor: theme === 'dark' ? '#ffffff' : '#374151' }}
          />
          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-[#1c1c1e] text-gray-500 dark:text-[#a1a1a6] border border-gray-200 dark:border-[#3a3a3c] rounded">
            ⌘K
          </kbd>
        </div>

        {/* Commands List */}
        <div ref={commandsContainerRef} className="overflow-y-auto scrollbar-minimal max-h-48">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-[#6d6d70]">
              <Search className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-[#6d6d70]" />
              <p className="text-xs">No commands found</p>
            </div>
          ) : (
            <div className="py-1">
              {filteredCommands.map((command, index) => {
                const IconComponent = command.icon;
                return (
                  <button
                    key={command.id}
                    ref={(el) => (commandRefs.current[index] = el)}
                    onClick={command.action}
                    className={`w-full flex items-center px-4 py-2.5 text-left transition-colors duration-150 ${
                      index === selectedIndex
                        ? 'bg-gray-100/80 dark:bg-[#3a3a3c] text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-[#a1a1a6] hover:bg-gray-50/60 dark:hover:bg-[#3a3a3c]/50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mr-3 flex-shrink-0 ${
                      index === selectedIndex ? 'text-gray-600 dark:text-white' : 'text-gray-400 dark:text-[#a1a1a6]'
                    }`} />
                    <span className="flex-1 text-xs font-normal">
                      {command.label}
                    </span>
                    {command.shortcut && (
                      <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-[#1c1c1e] text-gray-500 dark:text-[#a1a1a6] border border-gray-200 dark:border-[#3a3a3c] rounded ml-3">
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-200/60 dark:border-[#3a3a3c] bg-gray-50/30 dark:bg-[#1c1c1e]/30">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#6d6d70]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] rounded text-gray-600 dark:text-[#a1a1a6]">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] rounded text-gray-600 dark:text-[#a1a1a6]">↵</kbd>
                select
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] rounded text-gray-600 dark:text-[#a1a1a6]">esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};