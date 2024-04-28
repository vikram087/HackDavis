'use client'
import { AuthProvider } from '@propelauth/react';
import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Header from '../components/header';
import ScreenShot from './_components/ScreenShot'
const WebcamCapturePage: React.FC = () => {
        
       // Initialize cropperRef with Cropper type


       

    return (
        <AuthProvider authUrl='https://6961223141.propelauthtest.com'>
            <Header></Header>
            <ScreenShot></ScreenShot>
            
   </AuthProvider>
    );
};

export default WebcamCapturePage;