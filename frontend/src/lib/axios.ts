import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
})

// Add authorization header interceptor
api.interceptors.request.use((config) => {
    const {accessToken} = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if(originalRequest.url === "/auth/signin" || 
        originalRequest.url === "/auth/signup" || 
        originalRequest.url === "/auth/refresh") {
        return Promise.reject(error);
    }
    originalRequest._retryCount = originalRequest._retryCount || 0;
    if (error.response?.status === 401 && originalRequest._retryCount < 4) {
        originalRequest._retryCount += 1;
        try {
            const res = await api.post("/auth/refresh", {}, {withCredentials: true});
            const newAccessToken = res.data.accessToken;
            useAuthStore.getState().setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        }
        catch (err) {
            useAuthStore.getState().clearState();
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
});
export default api;