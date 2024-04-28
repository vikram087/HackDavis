'use client'

import React, { useRef, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

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
            setResults(await searchItemsByName(input));
            setInput("");
            setSearchPerformed(true);
        }
    };

    async function searchItemsByName(itemName: any) {
        const itemsRef = collection(db, "items"); // Reference to the 'items' collection
        const q = query(itemsRef, where("name", "==", itemName)); // Create a query against the collection
    
        try {
            const querySnapshot = await getDocs(q); // Execute the query
            const items: any = [];
            querySnapshot.forEach((doc) => {
                items.push({...doc.data(), id: doc.id}); // Push each found item into the array with its document ID
            });
            return items; // Return an array of items where name matches 'itemName'
        } catch (error) {
            console.error("Error fetching documents: ", error);
            return []; // Return an empty array in case of error
        }
    }

    const searchResults = results.map((result: any, index: number) => (
        <div key={index}>
            <div>Name: {result.name}</div>
            <div>Ingredients: {result.ingredients ? result.ingredients.join(', ') : 'No ingredients listed'}</div>
        </div>
    ));
    
    return (
        <div>
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
            {searchPerformed && searchResults.length > 0 ? <div>{searchResults}</div> : null}
        </div>
    );
}  