import type { InquiryStatus, Priority, Role } from "@/generated/prisma/client";
import type { SortField, SortOrder } from "@/lib/inquiry-params";

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
	OPEN: "未対応",
	IN_PROGRESS: "対応中",
	PENDING: "保留",
	CLOSED: "完了",
};

export const INQUIRY_STATUS_VARIANTS: Record<
	InquiryStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	OPEN: "destructive",
	IN_PROGRESS: "default",
	PENDING: "secondary",
	CLOSED: "outline",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
	LOW: "低",
	MEDIUM: "中",
	HIGH: "高",
};

export const ROLE_LABELS: Record<Role, string> = {
	MEMBER: "担当者",
	ADMIN: "管理者",
};

export const SORT_FIELD_LABELS: Record<SortField, string> = {
	createdAt: "受信日時",
	title: "件名",
	status: "ステータス",
	priority: "優先度",
};

export const SORT_ORDER_LABELS: Record<SortField, Record<SortOrder, string>> = {
	createdAt: { desc: "新しい順", asc: "古い順" },
	title: { asc: "昇順", desc: "降順" },
	status: { asc: "未対応が先", desc: "完了が先" },
	priority: { desc: "高い順", asc: "低い順" },
};
