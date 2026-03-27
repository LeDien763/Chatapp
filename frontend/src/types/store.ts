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
    signIn: (userName: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    clearState: () => void;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    setAccessToken: (accessToken: string) => void;
}