import Link from "next/link";

export function EmptyState({ hasFilter }: { hasFilter: boolean }) {
	return (
		<div className="rounded border border-dashed p-12 text-center">
			{hasFilter ? (
				<>
					<p className="mb-2 font-medium">
						条件に一致する問い合わせはありません
					</p>
					<p className="text-muted-foreground mb-4 text-sm">
						検索条件を変更するか、条件をクリアしてください
					</p>
					<Link href="/" className="text-sm underline">
						条件をクリア
					</Link>
				</>
			) : (
				<>
					<p className="mb-2 font-medium">まだ問い合わせがありません</p>
					<p className="text-muted-foreground text-sm">
						新しい問い合わせが届くとここに表示されます
					</p>
				</>
			)}
		</div>
	);
}
