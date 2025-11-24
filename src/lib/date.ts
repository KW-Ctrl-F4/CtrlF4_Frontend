export function formatKstDate(input: string | Date): string {
  let date: Date | null = null;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    let s = input.trim();
    // 일부 백엔드가 "+00:00Z" 같이 중복 표기를 줄 수 있어 마지막 'Z' 제거
    if (s.includes("+") && s.endsWith("Z")) {
      s = s.slice(0, -1);
    }
    const parsed = new Date(s);
    if (!Number.isFinite(parsed.getTime())) {
      // 초 단위까지만 잘라서 UTC로 가정
      const m = s.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      date = m ? new Date(`${m[0]}Z`) : null;
    } else {
      date = parsed;
    }
  }

  if (!date || !Number.isFinite(date.getTime())) {
    // 파싱 실패 시 원본을 그대로 반환 (UI가 최소한 값은 표시)
    return String(input);
  }

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const byType: Record<string, string> = {};
  for (const p of parts) {
    byType[p.type] = p.value;
  }

  const y = byType.year;
  const m = byType.month;
  const d = byType.day;
  if (!y || !m || !d) {
    return String(input);
  }
  return `${y}-${m}-${d}`;
}


