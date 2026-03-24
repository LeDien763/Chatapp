export interface User {
    _id: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}