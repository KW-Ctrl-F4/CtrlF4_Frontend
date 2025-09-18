export const PERSONA_QUESTIONS = [
  "당신의 역할이나 직책은 무엇인가요? (예: 변호사, 사업가, 개인)",
  "이 계약서와 관련하여 가장 우려되는 부분은 무엇인가요?",
  "계약서 분석에서 특별히 집중해서 봐야 할 조항이 있나요?",
  "이전에 유사한 계약을 검토해본 경험이 있으신가요?",
  "이 계약서의 주요 목적이나 배경을 간단히 설명해주세요.",
];

export const HISTORY_ITEMS = [
  {
    id: "1",
    title: "근로계약서_2024",
    uploadDate: "2024-01-15 14:30",
    description:
      "근로계약서 검토 및 주요 조항 분석. 급여, 근무시간, 휴가 규정 등 핵심 내용 정리",
    fileCount: 1,
    status: "completed" as const,
  },
  {
    id: "2",
    title: "부동산 매매계약서",
    uploadDate: "2024-01-12 10:15",
    description:
      "아파트 매매계약서 리스크 분석. 특약사항 및 대금지급 조건 검토",
    fileCount: 2,
    status: "completed" as const,
  },
  {
    id: "3",
    title: "프리랜서 업무계약서",
    uploadDate: "2024-01-10 16:45",
    description:
      "디자인 업무 계약서 분석 중. 저작권 및 수정 범위 조항 검토 진행",
    fileCount: 1,
    status: "processing" as const,
  },
  {
    id: "4",
    title: "임대차계약서",
    uploadDate: "2024-01-08 09:20",
    description:
      "상가 임대차계약서 주요 조항 분석. 임대료 인상, 보증금 반환 조건 등",
    fileCount: 3,
    status: "completed" as const,
  },
  {
    id: "5",
    title: "투자계약서",
    uploadDate: "2024-01-05 13:40",
    description:
      "스타트업 투자계약서 검토 실패. 파일 형식 오류로 재업로드 필요",
    fileCount: 1,
    status: "failed" as const,
  },
];

export const ANALYSIS_DATA = {
  title: "근로계약서 분석 결과",
  uploadDate: "2024-01-15 14:30",
  fileCount: 1,

  clauses: [
    {
      title: "계약 당사자 및 목적",
      description:
        "계약 당사자를 명시하고 근로관계의 목적과 범위를 정의합니다.",
    },
    {
      title: "업무 범위",
      description: "제공해야 할 서비스나 업무의 구체적인 내용을 명시합니다.",
    },
    {
      title: "급여 조건",
      description: "급여 지급 일정과 금액을 구체적으로 명시합니다.",
    },
    {
      title: "기밀유지",
      description: "기밀정보에 대한 의무사항을 상세히 규정합니다.",
    },
    {
      title: "계약 해지",
      description: "계약 해지 조건과 절차를 명확히 정의합니다.",
    },
    {
      title: "준거법",
      description: "계약을 규율하는 관할 법률을 명시합니다.",
    },
  ],

  riskFactors: [
    {
      id: "1",
      title: "불명확한 급여 조건",
      description:
        "급여 지급일과 구체적인 금액이 명확하지 않아 분쟁 가능성이 있습니다. 급여 조건을 보다 구체적으로 명시할 필요가 있습니다.",
      severity: "high" as const,
    },
    {
      id: "2",
      title: "광범위한 기밀유지 조항",
      description:
        "기밀정보의 범위가 너무 광범위하여 시행하기 어려울 수 있습니다. 기밀정보의 범위를 좁히고 기밀유지 의무 기간을 명시해야 합니다.",
      severity: "medium" as const,
    },
    {
      id: "3",
      title: "계약해지 통지기간 누락",
      description:
        "계약 해지 시 명확한 통지기간이 누락되어 오해와 법적 분쟁 가능성이 있습니다. 명확한 통지기간을 포함해야 합니다.",
      severity: "medium" as const,
    },
  ],

  suggestions: [
    {
      id: "1",
      title: "급여 조건 개정",
      description:
        "예시: 계약 체결 시 $5,000 지급, 1단계 완료 시 $10,000, 최종 완료 시 $15,000 지급",
      example:
        "급여 조건을 각 지급 단계별로 구체적인 날짜와 금액을 포함하여 수정하시기 바랍니다.",
    },
    {
      id: "2",
      title: "기밀유지 조항 개선",
      description:
        "예시: 기밀정보는 독점 소프트웨어, 고객 목록, 재무 데이터로 한정하며, 의무는 계약 종료 후 5년간 지속",
      example:
        "기밀정보의 범위를 핵심 사업 기밀로만 한정하고, 기밀유지 의무 기간을 합리적으로 설정하시기 바랍니다.",
    },
    {
      id: "3",
      title: "계약해지 통지기간 추가",
      description:
        "예시: 계약 당사자는 30일 전 서면 통지로 계약을 해지할 수 있습니다",
      example:
        "계약 해지 시 30일의 서면 통지기간을 명시하는 조항을 추가하시기 바랍니다.",
    },
  ],
};
