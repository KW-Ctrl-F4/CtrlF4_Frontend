export type AnchorItem = { id?: string | number; title?: string };

export type RiskItem = {
	riskType?: string;
	severity?: string;
	reason?: string;
	original_excerpt?: string;
	anchor?: AnchorItem | null;
};

export type RevisionItem = {
	anchor?: AnchorItem | null;
	original_excerpt?: string;
	issues?: { risk?: string } | null;
	suggestions?: { safe_alternative?: string } | null;
};

export function extractResultSections(raw: any) {
	// Summary
	const summaryText: string | undefined =
		raw?.results?.summarizer?.full_document?.summary ||
		raw?.results?.summarizer?.results?.full_document?.summary;
	const summaryAnchorsDirect: AnchorItem[] | undefined =
		raw?.results?.summarizer?.full_document?.anchors ||
		raw?.results?.summarizer?.results?.full_document?.anchors;
	const byClauseArr: any[] = Array.isArray(raw?.results?.summarizer?.results?.by_clause)
		? raw.results.summarizer.results.by_clause
		: [];
	const byClauseAnchors: AnchorItem[] = byClauseArr.reduce((acc: any[], c: any) => {
		if (Array.isArray(c?.anchors)) acc.push(...c.anchors);
		return acc;
	}, []);
	const summaryAnchors: AnchorItem[] =
		Array.isArray(summaryAnchorsDirect) && summaryAnchorsDirect.length > 0
			? summaryAnchorsDirect
			: byClauseAnchors;

	// Risk
	const riskItemsRaw: any[] = Array.isArray(raw?.results?.risk?.items)
		? raw.results.risk.items
		: [];
	const riskItems: RiskItem[] = riskItemsRaw.map((r: any) => ({
		riskType: r?.riskType ?? r?.type ?? r?.name,
		severity: r?.severity,
		reason: r?.reason ?? r?.summary,
		original_excerpt: r?.original_excerpt ?? r?.original ?? r?.excerpt,
		anchor: r?.anchor ?? (Array.isArray(r?.anchors) ? r.anchors[0] : undefined),
	}));

	// Revision
	const revisionsRaw: any[] = Array.isArray(raw?.results?.revision?.revisions)
		? raw.results.revision.revisions
		: [];
	const revisions: RevisionItem[] = revisionsRaw.map((rev: any) => ({
		anchor: rev?.anchor ?? (Array.isArray(rev?.anchors) ? rev.anchors[0] : undefined),
		original_excerpt: rev?.original_excerpt ?? rev?.original ?? rev?.excerpt,
		issues: { risk: rev?.issues?.risk ?? rev?.issues?.summary },
		suggestions: { safe_alternative: rev?.suggestions?.safe_alternative ?? rev?.suggestions?.proposal },
	}));

	// QA
	const qaQuestion: string | undefined = raw?.results?.qa?.question;
	const qaAnswer: string | undefined = raw?.results?.qa?.answer;
	const qaFocus: string[] = Array.isArray(raw?.results?.qa?.focus) ? raw.results.qa.focus : [];
	// QA anchors는 문자열 배열일 수도 있고 객체 배열일 수도 있음
	const qaAnchorsRaw: any = raw?.results?.qa?.anchors;
	const qaAnchors: AnchorItem[] = Array.isArray(qaAnchorsRaw)
		? qaAnchorsRaw.map((a: any, idx: number) => {
				// 문자열인 경우
				if (typeof a === "string") {
					return { title: a, id: idx };
				}
				// 이미 객체인 경우
				return {
					id: a?.id ?? idx,
					title: a?.title ?? a,
				};
		  })
		: [];

	// Flags
	const hasSummary = Boolean(summaryText);
	const hasRisk = Array.isArray(riskItems) && riskItems.length > 0;
	const hasRevision = Array.isArray(revisions) && revisions.length > 0;
	const hasQA = Boolean(qaAnswer || qaQuestion);

	const sections: { key: "summary" | "risk" | "revision" | "qa"; label: string }[] = [];
	if (hasSummary) sections.push({ key: "summary", label: "Summary" });
	if (hasRisk) sections.push({ key: "risk", label: "위험 요소 분석" });
	if (hasRevision) sections.push({ key: "revision", label: "개선 제안사항" });
	if (hasQA) sections.push({ key: "qa", label: "Q&A" });

	return {
		summaryText,
		summaryAnchors,
		riskItems,
		revisions,
		qaQuestion,
		qaAnswer,
		qaFocus,
		qaAnchors,
		hasSummary,
		hasRisk,
		hasRevision,
		hasQA,
		sections,
	};
}


