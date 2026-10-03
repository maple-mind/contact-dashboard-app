import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
	return (
		<div className="animate-pulse">
			<Skeleton className="mb-4 h-4 w-32" />
			<div className="space-y-2">
				{Array.from({ length: 10 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		</div>
	);
}

export function SummarySkeleton() {
	return (
		<div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<Skeleton key={i} className="h-[88px] rounded-lg" />
			))}
		</div>
	);
}
