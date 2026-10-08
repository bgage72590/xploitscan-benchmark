// Shared date helpers used by the invoice and billing pages.
import { differenceInCalendarDays, format, isBefore, startOfDay } from "date-fns";

export function formatInvoiceDate(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}

export function daysUntilDue(dueDate: string): number {
  return differenceInCalendarDays(new Date(dueDate), new Date());
}

export function isOverdue(dueDate: string): boolean {
  return isBefore(startOfDay(new Date(dueDate)), startOfDay(new Date()));
}
