'use client'
import { AuthProvider } from "@propelauth/react";
import SignIn from "./_components/Signin";

export default function SignInPage() {
    return <AuthProvider authUrl="https://6961223141.propelauthtest.com"><SignIn></SignIn></AuthProvider>
}

