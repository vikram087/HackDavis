'use client'
import { withAuthInfo, useRedirectFunctions, useLogoutFunction, WithAuthInfoProps } from '@propelauth/react'
import React from "react";
import "../globals.css"
import { useRouter } from 'next/navigation';
import { db } from '../firebaseConfig';
import { collection, setDoc, doc, getDoc } from "firebase/firestore";

const Header = withAuthInfo((props: WithAuthInfoProps) => {
    const logoutFunction = useLogoutFunction()
    const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions()

    const saveToLocalStorage = (key: string, value: String | undefined) => {
        try {
          const serializedValue = JSON.stringify(value);
          localStorage.setItem(key, serializedValue);
          console.log(`storing user: ${serializedValue}`);
        } catch (error) {
          console.error('Error saving to localStorage', error);
        }
    };

    const createUser = async (username: string) => {
        if (!username) {
            console.error("Username is undefined or empty");
            return;
        }

        if(await checkDocumentExists("people", username)) {
            console.log(`user exists: ${username}`);
            return;
        }
    
        const peopleRef = collection(db, "people");
        const data = {
            allergens: [],
            pastScans: []
        };
    
        try {
            await setDoc(doc(peopleRef, username), data);
            console.log(`creating user: ${username}`);
        } catch (error) {
            console.error("Failed to create user:", error);
        }
    };

    async function checkDocumentExists(collectionName: string, documentId: string): Promise<boolean> {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
    
        return docSnap.exists();
    }
    
    if (props.user?.userId) {
        saveToLocalStorage("username", props.user.userId);
        createUser(props.user.userId).catch(err => console.error("Error creating user:", err));
    }
    
    const removeFromLocalStorage = (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage', error);
        }
    }; 

    if(!props.isLoggedIn) {
        console.log(`removing user from local storage: ${localStorage.getItem("username")}`);
        removeFromLocalStorage("username");
    }
    
    const router = useRouter();

    const handleSignInSignOut = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            logoutFunction(true);
        }
    }

    const goToPastScans = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            router.push("/pastScans");
        }
    };

    const goToScan = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            router.push("/scan");
        }
    };

    const goToSearch = () => {
        if (!props.isLoggedIn) {
            redirectToLoginPage();
        } else {
            router.push("/search");
        }
    };

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
            <button onClick={goHome} className="text-yellow-500 text-5xl hover:text-gray-300">AllerSense</button>
            <div className="flex items-center space-x-24 justify-end"> {/* Adjusted justify-end here */}
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={goToPastScans}>Past Scans {underLine}</button> 
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={goToScan}>Scan an Item {underLine}</button> 
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={goToSearch}>Search Database {underLine}</button>
                <button className="hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500" onClick={updateProfile}>Update Profile {underLine}</button>
                <button onClick={handleSignInSignOut} className="cursor-pointer hover:text-yellow-500 font-mono hover:opacity-100 ease-in-out relative group duration-500">{!props.isLoggedIn ? "Sign-In" : "Logout"}{underLine}</button>
            </div>
        </nav>
    );
})

export default Header;
