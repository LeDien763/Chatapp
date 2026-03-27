import {create} from "zustand";
import {toast} from "sonner";
import { authService } from "../services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set,get)=>({
    accessToken: null,
    user: null,
    loading: false,
    clearState:() => set({accessToken: null, user: null, loading: false}),
    signUp: async (userName, password, repassword, email, firstName, lastName) => {
        try {
            set({loading: true});
            await authService.signUp(userName, password, repassword, email, firstName, lastName);
            toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.");
        }
        catch (error) {
            console.error( error);
            toast.error("Đăng ký thất bại.");
        }
        finally {
            set({loading: false});
        }
    },
    signIn: async (userName, password) => {
        try {
            set({loading: true});
            const data = await authService.signIn(userName, password);
            get().setAccessToken(data.accessToken);
            toast.success("Đăng nhập thành công!");
            console.log("User info:", data);
        }
        catch (error) {
            console.error( error);
            toast.error("Đăng nhập thất bại.");
        }
        finally {            
            set({loading: false});
            await get().fetchMe();
        }
    },
    signOut: async () => {
        try {
            set({loading: true});
            get().clearState();
            await authService.signOut();
            set({accessToken: null, user: null});
            get().setAccessToken("");
            toast.success("Đăng xuất thành công!");
        }
        catch (error) {
            console.error( error);
            toast.error("Đăng xuất thất bại.");
        }
        finally {
            set({loading: false});
        }
    },
    fetchMe: async () => {
        try {
            set({loading: true});
            const user = await authService.fetchMe();
            set({user});
        }
        catch (error) {
            console.error( error);
            toast.error("Không thể lấy thông tin người dùng.");
        }
        finally {
            set({loading: false});

        }
    },
    refresh: async () => {
        try {
            set({loading: true});
            const {user, fetchMe, setAccessToken} = get();
            const accessToken = await authService.refresh();
            setAccessToken(accessToken);
            if (!user) {
                await fetchMe();
            }
        }
        catch (error) {
            console.error( error);
            toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
            get().clearState();
        }
        finally {
            set({loading: false});
        }
    },
    setAccessToken: (accessToken) => set({accessToken}) 
}))