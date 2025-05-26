from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from PIL import Image, ImageOps
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['image']
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'filename': filename})
    return jsonify({'error': 'No file uploaded'}), 400

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    filename = data.get('filename')
    action = data.get('action')
    params = data.get('params', {})

    print(f"Action: {action}, Params: {params}")  # Debug line

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    processed_filename = f"processed_{filename}"
    processed_path = os.path.join(app.config['UPLOAD_FOLDER'], processed_filename)

    try:
        image = Image.open(filepath)

        if action == 'rotate':
            angle = float(params.get('rotate_angle', 0))
            processed_img = image.rotate(angle, expand=True)

        elif action == 'scale':
            factor = float(params.get('scale_factor', 1))
            new_size = (int(image.width * factor), int(image.height * factor))
            processed_img = image.resize(new_size)

        elif action == 'translate':
            tx = int(params.get('translate_x', 0))
            ty = int(params.get('translate_y', 0))
            processed_img = Image.new("RGB", image.size)
            processed_img.paste(image, (tx, ty))

        elif action == 'shear':
            shear_x = float(params.get('shear_x', 0))
            shear_y = float(params.get('shear_y', 0))
            matrix = (1, shear_x, 0, shear_y, 1, 0)
            processed_img = image.transform(image.size, Image.AFFINE, matrix)

        elif action == 'flip':
            flip_mode = params.get('flip_mode')
            if flip_mode == 'horizontal':
                processed_img = ImageOps.mirror(image)
            elif flip_mode == 'vertical':
                processed_img = ImageOps.flip(image)
            else:
                return jsonify({'error': 'Invalid flip mode'}), 400

        elif action == 'crop':
            left = int(params.get('crop_left', 0))
            top = int(params.get('crop_top', 0))
            right = int(params.get('crop_right', image.width))
            bottom = int(params.get('crop_bottom', image.height))
            processed_img = image.crop((left, top, right, bottom))

        else:
            return jsonify({'error': 'Invalid action'}), 400

        processed_img.save(processed_path)
        return jsonify({'processed_image': f'/{processed_path}'})

    except Exception as e:
        print("Processing error:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
