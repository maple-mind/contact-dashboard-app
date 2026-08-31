import type { InquiryStatus, Priority, Role } from "@/generated/prisma/client";

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
