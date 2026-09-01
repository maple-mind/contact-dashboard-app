import type { InquiryStatus } from "@/generated/prisma/enums";

const ALLOWED_TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
	OPEN: ["IN_PROGRESS", "PENDING", "CLOSED"],
	IN_PROGRESS: ["PENDING", "CLOSED"],
	PENDING: ["IN_PROGRESS", "CLOSED"],
	CLOSED: ["IN_PROGRESS", "PENDING"],
};

export function canTransition(from: InquiryStatus, to: InquiryStatus) {
	return ALLOWED_TRANSITIONS[from].includes(to);
}

export function getAllowedTransitions(from: InquiryStatus) {
	return ALLOWED_TRANSITIONS[from];
}
