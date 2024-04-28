import { useState, useRef } from "react";
import Webcam from "react-webcam";
import ReactCrop from "react-image-crop";
import dynamic from "next/dynamic"; // For dynamic import
import Capture from "./Capture";
export default function ScreenShot(){
    const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
  const [output, setOutput] = useState(null);
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);


const capture = () => {
  const imageSrc = webcamRef.current.getScreenshot();
  const byteCharacters = atob(imageSrc.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  const imageUrl = URL.createObjectURL(blob);
  setCapturedImage(imageUrl);
  console.log("Captured Image URL:", imageUrl);
};
  console.log(capturedImage)

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
      <button onClick={capture}>Capture</button>
      {capturedImage && (
        <Capture image={capturedImage}></Capture>
      )}
    </div>
  );
};
