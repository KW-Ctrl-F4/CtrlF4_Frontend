import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import Header from "../_shared/layout/Header";
import Title from "./components/Title";
import Summary from "./components/Summary";
import Risk from "./components/Risk";
import Suggestion from "./components/Suggestion";
import Footer from "./components/Footer";
import type { RunResultsResponse } from "../../lib/api/types";

export default function Result() {
  const [activeTab, setActiveTab] = useState<
    "summary" | "risks" | "suggestions"
  >("summary");
  const location = useLocation();
  const analysisData = useMemo<RunResultsResponse>(() => {
    const incoming = (location.state as any)?.results as RunResultsResponse | undefined;
    if (incoming && incoming.clauses && incoming.riskFactors && incoming.suggestions) {
      return incoming;
    }
    return {
      title: "분석 결과",
      uploadDate: new Date().toISOString(),
      fileCount: 1,
      clauses: [],
      riskFactors: [],
      suggestions: [],
    };
  }, [location.state]);

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
        {activeTab === "risks" && <Risk riskFactors={analysisData.riskFactors} />}
        {activeTab === "suggestions" && <Suggestion suggestions={analysisData.suggestions} />}

        <Footer />
      </main>
    </div>
  );
}
