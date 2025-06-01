let originalImageFile = null;
let currentTransform = null;
let uploadedFilename = null; // To store the uploaded filename

// Preview image and store it
document.getElementById('imageInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        originalImageFile = file;

        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImg = document.getElementById('previewImg');
            previewImg.src = e.target.result;
            document.getElementById('preview').style.display = 'block';
            document.getElementById('output-area').style.display = 'none';
        };
        reader.readAsDataURL(file);

        // Reset previous filename
        uploadedFilename = null;
    }
});

// View original image
document.getElementById('view-original-btn').addEventListener('click', () => {
    if (!originalImageFile) {
        alert("Please upload an image first.");
        return;
    }
    document.getElementById('preview').style.display = 'block';
});

// Transformation buttons logic
document.querySelectorAll('.transform-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentTransform = btn.getAttribute('data-transform');
        const inputFields = document.getElementById('input-fields');
        const inputTitle = document.getElementById('input-title');

        inputFields.innerHTML = '';
        inputTitle.textContent = `Apply ${currentTransform.charAt(0).toUpperCase() + currentTransform.slice(1)} Transformation`;

        switch (currentTransform) {
            case 'rotate':
                inputFields.innerHTML = `<label>Angle (degrees):</label><input type="number" name="rotate_angle" required>`;
                break;
            case 'scale':
                inputFields.innerHTML = `<label>Scale Factor:</label><input type="number" name="scale_factor" step="0.1" required>`;
                break;
            case 'translate':
                inputFields.innerHTML = `
                    <label>Translate X (px):</label><input type="number" name="translate_x" required>
                    <label>Translate Y (px):</label><input type="number" name="translate_y" required>`;
                break;
            case 'shear':
                inputFields.innerHTML = `
                    <label>Shear X:</label><input type="number" name="shear_x" step="0.1" required>
                    <label>Shear Y:</label><input type="number" name="shear_y" step="0.1" required>`;
                break;
            case 'flip':
                inputFields.innerHTML = `
                    <label>Flip Axis:</label>
                    <select name="flip_mode">
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                    </select>`;
                break;
            case 'crop':
                inputFields.innerHTML = `
                    <label>Left (X):</label><input type="number" name="crop_left" required>
                    <label>Top (Y):</label><input type="number" name="crop_top" required>
                    <label>Right (X):</label><input type="number" name="crop_right" required>
                    <label>Bottom (Y):</label><input type="number" name="crop_bottom" required>`;
                break;
        }

        document.getElementById('input-area').style.display = 'block';
    });
});

// Apply transformation
document.getElementById('get-started-btn').addEventListener('click', () => {
    if (!originalImageFile || !currentTransform) {
        alert("Please upload an image and select a transformation.");
        return;
    }

    const performTransform = (filename) => {
        const params = {};
        const inputs = document.querySelectorAll('#input-fields input, #input-fields select');
        inputs.forEach(input => {
            params[input.name] = input.value;
        });

        fetch('/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: filename,
                action: currentTransform,
                params: params
            })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.processed_image) throw new Error("Processing failed");

            const outputImg = document.getElementById('processedImg');
            outputImg.src = `${data.processed_image}?t=${Date.now()}`;
            document.getElementById('output-area').style.display = 'block';
        })
        .catch(err => {
            console.error(err);
            alert("Something went wrong during transformation.");
        });
    };

    if (uploadedFilename) {
        performTransform(uploadedFilename);
    } else {
        const uploadForm = new FormData();
        uploadForm.append('image', originalImageFile);

        fetch('/upload', {
            method: 'POST',
            body: uploadForm
        })
        .then(res => res.json())
        .then(data => {
            if (!data.filename) throw new Error("Upload failed");
            uploadedFilename = data.filename;
            performTransform(uploadedFilename);
        })
        .catch(err => {
            console.error(err);
            alert("Upload failed.");
        });
    }
});

// Reset values only
document.getElementById('reset-values-btn').addEventListener('click', () => {
    if (!currentTransform) return;

    const inputFields = document.querySelectorAll('#input-fields input, #input-fields select');
    inputFields.forEach(input => {
        if (input.tagName.toLowerCase() === 'input') input.value = '';
        if (input.tagName.toLowerCase() === 'select') input.selectedIndex = 0;
    });
});

// Reset everything
document.getElementById('reset-image-btn').addEventListener('click', () => {
    document.getElementById('preview').style.display = 'none';
    document.getElementById('input-area').style.display = 'none';
    document.getElementById('output-area').style.display = 'none';
    document.getElementById('imageInput').value = '';
    document.getElementById('processedImg').src = '';
    originalImageFile = null;
    uploadedFilename = null;
    currentTransform = null;
});
