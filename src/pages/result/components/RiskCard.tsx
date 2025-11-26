import { useState } from "react";

type Severity = "low" | "medium" | "high" | string;

type RiskItem = {
	riskType?: string;
	severity?: Severity;
	reason?: string;
	original_excerpt?: string;
	anchor?: { id?: string | number; title?: string } | null;
};

interface RiskCardProps {
	title?: string;
	items?: RiskItem[];
	embedded?: boolean;
}

function severityBadgeClasses(severity?: Severity) {
	const s = String(severity || "").toLowerCase();
	if (s === "high") return "bg-red-100 text-red-800";
	if (s === "medium") return "bg-yellow-100 text-yellow-800";
	if (s === "low") return "bg-green-100 text-green-800";
	return "bg-gray-100 text-gray-800";
}

export default function RiskCard({ title = "Risk", items = [], embedded = false }: RiskCardProps) {
	const [openIdx, setOpenIdx] = useState<number | null>(null);
	const Content = (
		<div className="relative p-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
			<div className="space-y-4">
				{items.map((it, idx) => {
					return (
						<div
							key={idx}
							className="relative border border-gray-200 rounded-lg p-5"
						>
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2">
										<h3 className="text-lg font-semibold text-gray-900">
											{it.riskType || "Risk"}
										</h3>
										<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityBadgeClasses(it.severity)}`}>
											{String(it.severity || "unknown")}
										</span>
									</div>
									{it.reason && (
										<p className="mt-2 text-gray-700 whitespace-pre-wrap">
											{it.reason}
										</p>
									)}
									{it.anchor?.title && (
										<p className="mt-1 text-sm text-gray-500">
											참조: {it.anchor.title}
										</p>
									)}
								</div>
								{it.original_excerpt && (
									<button
										type="button"
										onClick={() => setOpenIdx((cur) => (cur === idx ? null : idx))}
										className="ml-4 text-sm text-primary-600 hover:text-primary-700 underline cursor-pointer"
									>
										{openIdx === idx ? "원문 접기" : "원문 펼치기"}
									</button>
								)}
							</div>
							{openIdx === idx && it.original_excerpt && (
								<div className="mt-3 bg-gray-50 text-gray-800 rounded-md p-3 text-sm whitespace-pre-wrap">
									{it.original_excerpt}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);

	if (embedded) return Content;
	return <div className="relative bg-white rounded-2xl shadow-xl">{Content}</div>;
}


