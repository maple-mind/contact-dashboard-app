"use client";

import { ErrorView } from "@/components/error-view";

// 一覧・詳細ページのエラーを受け止める。レイアウトの <main> の中に表示されるため、ヘッダーは残る
export default function DashboardError({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	return <ErrorView error={error} retry={retry} showBackLink />;
}
