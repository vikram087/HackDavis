'use client'

import React from "react";
import "../globals.css"

export default function Footer() {

    return (
        <footer className="bg-sky-950 text-white">
            <div className="flex justify-center items-start p-6 space-x-10 pt-20">
                <div className="flex flex-col items-start">
                    <p className="font-bold text-yellow-500 mb-7">SUPPORT</p>
                    <a href="" className="hover:text-yellow-500 cursor-pointer mb-2">FAQ</a>
                    <a href="mailto:hackdavisproject@gmail.com" className="hover:text-yellow-500 cursor-pointer mb-10">Contact Us</a>
                </div>
                <div className="flex flex-col items-start">
                    <p className="font-bold text-yellow-500 mb-7">ABOUT US</p>
                    <a href="" target="_blank" rel="noreferrer" className="hover:text-yellow-500 cursor-pointer mb-2">Instagram</a>
                    <a href="" target="_blank" rel="noreferrer" className="hover:text-yellow-500 cursor-pointer mb-10">Github</a>
                </div>
            </div>
            <div className="text-center text-xs pb-10">
               
            </div>
        </footer>
    );
}