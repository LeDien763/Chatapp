import type { User } from './user';

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    signUp: (
        userName: string, 
        password: string, 
        repassword: string, 
        email: string, 
        firstName: string, 
        lastName: string
    ) => Promise<void>;
}