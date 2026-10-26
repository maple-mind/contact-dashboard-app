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

export function parseQuery(value: ParamValue) {
	return typeof value === "string" ? value.trim() : "";
}

export type ListParams = {
	status?: InquiryStatus;
	q?: string;
	page?: number;
	sort?: SortField;
	order?: SortOrder;
};

export function parseListParams(params: { [key: string]: ParamValue }) {
	return {
		status: parseStatus(params.status),
		q: parseQuery(params.q),
		page: parsePage(params.page),
		sort: parseSort(params.sort),
		order: parseOrder(params.order),
	};
}

// 一覧の状態を URL のクエリ文字列（先頭の "?" 付き）に戻す。デフォルト値は省略する
export function buildListQuery({ status, q, page, sort, order }: ListParams) {
	const params = new URLSearchParams();

	if (status) params.set("status", status);
	if (q) params.set("q", q);
	if (sort && sort !== "createdAt") params.set("sort", sort);
	if (order && order !== "desc") params.set("order", order);
	if (page && page > 1) params.set("page", String(page));

	const query = params.toString();
	return query ? `?${query}` : "";
}
