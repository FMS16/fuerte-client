"use client";

import Login from "@/components/Auth/Login";
import { useRouter } from 'next/navigation'
import React from "react";
import { useEffect, useContext } from "react";
import { UserContext } from "@/features/UserContext";

export default function AdminPage() {

    const { state } = useContext(UserContext);
    const { isAuthenticated, isAdmin } = state;

    const router = useRouter();

    useEffect(() => {

        if (isAdmin == false || isAuthenticated == false || state.user === null) {
            router.push("/");
        }

    }, [ isAuthenticated, isAdmin ])

    return (
        <div className="container">
            {state.user ? (
                <>
                    
                </>
            ) : (
                <p>Redirigiendo...</p>
            )}
        </div>
    );
    
}