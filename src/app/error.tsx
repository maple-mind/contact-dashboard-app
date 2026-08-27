"use client";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main className="p-8">
			<div className="rounded border border-dashed p-12 text-center">
				<p className="mb-2 font-medium">問い合わせの読み込みに失敗しました</p>
				<p className="mb-4 text-sm opacity-70">
					しばらく待ってから再度お試しください
				</p>
				<button
					type="button"
					onClick={reset}
					className="rounded border px-4 py-2 text-sm"
				>
					再試行
				</button>
			</div>
		</main>
	);
}
