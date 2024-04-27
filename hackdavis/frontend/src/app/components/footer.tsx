'use client'

import React from "react";
import "../globals.css"

export default function Footer() {

    return (
        <footer className="bg-blue-950 text-white">
            <div className="flex justify-center items-start p-6 space-x-10 pt-20">
                <div className="flex flex-col items-start border-r border-yellow-500 pr-6">
                    <p className="text-yellow-500 text-2xl font-bold mb-6">CourseTool</p>
                    <p>CourseTool aims to simplify the<br></br>degree planning process.</p>
                </div>
                <div className="flex flex-col items-start">
                    <p className="font-bold text-yellow-500 mb-7">SUPPORT</p>
                    <a href="" className="hover:text-yellow-500 cursor-pointer mb-2">FAQ</a>
                    <a href="mailto:codelabdavis@gmail.com" className="hover:text-yellow-500 cursor-pointer mb-10">Contact Us</a>
                </div>
                <div className="flex flex-col items-start">
                    <p className="font-bold text-yellow-500 mb-7">ABOUT US</p>
                    <a href="https://www.instagram.com/codelabdavis/" target="_blank" rel="noreferrer" className="hover:text-yellow-500 cursor-pointer mb-2">Instagram</a>
                    <a href="https://codelabdavis.medium.com/" target="_blank" rel="noreferrer" className="hover:text-yellow-500 cursor-pointer mb-2">Medium</a>
                    <a href="https://github.com/Codelab-Davis" target="_blank" rel="noreferrer" className="hover:text-yellow-500 cursor-pointer mb-10">Github</a>
                </div>
            </div>
            <div className="text-center text-xs pb-10">
                © Codelab 2024 • Created with 💛 by the Fall 2023 Cohort
            </div>
        </footer>
    );
}