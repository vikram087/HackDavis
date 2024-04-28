'use client'
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select/animated'
import Header from '../components/header';
import { AuthProvider } from '@propelauth/react';
import React, { useState } from 'react';

const options: Flavor[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];
type Flavor = {
  value: string;
  label: string;
};

export default function Selecter() {

    const [selected, setSelected] = useState<String[]>([]);

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

    const submitToDB = () => {
      fetch("http://localhost:8080/api/update-allergens", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "userName": loadFromLocalStorage("username"), "allergens": selected }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error updating allergies:', error);
      });
    };

    const handleChange = (selectedItems: any) => {
        console.log(selectedItems);
        const flavorValues = selectedItems.map((selectedItems: { value: any; }) => selectedItems.value);
        setSelected(flavorValues);
    };

    return (
      <AuthProvider authUrl='https://6961223141.propelauthtest.com'>
        <div>
          <Header></Header>
          <div className="flex flex-col justify-center items-center h-screen"> {/* Flex column container */}
            <div className="w-1/5"> {/* 20% of the viewport width */}
              <CreatableSelect 
                isMulti 
                options={options} 
                onChange={handleChange}
              />
            </div>
            <div className='text-center w-full mt-3'> {/* Full width to align the button center */}
              <button onClick={submitToDB} className='border p-1 rounded-lg border-black'>Submit</button>
            </div>
          </div>
        </div>
      </AuthProvider>
    );    
}