'use client'
import { withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'
import React from "react";
import "../globals.css"
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';
const Header = withAuthInfo((props: WithAuthInfoProps) => {
    const logoutFunction = useLogoutFunction()
    const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions()

    const router = useRouter();
    const doSomething = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            console.log(props.user.userId)
        }
    }
    const handleSignInSignOut = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            logoutFunction(true);
        }
    }
    
    const goToPastScans = () => {
        router.push('/pastscans');
        // if (!props.isLoggedIn) {
        //     redirectToLoginPage();
        // } else {
        //     router.push('/pastscans');
        // }
    }

    const updateProfile = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            router.push('/update');
        }
    }
    const goHome = () => {
        router.push('/');
    }

    const underLine = <div className="pt-0.5 absolute w-full h-0.5 bg-white/80 scale-x-0 group-hover:scale-x-100 transition-transform origin-left "/>
    return (
        <nav className="pl-8 pr-8 whitespace-nowrap flex items-center justify-between bg-sky-950 text-white h-24">
            <button onClick={goHome} className="text-yellow-500 text-5xl hover:text-gray-300">ProjectName</button>
            <div className="flex items-center space-x-24 justify-end"> {/* Adjusted justify-end here */}
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={goToPastScans}>View Past Scans {underLine}</button> 
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={doSomething}>Scan an Item {underLine}</button> 
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={doSomething}>Search Database {underLine}</button>
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={updateProfile}>Update Profile {underLine}</button>
                <button onClick={handleSignInSignOut} className="cursor-pointer hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500">{!props.isLoggedIn ? "Sign-In" : "Logout"}{underLine}</button>
            </div>
        </nav>
    );
})

export default Header;