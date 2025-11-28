import axios from "axios";

const baseURL = import.meta.env.VITE_ANALYZE_BASE as string || '/api';

// 디버깅: 환경변수 값 확인
if (typeof window !== "undefined") {
	console.log("VITE_BASE_URL:", import.meta.env.VITE_ANALYZE_BASE);
	console.log("VITE_ANALYZE_BASE:", baseURL);
  }

// ==============================
// 기본 http 인스턴스 (JWT 자동 포함)
// ==============================
export const http = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔥 모든 요청에 Authorization 자동 추가 (타입 오류 없음)
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // Axios v1 방식: set() 사용
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
});

// 응답 인터셉터
http.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(err)
);

// ==============================
// 긴 타임아웃용 http2 인스턴스
// ==============================
export const http2 = axios.create({
    baseURL,
    timeout: 30000, // 30초
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔥 http2에서도 동일하게 JWT 자동 적용
http2.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
});
