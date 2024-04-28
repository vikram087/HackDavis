'use client'
import Image from "next/image";
import HomePage from "./components/homepage";
import { AuthProvider } from "@propelauth/react";

export default function Home() {
  return (
    <AuthProvider authUrl="https://6961223141.propelauthtest.com">
    <HomePage />
    </AuthProvider>
  );
}
