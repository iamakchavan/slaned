export type DueDateStatus = 'normal' | 'due-today' | 'overdue';

export interface DueDateDisplay {
  text: string;
  status: DueDateStatus;
  className: string;
}

/**
 * Formats a due date for display
 */
export function formatDueDate(dueDate: Date): DueDateDisplay {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  
  const diffTime = dueDateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Overdue
    const daysPast = Math.abs(diffDays);
    return {
      text: daysPast === 1 ? 'Yesterday' : `${daysPast} days ago`,
      status: 'overdue',
      className: 'text-red-600 dark:text-red-400'
    };
  } else if (diffDays === 0) {
    // Due today
    return {
      text: 'Today',
      status: 'due-today',
      className: 'text-orange-600 dark:text-orange-400'
    };
  } else if (diffDays === 1) {
    // Due tomorrow
    return {
      text: 'Tomorrow',
      status: 'normal',
      className: 'text-gray-600 dark:text-[#a1a1a6]'
    };
  } else if (diffDays <= 7) {
    // Due this week
    const dayName = dueDate.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      text: dayName,
      status: 'normal',
      className: 'text-gray-600 dark:text-[#a1a1a6]'
    };
  } else {
    // Due later
    const monthDay = dueDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    return {
      text: monthDay,
      status: 'normal',
      className: 'text-gray-600 dark:text-[#a1a1a6]'
    };
  }
}

/**
 * Gets the due date status for a task
 */
export function getDueDateStatus(dueDate: Date): DueDateStatus {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  
  const diffTime = dueDateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'overdue';
  } else if (diffDays === 0) {
    return 'due-today';
  } else {
    return 'normal';
  }
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  return checkDate.getTime() === today.getTime();
}

/**
 * Checks if a date is overdue (before today)
 */
export function isOverdue(date: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  return checkDate.getTime() < today.getTime();
}

/**
 * Gets the minimum date for date pickers (today)
 */
export function getMinDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Formats a date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parses a date from input field format (YYYY-MM-DD)
 */
export function parseDateFromInput(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}