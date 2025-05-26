let originalImageFile = null;
let currentTransform = null;

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

            // Hide output image
            document.getElementById('output-area').style.display = 'none';
        };
        reader.readAsDataURL(file);
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

// Show inputs dynamically when a transform is selected
document.querySelectorAll('.transform-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentTransform = btn.getAttribute('data-transform');
        const inputFields = document.getElementById('input-fields');
        const inputTitle = document.getElementById('input-title');

        inputFields.innerHTML = '';
        inputTitle.textContent = `Apply ${currentTransform.charAt(0).toUpperCase() + currentTransform.slice(1)} Transformation`;

        // Dynamically generate fields
        switch (currentTransform) {
            case 'rotate':
                inputFields.innerHTML = `<label>Angle (degrees):</label><input type="number" name="rotate" required>`;
                break;
            case 'scale':
                inputFields.innerHTML = `<label>Scale Factor:</label><input type="number" name="scale" step="0.1" required>`;
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
                    <select name="flip">
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                    </select>`;
                break;
            case 'crop':
                inputFields.innerHTML = `
                    <label>X:</label><input type="number" name="crop_x" required>
                    <label>Y:</label><input type="number" name="crop_y" required>
                    <label>Width:</label><input type="number" name="crop_w" required>
                    <label>Height:</label><input type="number" name="crop_h" required>`;
                break;
        }

        document.getElementById('input-area').style.display = 'block';
    });
});

// Get Started (send transformation request)
document.getElementById('get-started-btn').addEventListener('click', () => {
    if (!originalImageFile || !currentTransform) {
        alert("Please upload an image and select a transformation.");
        return;
    }

    const formData = new FormData();
    formData.append('image', originalImageFile);

    const inputs = document.querySelectorAll('#input-fields input, #input-fields select');
    inputs.forEach(input => {
        if (input.value !== '') {
            formData.append(input.name, input.value);
        }
    });

    fetch('/transform', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Transformation failed.");
        return res.blob();
    })
    .then(blob => {
        const outputImg = document.getElementById('processedImg');
        outputImg.src = URL.createObjectURL(blob);
        document.getElementById('output-area').style.display = 'block';
    })
    .catch(err => {
        console.error(err);
        alert("Transformation failed.");
    });
});

// Reset Image (send original back)
document.getElementById('reset-button').addEventListener('click', () => {
    if (!originalImageFile) {
        alert("Please upload an image first.");
        return;
    }

    const formData = new FormData();
    formData.append('image', originalImageFile);
    formData.append('reset', 'true');

    fetch('/transform', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Reset failed.");
        return res.blob();
    })
    .then(blob => {
        const outputImg = document.getElementById('processedImg');
        outputImg.src = URL.createObjectURL(blob);
        document.getElementById('output-area').style.display = 'block';
    })
    .catch(err => {
        console.error(err);
        alert("Reset failed.");
    });
});
