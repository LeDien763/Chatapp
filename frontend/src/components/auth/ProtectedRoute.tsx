import React, { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';
import { useState } from 'react';
const ProtectedRoute = () => {
    const {accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [started, setStarted] = useState(true);
    const init = async () => {
        if (!accessToken) {
            await refresh();
        }
        if (accessToken && !user) {
            await fetchMe();
        }
    }
    useEffect(() => {
        let isMounted = true;
        const runInit = async () => {
            await init();
            if (isMounted) {
                setStarted(false);
            }
        };
        runInit();
        return () => {
            isMounted = false;
        };
    }, []);
    if (loading || started) {
        return <div className='flex h-screen items-center justify-center'>Đang tải trang...</div>;
    }
    if (!accessToken) {
        return (
            <Navigate 
            to="/signin" 
            replace />
        );
    }
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute