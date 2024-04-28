'use client'
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select/animated'
import Header from '../components/header';
import { AuthProvider } from '@propelauth/react';
import React, { useState, useEffect } from 'react';
import { updateDoc, doc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../firebaseConfig';

const options: Flavor[] = [
  { value: 'milk', label: 'Milk' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'treeNuts', label: 'Tree Nuts' },
  { value: 'soy', label: 'Soy' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'mustard', label: 'Mustard' },
  { value: 'celery', label: 'Celery' },
  { value: 'lupin', label: 'Lupin' },
  { value: 'sulfites', label: 'Sulfites' },
  { value: 'molluscs', label: 'Molluscs' },
  { value: 'corn', label: 'Corn' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'banana', label: 'Banana' },
  { value: 'latex', label: 'Latex' },
  { value: 'garlic', label: 'Garlic' },
  { value: 'chickpeas', label: 'Chickpeas' },
  { value: 'buckwheat', label: 'Buckwheat' },
  { value: 'almonds', label: 'Almonds' },
  { value: 'hazelnuts', label: 'Hazelnuts' },
  { value: 'walnuts', label: 'Walnuts' },
  { value: 'cashews', label: 'Cashews' },
  { value: 'pecans', label: 'Pecans' },
  { value: 'oats', label: 'Oats' },
  { value: 'coconut', label: 'Coconut' },
  { value: 'peaches', label: 'Peaches' },
  { value: 'tomatoes', label: 'Tomatoes' },
  { value: 'strawberries', label: 'Strawberries' },
  { value: 'citrus', label: 'Citrus' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'cinnamon', label: 'Cinnamon' },
  { value: 'msg', label: 'MSG' }
];

type Flavor = {
  value: string;
  label: string;
};

export default function Selecter() {

    const [selected, setSelected] = useState<String[]>([]);
    const [allergens, setAllergens] = useState<any>([]);

    const submitButton = () => {
      submitToDB();
    };

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

    const submitToDB = async () => {
      const updateDocument = async (collectionName: any, docId: any, newData: any) => {
          const docRef = doc(db, collectionName, docId);
          // This will update the document with new data, adding to the array without creating duplicates
          const updateStatus = await updateDoc(docRef, {
              allergens: arrayUnion(...newData.allergens) // Assuming newData.allergens is an array of allergens to add
          });
          return updateStatus;
      };
  
      // Load the username from local storage and the selected allergens
      const username = loadFromLocalStorage("username");
      const selectedAllergens = selected; // Assuming 'selected' is an array of allergens
  
      // Update the document for the user with new allergens
      await updateDocument('people', username, { allergens: selectedAllergens });
  
      // Reload the page (or update the UI state as needed)
      window.location.reload();
  };
  

    const handleChange = (selectedItems: any) => {
        console.log(selectedItems);
        const flavorValues = selectedItems.map((selectedItems: { value: any; }) => selectedItems.value);
        setSelected(flavorValues);
    };

    useEffect(() => {
      const fetchAllergens = async () => {
          const username = loadFromLocalStorage("username");
          const allergens = await getAllergens(username);
          if (allergens) {
              setAllergens(allergens);
          } else {
              setAllergens([]); // or any default value you consider appropriate
          }
      };
  
      fetchAllergens();
    }, []);

    async function getAllergens(userId: string): Promise<string[] | null> {
      const docRef = doc(db, "people", userId);
      try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              const allergens = docSnap.data().allergens; // Assumes 'allergens' is stored as an array
              console.log(allergens);
              return allergens;
          } else {
              console.log("No such document!");
              return null; // Return null if no document is found
          }
      } catch (error) {
          console.error("Error accessing the document:", error);
          return null; // Handle errors, such as permissions issues or network problems
      }
   }

   const removeFromDB = async (allergen: string) => {
      const docRef = doc(db, "people", loadFromLocalStorage("username")); // Reference to the specific document
      try {
          await updateDoc(docRef, {
              allergens: arrayRemove(allergen) // Remove the specified allergen from the array
          });
          console.log("Allergen removed successfully");
      } catch (error) {
          console.error("Error removing allergen: ", error);
      } 
      window.location.reload();
    };  
  
    return (
      <AuthProvider authUrl='https://6961223141.propelauthtest.com'>
        <Header></Header>
        <div>
          <h1 className="text-3xl font-bold mb-8 p-[2%] text-center">Current Allergens</h1>
          <div className="flex justify-center items-center w-full space-x-10">
              {allergens.map((allergen: string, index: number) => (
                  <div key={index} className="bg-gray-200 p-4 mb-20 cursor-pointer" onDoubleClick={() => removeFromDB(allergen)}>{allergen}</div>
              ))}
          </div>
          <div className="flex flex-col justify-center items-center"> {/* Flex column container */}
            <div className="w-1/5"> {/* 20% of the viewport width */}
              <CreatableSelect 
                isMulti 
                options={options} 
                onChange={handleChange}
              />
            </div>
            <div className='text-center w-full mt-3'> {/* Full width to align the button center */}
              <button onClick={submitButton} className='border p-1 rounded-lg border-black'>Submit</button>
            </div>
          </div>
        </div>
      </AuthProvider>
    );    
}