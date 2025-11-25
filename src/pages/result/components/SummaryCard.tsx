import { useMemo, useState } from "react";
import AnchorTooltip from "./AnchorTooltip";

type AnchorItem = { id?: string | number; title?: string };

interface SummaryCardProps {
	title?: string;
	summary?: string;
	anchors?: AnchorItem[];
	embedded?: boolean;
}

function splitIntoSentences(text?: string): string[] {
	if (!text) return [];
	// 간단한 문장 분리: 마침표/물음표/느낌표 기준으로 분리 후 트림
	const parts = text
		.split(/(?<=[.!?])\s+/g)
		.map((s) => s.trim())
		.filter(Boolean);
	return parts.length ? parts : [text];
}

export default function SummaryCard({ title = "Summary", summary, anchors, embedded = false }: SummaryCardProps) {
	const sentences = useMemo(() => splitIntoSentences(summary), [summary]);
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);

	const Content = (
		<div className="relative p-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
			<div className="space-y-3">
				{sentences.map((sentence, idx) => (
					<div
						key={idx}
						className="relative"
						onMouseEnter={() => setHoverIndex(idx)}
						onMouseLeave={() => setHoverIndex((cur) => (cur === idx ? null : cur))}
					>
						<p className="text-gray-800 leading-relaxed">
							{sentence}
						</p>
						<AnchorTooltip
							anchors={anchors}
							position="top-right"
							visible={Boolean(anchors?.length) && hoverIndex === idx}
						/>
					</div>
				))}
			</div>
		</div>
	);

	if (embedded) return Content;
	return <div className="relative bg-white rounded-2xl shadow-xl">{Content}</div>;
}


