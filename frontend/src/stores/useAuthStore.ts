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
            set({accessToken: data.accessToken, user: data.user});
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
    }
}))