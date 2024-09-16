"use client";
import React, {useState, useEffect, useContext} from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/features/UserContext";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        router.push("/")

    }, [])
    return (
        <></>
    )
}