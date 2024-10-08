"use client";

import Login from "@/components/Auth/Login";
import { useRouter } from 'next/navigation'
import React from "react";
import { useEffect, useContext } from "react";
import { UserContext } from "@/features/UserContext";

export default function LoginPage() {

    const { state } = useContext(UserContext);
    const { isAuthenticated, isAdmin } = state;

    const router = useRouter();

    useEffect(() => {

        if(isAuthenticated){
            if(isAdmin){
                router.push('/admin');
            }else{
                router.push('/');
            }
        }

    }, [isAuthenticated])

    return (
        <Login />
    )
}