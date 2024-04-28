'use client'

import React, { useRef, useState } from "react";

export default function Search() {
    const [query, setQuery] = useState("");
    const [input, setInput] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.select();
        }
    };

    const handleChange = (value: string) => {
        setInput(value);
    };

    const handleSubmit = (e: any) => {
        if(e.key === 'Enter') {
            setQuery(input);
        }
    };

    return (
        <div className="bg-gray-200 rounded-full w-fit p-1">
            <input 
                ref={inputRef} 
                className="bg-gray-200 outline-none ml-1" 
                type="text" 
                placeholder="Class Name"
                value={input} 
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleSubmit}
            />
            <button 
                type="button" 
                className="w-4 mr-1" 
                onClick={handleButtonClick}>
                    <img src="/search.png" />
            </button>
        </div>
    );
}  