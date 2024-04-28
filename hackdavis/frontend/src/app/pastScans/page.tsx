'use client'
import { collection, getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"

export default function PastScans() {
    const [pastScans, setPastScans] = useState([]);
    const [items, setItems] = useState<any>([]);

    const loadFromLocalStorage = (key: string) => {
        try {
          const serializedValue = localStorage.getItem(key);
          if (serializedValue === null) {
            return undefined;
          }
          return JSON.parse(serializedValue);
        } catch (error) {
          console.error('Error reading from localStorage', error);
          return undefined;
        }
    };

    const getPastScans = async () => {
        const peopleRef = collection(db, "people");
        const userDoc = await getDoc(doc(peopleRef, loadFromLocalStorage("username")));

        if(userDoc.exists()) {
            setPastScans(userDoc.data().pastScans);
            console.log("Past scans", pastScans);
        } else {
            console.log("Document does not exist");
        }
    };

    useEffect(() => {
        getPastScans();
    }, []);
    
    useEffect(() => {
        const fetchItems = async () => {
            for (const id of pastScans) {
                await getItems(id);
            }
        };
        if (pastScans.length > 0) {
            fetchItems();
        }
    }, [pastScans]); // Depend on `pastScans` to refetch items
    
    const getItems = async (id: string) => {
        const itemRef = collection(db, "items");
        const itemDoc = await getDoc(doc(itemRef, id));
        if (itemDoc.exists()) {
            setItems((prevItems: any) => [...prevItems, itemDoc.data()]);
        } else {
            console.log("Document does not exist");
        }
    };

    return (
        <div>
            <p className="text-center pt-10 text-3xl">Past Scans</p>
            {items.map((item: any, index: number) => (
                <div className="bg-gray-200 p-4 mb-4 cursor-pointer" key={index}>
                    <div>Item Name: {item.name}</div>
                    <div>Barcode Number: {pastScans[index]}</div>
                    <span>Ingredients: {item.ingredients && item.ingredients.join(', ')}</span>
                </div>
            ))}
        </div>
    );
}