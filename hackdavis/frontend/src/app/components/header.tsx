'use client'

import React from "react";
import "../globals.css"

export default function Header() {

    const doSomething = () => {
        console.log("Clicked");
    }

    return (
        <nav className="pl-8 whitespace-nowrap flex items-center space-x-24 bg-blue-950 text-white h-24">
            <button onClick={doSomething} className="text-yellow-500 text-5xl hover:text-gray-300">UC Davis</button>
            <div className="pr-72"></div>
            <button className="hover:text-yellow-500" onClick={doSomething}>Course Planner</button> 
            <button className="hover:text-yellow-500" onClick={doSomething}>Degree Map</button>
            <button className="hover:text-yellow-500" onClick={doSomething}>Resources</button>
            <div className="slanted-box flex items-center justify-center">
                <div className="pl-6"></div>
                <button onClick={doSomething} className="cursor-pointer hover:text-yellow-500">Sign-In</button>
            </div>
        </nav>
    );
}