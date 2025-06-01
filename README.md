# 🩺 Medical Image Preprocessor Web App

This is a web-based application built with **Flask**, **OpenCV**, **HTML/CSS/JS** that allows users to upload medical images and perform common preprocessing operations like **rotation, scaling, translation, shearing, flipping, cropping**,etc. The goal is to make image preprocessing interactive and accessible for medical imaging use cases.

---

## 📌 Features

✅ Upload medical images (JPEG, PNG, etc.)  
✅ View original image (only when requested)  
✅ Perform various image transformations:
- 🔄 **Rotate** by a specific angle
- 🔍 **Scale** up or down (fx, fy)
- ➡️ **Translate** (shift along X and Y)
- 🧭 **Shear** (distort image along X axis)
- ↔️ **Flip** (horizontal or vertical)
- ✂️ **Crop** (center or custom)
- 🎨 **Apply Colormap** (color enhancement)

✅ View processed image immediately after transformation  
✅ Clean and responsive user interface  

---

## 🌐 Technologies Used

| Component  | Tech Stack         |
|------------|--------------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend**  | Python (Flask)     |
| **Image Processing** | OpenCV (cv2) |

---

## 📁 Project Structure

```

medical-image-preprocessor/
├── app.py                   # Flask backend server
├── static/
│   ├── styles.css           # CSS for styling the frontend
│   ├── script.js            # JavaScript to handle image logic & events
│   ├── uploads/             # Uploaded images (input)
│   └── processed/           # Processed images (output)
├── templates/
│   └── index.html           # Frontend UI
├── README.md                # Project documentation

````

---

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medical-image-preprocessor.git
cd medical-image-preprocessor
````

### 2. Set Up Environment

Make sure you have Python installed (3.6+ recommended).

```bash
pip install flask opencv-python numpy
```

### 3. Run the Flask App

```bash
python app.py
```

App will run at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🧪 How to Use

1. **Upload Image** using the file picker.
2. Click **View Original Image** to preview your uploaded image.
3. Choose a transformation (Rotate, Scale, etc.) from the buttons.
4. Provide required input parameters (e.g., angle for rotation).
5. Click **Get Started** to apply the transformation.
6. View the **Processed Image** on the same page.
7. Repeat with different transformations if needed.

---

## 🧩 Supported Transformations Explained

| Transformation | Description                                                                         |
| -------------- | ----------------------------------------------------------------------------------- |
| **Rotate**     | Rotates the image by a user-specified angle around its center.                      |
| **Scale**      | Scales the image using horizontal and vertical scaling factors (fx, fy).            |
| **Translate**  | Moves the image horizontally or vertically using offsets (tx, ty).                  |
| **Shear**      | Applies affine shearing along the X axis.                                           |
| **Flip**       | Flips the image either horizontally or vertically.                                  |
| **Crop**       | Crops the center region (customizable).                                             |
| **Colormap**   | Applies a color map for enhanced visualization (e.g., for grayscale medical scans). |

---

## 📂 Sample Use Case

Doctors, radiologists, or medical researchers can use this app to:

* Perform quick manipulations on X-rays, MRIs, or CT scans
* Adjust images before feeding them into diagnostic ML models
* View augmented images for enhanced analysis

---

## 🔮 Future Enhancements

- Support for DICOM (.dcm) medical image formats  
- AI-powered auto enhancement and preprocessing pipeline  
- Session Management option and transformation history tracking  

---
## 🧑‍💻 Developer Notes

#### NOTE : I have also attached a jupyter notebook file (Medical_Image_Preprocessor.ipynb) which illustrates actual working of each tranformation in backend for better understanding of the operations.


---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Create a pull request

---

## 🙋‍♀️ Support

For questions or suggestions, open an [Issue] or contact [ashwinisbisen@gmail.com](mailto:ashwinisbisen@gmail.com).

---

## 💡 Acknowledgments

* [Flask Documentation](https://flask.palletsprojects.com/)
* [OpenCV Tutorials](https://docs.opencv.org/)
* [Freepik & Unsplash](https://www.freepik.com/) (for medical image samples)

---
## THANK YOU !!
