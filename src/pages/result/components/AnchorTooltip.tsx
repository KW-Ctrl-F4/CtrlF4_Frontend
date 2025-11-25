import { useMemo } from "react";

type AnchorItem = {
	id?: string | number;
	title?: string;
};

interface AnchorTooltipProps {
	anchors?: AnchorItem[];
	className?: string;
	position?: "top-right" | "right";
	visible?: boolean;
}

export default function AnchorTooltip({
	anchors,
	className = "",
	position = "top-right",
	visible = false,
}: AnchorTooltipProps) {
	const list = useMemo(() => {
		return (Array.isArray(anchors) ? anchors : [])
			.filter((a) => a && (a.title || a.id !== undefined))
			.slice(0, 10); // 안전 가드
	}, [anchors]);

	if (!visible || list.length === 0) return null;

	const pos =
		position === "right"
			? "left-full top-1/2 -translate-y-1/2 ml-2"
			: "right-0 -top-2 -translate-y-full";

	return (
		<div
			className={`absolute ${pos} z-20 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-3 animate-fade-in ${className}`}
		>
			<p className="text-xs font-semibold text-gray-700 mb-2">
				참조 앵커
			</p>
			<ul className="space-y-1 max-h-56 overflow-auto pr-1">
				{list.map((a, idx) => (
					<li key={String(a.id ?? idx)} className="text-xs text-gray-600">
						<span className="font-medium text-gray-800">{a.title || "제목 없음"}</span>
						{a.id !== undefined && (
							<span className="text-[10px] text-gray-400 ml-1">#{a.id}</span>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

// Tailwind: fade-in (optional)
// tailwind.config.ts 에서 keyframes/animation이 없다면 기본 transition-opacity로 대체됨
// 여기서는 존재하지 않아도 동작에 문제없도록 클래스만 남김

