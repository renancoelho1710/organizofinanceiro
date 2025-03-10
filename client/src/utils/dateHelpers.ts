import { format, formatDistance, isToday, isYesterday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format a date to a standard format (DD/MM/YYYY)
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
}

/**
 * Format a date relative to today (Today, Yesterday, or date)
 * 
 * @param date - Date to format
 * @returns Formatted relative date string
 */
export function formatRelativeDate(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isToday(dateObj)) {
      return 'Hoje';
    }
    
    if (isYesterday(dateObj)) {
      return 'Ontem';
    }
    
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
}

/**
 * Format the remaining days until a due date
 * 
 * @param dueDate - Due date
 * @returns Formatted days remaining string
 */
export function formatDaysRemaining(dueDate: Date | string): string {
  try {
    const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const today = new Date();
    
    // Reset hours to compare just the dates
    today.setHours(0, 0, 0, 0);
    const dueDateObj = new Date(dateObj);
    dueDateObj.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = dueDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Atrasado há ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'dia' : 'dias'}`;
    } else if (diffDays === 0) {
      return 'Vence hoje';
    } else if (diffDays === 1) {
      return 'Vence amanhã';
    } else {
      return `Vence em ${diffDays} dias`;
    }
  } catch (error) {
    return 'Data inválida';
  }
}

/**
 * Format a date to month name
 * 
 * @param date - Date to format
 * @returns Month name
 */
export function formatMonth(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMMM', { locale: ptBR });
  } catch (error) {
    return 'Mês inválido';
  }
}

/**
 * Format a date to month and year
 * 
 * @param date - Date to format
 * @returns Month and year formatted string
 */
export function formatMonthYear(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMMM yyyy', { locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
}
