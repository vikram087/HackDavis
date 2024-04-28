'use client'

import { MultiValue } from 'react-select/animated'
import Header from '../components/header';
import { AuthProvider } from '@propelauth/react';
import React, { useEffect, useState } from 'react';

export default function PastScans() {
  const [response, setResponse] = useState<any>([]);

  const getItem = (id: string) => {
    fetch(`http://localhost:8080/api/getItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"barcode": id}),
    })
    .then(response => response.json())
    .then(data => {
    //   console.log(data);
      setResponse((prevResponse: any) => [...prevResponse, data.document]);
    })
    .catch (error => {
      console.error("Could not fetch item");
    })
  }

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

    const fetchData = () => {
        fetch(`http://localhost:8080/api/pastScans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"username": loadFromLocalStorage("username")}),
        })
        .then(response => response.json())
        .then(data => {
            const pastScans = data.pastScans;
            pastScans.map(async (id: string) => {
                getItem(id);
            });
        })
        .catch (error => {
        console.error("Could not fetch item");
        })
    }

  useEffect(() => {
    fetchData();
  }, []);

  const items = response.map((item: any, index: number) => (
    <div className='border border-black rounded-lg'>
        <p>{item.allergens}</p>
        <p>{item.name}</p>
        <p>{item.barcode}</p>
    </div>
  ));

  return (
    <AuthProvider authUrl='https://6961223141.propelauthtest.com'>
      <div>
        <Header />
        <div className="flex flex-col items-center justify-start h-screen">
          <h1 className="text-3xl font-bold mb-8 p-[2%]">Past Scans</h1>
          <div className="w-1/5"> {/* 20% of the viewport width */}
            {items}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}