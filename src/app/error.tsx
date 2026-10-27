"use client";

import { ErrorView } from "@/components/error-view";

// ログイン画面やレイアウト自体で起きたエラーを受け止める。
export default function RootError({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	return (
		<main className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8">
			<ErrorView error={error} retry={retry} showBackLink={false} />
		</main>
	);
}
