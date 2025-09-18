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
