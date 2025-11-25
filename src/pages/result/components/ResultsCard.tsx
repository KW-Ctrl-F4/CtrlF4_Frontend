import SummaryCard from "./SummaryCard";
import RiskCard from "./RiskCard";
import RevisionCard from "./RevisionCard";
import QACard from "./QACard";
import type { AnchorItem, RiskItem, RevisionItem } from "../utils";

interface ResultsCardProps {
	hasSummary: boolean;
	hasRisk: boolean;
	hasRevision: boolean;
	hasQA: boolean;
	summaryText?: string;
	summaryAnchors?: AnchorItem[];
	riskItems?: RiskItem[];
	revisions?: RevisionItem[];
	qaQuestion?: string;
	qaAnswer?: string;
	qaFocus?: string[];
	qaAnchors?: AnchorItem[];
}

export default function ResultsCard({
	hasSummary,
	hasRisk,
	hasRevision,
	hasQA,
	summaryText,
	summaryAnchors = [],
	riskItems = [],
	revisions = [],
	qaQuestion,
	qaAnswer,
	qaFocus = [],
	qaAnchors = [],
}: ResultsCardProps) {
	return (
		<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
			{hasSummary && (
				<section id="section-summary">
					<SummaryCard embedded title="Summary" summary={summaryText} anchors={summaryAnchors} />
				</section>
			)}
			{hasRisk && (
				<section id="section-risk" className={hasSummary ? "border-t border-gray-100" : ""}>
					<RiskCard embedded title="Risk" items={riskItems} />
				</section>
			)}
			{hasRevision && (
				<section id="section-revision" className={(hasSummary || hasRisk) ? "border-t border-gray-100" : ""}>
					<RevisionCard embedded title="Revision" revisions={revisions} />
				</section>
			)}
			{hasQA && (
				<section id="section-qa" className={(hasSummary || hasRisk || hasRevision) ? "border-t border-gray-100" : ""}>
					<QACard embedded title="Q&A" question={qaQuestion} answer={qaAnswer} focus={qaFocus} anchors={qaAnchors} />
				</section>
			)}
		</div>
	);
}


