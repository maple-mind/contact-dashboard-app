import { InquiryStatus } from "@/generated/prisma/enums";

const STATUS_VALUES = Object.values(InquiryStatus);

export const SORTABLE_FIELDS = [
	"createdAt",
	"title",
	"status",
	"priority",
] as const;
export type SortField = (typeof SORTABLE_FIELDS)[number];
export type SortOrder = "asc" | "desc";

type ParamValue = string | string[] | undefined;

export function parseStatus(value: ParamValue): InquiryStatus | undefined {
	if (typeof value !== "string") return undefined;
	return STATUS_VALUES.find((s) => s === value);
}

export function parsePage(value: ParamValue) {
	if (typeof value !== "string") return 1;
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < 1) return 1;
	return parsed;
}

export function parseSort(value: ParamValue): SortField {
	if (typeof value !== "string") return "createdAt";
	return SORTABLE_FIELDS.find((f) => f === value) ?? "createdAt";
}

export function parseOrder(value: ParamValue): SortOrder {
	return value === "asc" ? "asc" : "desc";
}
