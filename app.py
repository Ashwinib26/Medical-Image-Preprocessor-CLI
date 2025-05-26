from flask import Flask, render_template, request, jsonify
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
RESULT_FOLDER = 'static/processed'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULT_FOLDER'] = RESULT_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploads', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    return jsonify({'filename': filename})

@app.route('/processed', methods=['POST'])
def process():
    data = request.json
    filename = data.get('filename')
    action = data.get('action')
    params = data.get('params', {})

    if not filename or not action:
        return jsonify({'error': 'Missing filename or action'}), 400

    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(image_path):
        return jsonify({'error': 'File not found'}), 404

    img = cv2.imread(image_path)

    if action == 'rotate':
        angle = float(params.get('angle', 0))
        (h, w) = img.shape[:2]
        M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1)
        img = cv2.warpAffine(img, M, (w, h))

    elif action == 'scale':
        fx = float(params.get('fx', 1))
        fy = float(params.get('fy', 1))
        img = cv2.resize(img, None, fx=fx, fy=fy, interpolation=cv2.INTER_LINEAR)

    elif action == 'translate':
        tx = int(params.get('tx', 0))
        ty = int(params.get('ty', 0))
        M = np.float32([[1, 0, tx], [0, 1, ty]])
        img = cv2.warpAffine(img, M, (img.shape[1], img.shape[0]))

    elif action == 'shear':
        shear_val = float(params.get('shear', 0))
        M = np.float32([[1, shear_val, 0], [0, 1, 0]])
        img = cv2.warpAffine(img, M, (img.shape[1], img.shape[0]))

    elif action == 'flip':
        mode = params.get('mode')
        flip_code = 1 if mode == 'horizontal' else 0
        img = cv2.flip(img, flip_code)

    elif action == 'crop':
        x = int(params.get('x', 0))
        y = int(params.get('y', 0))
        w = int(params.get('w', img.shape[1]))
        h = int(params.get('h', img.shape[0]))
        img = img[y:y+h, x:x+w]

    elif action == 'colormap':
        cmap = params.get('cmap', 'JET').upper()
        colormaps = {
            'JET': cv2.COLORMAP_JET,
            'HOT': cv2.COLORMAP_HOT,
            'COOL': cv2.COLORMAP_COOL,
            'BONE': cv2.COLORMAP_BONE,
        }
        if cmap in colormaps:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img = cv2.applyColorMap(gray, colormaps[cmap])

    else:
        return jsonify({'error': f'Unknown transformation: {action}'}), 400

    out_filename = f'processed_{action}_{filename}'
    out_path = os.path.join(app.config['RESULT_FOLDER'], out_filename)
    cv2.imwrite(out_path, img)

    return jsonify({'processed_image': out_path})

if __name__ == '__main__':
    app.run(debug=True)
