import { useState } from "react";
import { ANALYSIS_DATA } from "../../mocks";
import Header from "../_shared/layout/Header";
import Title from "./components/Title";
import Summary from "./components/Summary";
import Risk from "./components/Risk";
import Suggestion from "./components/Suggestion";
import Footer from "./components/Footer";

export default function Result() {
  const [activeTab, setActiveTab] = useState<
    "summary" | "risks" | "suggestions"
  >("summary");

  const analysisData = ANALYSIS_DATA;

  const downloadReport = () => {
    alert("분석 리포트를 다운로드합니다.");
  };

  const shareReport = () => {
    alert("분석 리포트를 공유합니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Title
          title={analysisData.title}
          uploadDate={analysisData.uploadDate}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onDownload={downloadReport}
          onShare={shareReport}
        />

        {activeTab === "summary" && <Summary clauses={analysisData.clauses} />}
        {activeTab === "risks" && (
          <Risk riskFactors={analysisData.riskFactors} />
        )}
        {activeTab === "suggestions" && (
          <Suggestion suggestions={analysisData.suggestions} />
        )}

        <Footer />
      </main>
    </div>
  );
}
