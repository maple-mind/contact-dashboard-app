export function TableSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="mb-4 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
			<div className="space-y-2">
				{Array.from({ length: 10 }).map((_, i) => (
					<div key={i} className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
				))}
			</div>
		</div>
	);
}
