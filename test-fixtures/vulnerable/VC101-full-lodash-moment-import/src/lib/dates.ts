// Shared date helpers used by the invoice and billing pages.
import * as moment from "moment";

export function formatInvoiceDate(iso: string): string {
  return moment(iso).format("MMM D, YYYY");
}

export function daysUntilDue(dueDate: string): number {
  return moment(dueDate).startOf("day").diff(moment().startOf("day"), "days");
}

export function isOverdue(dueDate: string): boolean {
  return moment(dueDate).isBefore(moment(), "day");
}
