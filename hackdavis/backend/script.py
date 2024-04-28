import cv2 
from pyzbar.pyzbar import decode 
import time

def capture_image_with_countdown():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return

    try:
        for i in range(3, 0, -1):
            ret, frame = cap.read()
            if not ret:
                break
            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(frame, str(i), (50, 50), font, 1, (0, 255, 255), 2, cv2.LINE_AA)
            cv2.imshow('Camera', frame)
            cv2.waitKey(1000)

        ret, frame = cap.read()
        if not ret:
            return

        cv2.imwrite('captured_image.jpg', frame)
        time.sleep(2)  # Delay to mimic the asyncio.sleep

    finally:
        cap.release()
        # cv2.destroyAllWindows()
        
    barcode = BarcodeReader("./captured_image.jpg")
    # return barcode
    print(barcode)
        
def BarcodeReader(image): 
    # read the image in numpy array using cv2 
    img = cv2.imread(image) 
       
    # Decode the barcode image 
    detectedBarcodes = decode(img) 
       
    # If not detected then print the message 
    if not detectedBarcodes: 
        print("Barcode Not Detected or your barcode is blank/corrupted!") 
    else: 
        
          # Traverse through all the detected barcodes in image 
        for barcode in detectedBarcodes:   
            
            # Locate the barcode position in image 
            (x, y, w, h) = barcode.rect 
              
            # Put the rectangle in image using  
            # cv2 to highlight the barcode 
            cv2.rectangle(img, (x-10, y-10), 
                          (x + w+10, y + h+10),  
                          (255, 0, 0), 2) 
              
            if barcode.data!="": 
                
            # Print the barcode data 
                # print(barcode.data) 
                # print(barcode.type) 
                byte_string = barcode.data
                decoded_string = byte_string.decode('utf-8')
                formatted_string = decoded_string.lstrip('0')

                return f"0{formatted_string}"
                  
    #Display the image 
    cv2.imshow("Image", img) 
    cv2.waitKey(0) 
    # cv2.destroyAllWindows()
    
capture_image_with_countdown()  