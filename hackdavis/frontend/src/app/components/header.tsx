'use client'
import { withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'
import React from "react";
import "../globals.css"
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';
const Header = withAuthInfo((props: WithAuthInfoProps) => {
    const logoutFunction = useLogoutFunction()
    const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions()

    const saveToLocalStorage = (key: string, value: String | undefined) => {
        try {
          const serializedValue = JSON.stringify(value);
          localStorage.setItem(key, serializedValue);
        } catch (error) {
          console.error('Error saving to localStorage', error);
        }
    };
      
    const submitToDB = (userName: String | undefined) => {
        fetch("http://localhost:8080/api/create-user", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "userName": userName }),
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error updating allergies:', error);
        });
    }

    if (props.user?.userId !== null) {
        saveToLocalStorage("username", props.user?.userId);
        submitToDB(props.user?.userId);
    }

    const removeFromLocalStorage = (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage', error);
        }
    }; 

    if(!props.isLoggedIn) {
        removeFromLocalStorage("username");
    }
    
    const router = useRouter();
    const doSomething = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            console.log(props.user.userId);
        }
    }
    const handleSignInSignOut = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            logoutFunction(true);
        }
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
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={doSomething}>Scan an Item {underLine}</button> 
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={doSomething}>Search Database {underLine}</button>
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={updateProfile}>Update Profile {underLine}</button>
                <button onClick={handleSignInSignOut} className="cursor-pointer hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500">{!props.isLoggedIn ? "Sign-In" : "Logout"}{underLine}</button>
            </div>
        </nav>
    );
})

export default Header;