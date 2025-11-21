import { useMemo, useState } from "react";

interface IntentSelectorProps {
	initialSuggestions: string[];
	onSubmit: (intents: string[]) => Promise<void> | void;
}

export default function IntentSelector({ initialSuggestions, onSubmit }: IntentSelectorProps) {
	const [customIntent, setCustomIntent] = useState("");
	const [selected, setSelected] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const suggestions = useMemo(() => Array.from(new Set(initialSuggestions)), [initialSuggestions]);

	const toggle = (intent: string) => {
		setSelected((prev) =>
			prev.includes(intent) ? prev.filter((i) => i !== intent) : [...prev, intent]
		);
	};

	const addCustom = () => {
		const val = customIntent.trim();
		if (!val) return;
		if (!selected.includes(val)) setSelected((prev) => [...prev, val]);
		setCustomIntent("");
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await onSubmit(selected);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8">
			<h3 className="text-xl font-semibold text-gray-900 mb-4">의도 선택</h3>
			<p className="text-gray-600 mb-6">추천 의도를 선택하거나 직접 입력할 수 있습니다.</p>

			<div className="flex flex-wrap gap-2 mb-6">
				{suggestions.map((intent) => (
					<button
						key={intent}
						onClick={() => toggle(intent)}
						className={`px-3 py-1 rounded-full border text-sm cursor-pointer whitespace-nowrap ${
							selected.includes(intent)
								? "bg-primary-600 text-white border-primary-600"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
						}`}
					>
						{intent}
					</button>
				))}
			</div>

			<div className="flex gap-2 mb-6">
				<input
					value={customIntent}
					onChange={(e) => setCustomIntent(e.target.value)}
					placeholder="사용자 정의 의도 입력"
					className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				/>
				<button onClick={addCustom} className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer whitespace-nowrap">
					추가
				</button>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-gray-600">선택됨: {selected.join(", ") || "없음"}</div>
				<button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 cursor-pointer whitespace-nowrap"
				>
					{isSubmitting ? "전송 중..." : "의도 적용"}
				</button>
			</div>
		</div>
	);
}


