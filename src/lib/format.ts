// サーバーのタイムゾーン（本番は UTC）に依存しないよう、表示は常に日本時間に固定する
const TIME_ZONE = "Asia/Tokyo";

export function formatDateTime(date: Date) {
	return date.toLocaleString("ja-JP", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: TIME_ZONE,
	});
}

export function formatDate(date: Date) {
	return date.toLocaleDateString("ja-JP", { timeZone: TIME_ZONE });
}
