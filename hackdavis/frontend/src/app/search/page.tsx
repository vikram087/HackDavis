'use client'

import React, { useRef, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/header";
import { AuthProvider } from "@propelauth/react";

export default function Search() {
    const [quer, setQuery] = useState("");
    const [input, setInput] = useState("");
    const [results, setResults] = useState([{}]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.select();
        }
    };

    const handleChange = (value: string) => {
        setInput(value);
    };

    const handleSubmit = async (e: any) => {
        if(e.key === 'Enter') {
            setQuery(input);
            setResults(await searchItemsByName(input.toLowerCase()));
            setInput("");
            setSearchPerformed(true);
        }
    };

    async function searchItemsByName(itemName: string) {
        const itemsRef = collection(db, "items");
        const q = query(itemsRef, where("name", ">=", itemName), where("name", "<=", itemName + '\uf8ff'));
    
        try {
            const querySnapshot = await getDocs(q);
            const items: any = [];
            querySnapshot.forEach((doc) => {
                items.push({...doc.data(), id: doc.id});
            });
            return items;
        } catch (error) {
            console.error("Error fetching documents: ", error);
            return [];
        }
    }
    

    const searchResults = results.map((result: any, index: number) => (
        <div key={index} className="border border-black rounded-lg p-2 m-10">
            <div>Name: {result.name}</div>
            <div>Ingredients: {result.ingredients ? result.ingredients.join(', ') : 'No ingredients listed'}</div>
        </div>
    ));
    
    return (
        <AuthProvider authUrl="https://6961223141.propelauthtest.com">
            <Header />
            <div className="flex flex-col items-center"> 
                <p className="py-10 text-3xl">Search Database</p>
                <div className="mt-4 bg-gray-200 rounded-3xl flex items-center p-2 justify-center my-5"> {/* Added justify-center to center the search bar */}
                    <input 
                        ref={inputRef} 
                        className="bg-gray-200 outline-none ml-1 text-lg p-2 w-96"
                        type="text" 
                        placeholder="Search Food Items"
                        value={input} 
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleSubmit}
                    />
                    <button 
                        type="button" 
                        className="w-10 h-10 flex justify-center items-center ml-2"
                        onClick={handleButtonClick}>
                        <img src="/search.png" alt="Search" className="w-6 h-6"/> {/* Increased image size within button */}
                    </button>
                </div>
                {searchPerformed && searchResults.length > 0 ? <div className="mt-4 text-center w-full">{searchResults}</div> : null}
            </div>
        </AuthProvider>
    );
}  