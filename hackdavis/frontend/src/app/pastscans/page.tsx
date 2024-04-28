'use client'

import { MultiValue } from 'react-select/animated'
import Header from '../components/header';
import { AuthProvider } from '@propelauth/react';
import React, { useEffect, useState } from 'react';

export default function Selecter() {

  const getItem = (id: string) => {
    fetch(`http://localhost:8080/api/getItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"barcodes": id}),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setResponse(data.ingredients);
    })
    .catch (error => {
      console.error("Could not fetch item");
    })
  }

  const [response, setResponse] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8080/api/pastscans');
        const jsonData = await response.json();
        const pastscans: string[] = jsonData.pastScans;
  
        // Array to store all the fetch requests
        const fetchRequests = pastscans.map(async id => {
          getItem(id);
        });
  
        // Execute all fetch requests concurrently and await all of them
        const results = await Promise.all(fetchRequests);
  
        // Process the results
        results.forEach(result => {
          // Do something with each result
          console.log(result);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, []);

  return (
    <AuthProvider authUrl='https://6961223141.propelauthtest.com'>
      <div>
        <Header />
        <div className="flex flex-col items-center justify-start h-screen">
          <h1 className="text-3xl font-bold mb-8 p-[2%]">Past Scans</h1>
          <div className="w-1/5"> {/* 20% of the viewport width */}
            
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}