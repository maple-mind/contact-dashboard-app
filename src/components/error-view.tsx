"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ErrorView({
	error,
	retry,
	showBackLink,
}: {
	error: Error & { digest?: string };
	retry: () => void;
	showBackLink: boolean;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="rounded-lg border border-dashed p-12 text-center">
			<p className="mb-2 font-medium">ページの表示中に問題が発生しました</p>
			<p className="text-muted-foreground mb-4 text-sm">
				しばらく待ってから再度お試しください
			</p>

			<div className="flex items-center justify-center gap-4">
				{/* reset() と違い、データを取り直してから描画し直す */}
				<Button variant="outline" onClick={() => retry()}>
					再試行
				</Button>
				{showBackLink && (
					<Link href="/" className="text-sm underline">
						一覧に戻る
					</Link>
				)}
			</div>

			{/* 本番ではエラーの詳細が画面に出ないため、サーバーログと照合する ID を表示する */}
			{error.digest && (
				<p className="text-muted-foreground mt-6 text-xs">
					エラーID: {error.digest}
				</p>
			)}
		</div>
	);
}
