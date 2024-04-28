'use client'
import CreatableSelect from 'react-select/creatable';
import { MultiValue } from 'react-select/animated'
import Header from '../components/header';
import { AuthProvider } from '@propelauth/react';
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

export default function Selecter() {
  return (
    <AuthProvider authUrl='https://6961223141.propelauthtest.com'>
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold ">Add New Allergens</h1>
          <div className="w-1/5"> {/* 20% of the viewport width */}
            <CreatableSelect isMulti options={options} />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}