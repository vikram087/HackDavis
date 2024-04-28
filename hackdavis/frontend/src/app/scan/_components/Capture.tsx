'use client'
// Import the functions you need from the SDKs you need

import React, { useState, useRef } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'
import { getStorage, ref, uploadBytes} from 'firebase/storage'
import { updateDoc, doc, arrayUnion, setDoc } from 'firebase/firestore'
import 'react-image-crop/dist/ReactCrop.css'
import {app, db} from '../../firebaseConfig'
import PastScans from '@/app/pastScans/page'
// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
const inputsyle = "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
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

export default function Capture({ image }: { image: any }) {
  const [imgSrc, setImgSrc] = useState(image)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  const blobUrlRef = useRef('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(16 / 9)

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }
  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }
  
    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }
  
    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png'
    });
    const filename = itemName + '.png';
    const file = new File([blob], filename, { type: 'image/png' });
  
    // Set the relative path to the "images" folder
    // Path relative to your origin
    
    // Save the file to Firebase Storage
    const storage = getStorage(app);
    const storageRef = ref(storage, 'images/' + filename); // Adjust 'images/' according to your storage structure
    await uploadBytes(storageRef, file);
    const formData = new FormData();
    formData.append('image', file);
    fetch('http://127.0.0.1:8080/api/image', {
      method: 'POST',
      body: formData,
    })
      .then(
        response => response.json()
      ).then(data => {
        console.log(data)
      })
      .catch(error => {
        // Handle error
      });

      const updateDocument = async (collectionName:any, docId: any, newData: any) => {
        const docRef = doc(db, collectionName, docId);
        // This will update the document with new data, adding to the array without creating duplicates
        const updateStatus = await updateDoc(docRef, {
            pastScans: arrayUnion(newData.pastScans[0]) // Assuming newData.pastScans is an array containing the new scan
        });
    }
  
    const itemDocuemt =  async (collectionName:any, docId: any, newData: any) => {
      const docRef = doc(db, collectionName, docId);
      // This will update the document with new data, adding to the array without creating duplicates
      const updateStatus = await setDoc(docRef, {
          ingredients: ['breadn','afdfasdfa'],// Assuming newData.pastScans is an array containing the new scan
          name: itemName.toLowerCase()
      });
  }
      await updateDocument('people', loadFromLocalStorage('username'), { pastScans: [barcode] });
      await itemDocuemt('items', barcode, {})
    // Optionally, you can revoke the object URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
  }
  
  

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
        )
      }
    },
    100,
    [completedCrop, scale, rotate],
  )

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined)
    } else {
      setAspect(16 / 9)

      if (imgRef.current) {
        const { width, height } = imgRef.current
        const newCrop = centerAspectCrop(width, height, 16 / 9)
        setCrop(newCrop)
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height))
      }
    }
  }

  const [itemName, setItemName] = useState('');
  const [barcode, setBarcode] = useState('');

  const handleItemNameChange = (event: any) => {
    setItemName(event.target.value);
  };

  const handleBarcodeChange = (event: any) => {
    setBarcode(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Pass the item name and barcode to the parent component
    // Clear the input fields after submission
    setItemName('');
    setBarcode('');
  };

  return (
    <div className="App items-center justify-center">
      <div className="Crop-Controls">
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="itemName">Item Name:</label>
        <input
        className={inputsyle}
          type="text"
          id="itemName"
          value={itemName}
          onChange={handleItemNameChange}
          required
        />
      </div>
      <div>
        <label htmlFor="barcode">Barcode:</label>
        <input
        className={inputsyle}
          type="text"
          id="barcode"
          value={barcode}
          onChange={handleBarcodeChange}
          required
        />
      </div>
    </form>
        <input className={`${inputsyle} + mt-4`}type="file" accept="image/*" onChange={onSelectFile} />
        <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
          className={inputsyle}
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
          className={inputsyle}
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>
        <div>
          <button onClick={handleToggleAspectClick}>
            Toggle aspect {aspect ? 'off' : 'on'}
          </button>
        </div>
      </div>
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          // minWidth={400}
          minHeight={100}
          // circularCrop
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      {!!completedCrop && (
        <>
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
          <div>
            <button onClick={onDownloadCropClick}>Send Crop</button>
            <div style={{ fontSize: 12, color: '#666' }}>
              If you get a security error when downloading try opening the
              Preview in a new tab (icon near top right).
            </div>
            <a
              href="#hidden"
              ref={hiddenAnchorRef}
              download
              style={{
                position: 'absolute',
                top: '-200vh',
                visibility: 'hidden',
              }}
            >
              Hidden download
            </a>
          </div>
        </>
      )}

    </div>
  )
}