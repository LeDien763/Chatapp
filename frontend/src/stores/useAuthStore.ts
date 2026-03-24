import {create} from "zustand";
import {toast} from "sonner";
import { authService } from "../services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set,get)=>({
    accessToken: null,
    user: null,
    loading: false,

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
    }

}))