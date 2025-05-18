from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['PROCESSED_FOLDER'] = 'static/processed'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)

def process_image(img_path, action, value):
    img = cv2.imread(img_path)

    if action == 'rotate':
        rot_matrix = cv2.getRotationMatrix2D((img.shape[1]/2, img.shape[0]/2), float(value), 1)
        img = cv2.warpAffine(img, rot_matrix, (img.shape[1], img.shape[0]))

    elif action == 'scale':
        scale = float(value)
        img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)

    elif action == 'shear':
        shear = float(value)
        img = cv2.warpAffine(img, np.float32([[1, shear, 0], [0, 1, 0]]), (img.shape[1], img.shape[0]))

    elif action == 'flip':
        if value == 'horizontal':
            img = cv2.flip(img, 1)
        elif value == 'vertical':
            img = cv2.flip(img, 0)

    elif action == 'translate':
        tx, ty = map(int, value.split(','))
        translation_matrix = np.float32([[1, 0, tx], [0, 1, ty]])
        img = cv2.warpAffine(img, translation_matrix, (img.shape[1], img.shape[0]))

    elif action == 'crop':
        # Simple auto-cropping based on largest contour
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 40, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        x, y, w, h = cv2.boundingRect(max(contours, key=cv2.contourArea))
        img = img[y:y+h, x:x+w]

    filename = os.path.join(app.config['PROCESSED_FOLDER'], 'processed.jpg')
    cv2.imwrite(filename, img)
    return filename

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    file = request.files['image']
    action = request.form.get('action')
    value = request.form.get('value')

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        processed_path = process_image(filepath, action, value)
        return render_template('result.html', processed_image=processed_path)

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
