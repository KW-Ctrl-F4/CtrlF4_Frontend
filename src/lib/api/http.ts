import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE as string;

export const http = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

http.interceptors.request.use((config) => {
	return config;
});

http.interceptors.response.use(
	(res) => res,
	(err) => Promise.reject(err)
);

export const http2 = axios.create({
	baseURL,
	timeout: 30000, // 🔥 핵심: 30초
	headers: {
	  "Content-Type": "application/json",
	},
  });
  