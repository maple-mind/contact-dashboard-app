import Link from "next/link";
import { InquiryStatus } from "@/generated/prisma/enums";
import { INQUIRY_STATUS_LABELS } from "@/lib/labels";
import { getStatusSummary } from "@/data/inquiry";
import { cn } from "@/lib/utils";

export async function StatusSummary({
	activeStatus,
}: {
	activeStatus: InquiryStatus | undefined;
}) {
	const summary = await getStatusSummary();

	return (
		<ul className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
			{Object.values(InquiryStatus).map((status) => {
				const isActive = status === activeStatus;

				return (
					<li key={status}>
						<Link
							href={isActive ? "/" : `/?status=${status}`}
							aria-current={isActive ? "true" : undefined}
							className={cn(
								"focus-visible:ring-ring/50 block rounded-lg border p-4 focus-visible:ring-3 focus-visible:outline-none",
								isActive ? "border-primary bg-muted" : "hover:bg-muted",
							)}
						>
							<p className="text-muted-foreground text-sm">
								{INQUIRY_STATUS_LABELS[status]}
							</p>
							<p className="mt-1 text-2xl font-semibold">
								{summary[status]}
								<span className="text-muted-foreground ml-1 text-sm font-normal">
									件
								</span>
							</p>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
