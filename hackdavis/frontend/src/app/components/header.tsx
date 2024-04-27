'use client'

import React from "react";
import "../globals.css"

export default function Header() {

    const doSomething = () => {
        console.log("Clicked");
    }

    return (
        <nav className="pl-8 pr-8 whitespace-nowrap flex items-center justify-between bg-sky-950 text-white h-24">
            <button onClick={doSomething} className="text-yellow-500 text-5xl hover:text-gray-300">ProjectName</button>
            <div className="flex items-center space-x-24 justify-end"> {/* Adjusted justify-end here */}
                <button className="hover:text-yellow-500 font-mono" onClick={doSomething}>Scan an Item</button> 
                <button className="hover:text-yellow-500 font-mono" onClick={doSomething}>Search Database</button>
                <button className="hover:text-yellow-500 font-mono" onClick={doSomething}>Update Profile</button>
                <button onClick={doSomething} className="cursor-pointer hover:text-yellow-500 font-mono">Sign-In</button>
            </div>
        </nav>
    );
}