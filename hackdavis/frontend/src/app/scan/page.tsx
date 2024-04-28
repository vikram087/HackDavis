'use client'
import React, { useState } from 'react';

export default function Scan() {
    const [barcode, setBarcode] = useState("");

    const showCamera = () => {
        fetch(`http://localhost:8080/api/image`)
        .then((response) => response.json())
        .then(data => {
            setBarcode(data.barcode);
            // fetchData();
        })
    };

    const fetchData = async () => {
        const appId = '4a7fedbc'; // Replace with your Edamam app ID
        const appKey = '2c98d1a25a374625c910796a81522c72'; // Replace with your Edamam app key
      
        try {
          const response = await fetch('https://api.edamam.com/api/food-database/v2/parser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              app_id: appId,
              app_key: appKey,
              upc: barcode,
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
      
          const data = await response.json();
          console.log(data);
          // Process the received data here
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
    return (
        <div>
            <button onClick={showCamera}>Capture Barcode</button>
            <div>{barcode}</div>
        </div>
    );
}

// import { MultiValue } from 'react-select/animated'
// import Header from '../components/header';
// import { AuthProvider } from '@propelauth/react';

// export default function PastScans() {
//   const [response, setResponse] = useState<any>([]);

//   const getItem = (id: string) => {
//     fetch(`http://localhost:8080/api/getItem`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({"barcode": id}),
//     })
//     .then(response => response.json())
//     .then(data => {
//     //   console.log(data);
//       setResponse((prevResponse: any) => [...prevResponse, data.document]);
//     })
//     .catch (error => {
//       console.error("Could not fetch item");
//     })
//   }

//   const loadFromLocalStorage = (key: string) => {
//     try {
//       const serializedValue = localStorage.getItem(key);
//       if (serializedValue === null) {
//         return undefined;
//       }
//       return JSON.parse(serializedValue);
//     } catch (error) {
//       console.error('Error reading from localStorage', error);
//       return undefined;
//     }
//   };

//     const fetchData = () => {
//         fetch(`http://localhost:8080/api/pastScans`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({"username": loadFromLocalStorage("username")}),
//         })
//         .then(response => response.json())
//         .then(data => {
//             const pastScans = data.pastScans;
//             pastScans.map(async (id: string) => {
//                 getItem(id);
//             });
//         })
//         .catch (error => {
//         console.error("Could not fetch item");
//         })
//     }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const items = response.map((item: any, index: number) => (
//     <div className='border border-black rounded-lg'>
//         <p>{item.allergens}</p>
//         <p>{item.name}</p>
//         <p>{item.barcode}</p>
//     </div>
//   ));

//   return (
//     <AuthProvider authUrl='https://6961223141.propelauthtest.com'>
//       <div>
//         <Header />
//         <div className="flex flex-col items-center justify-start h-screen">
//           <h1 className="text-3xl font-bold mb-8 p-[2%]">Past Scans</h1>
//           <div className="w-1/5"> {/* 20% of the viewport width */}
//             {items}
//           </div>
//         </div>
//       </div>
//     </AuthProvider>
//   );
// }


// export default WebcamCapturePage;
