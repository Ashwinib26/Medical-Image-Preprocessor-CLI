document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('imageInput');
    const previewImg = document.getElementById('previewImg');
    const viewOriginalBtn = document.getElementById('view-original-btn');
    const previewDiv = document.getElementById('preview');
    const transformBtns = document.querySelectorAll('.transform-btn');
    const inputArea = document.getElementById('input-area');
    const inputFields = document.getElementById('input-fields');
    const inputTitle = document.getElementById('input-title');
    const getStartedBtn = document.getElementById('get-started-btn');
    const processedImg = document.getElementById('processedImg');
    const processedSection = document.getElementById('processed-section');

    let selectedTransform = '';
    let uploadedImageFile = null;
    let originalImageDataUrl = '';

    // Handle file upload
    imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        uploadedImageFile = file;
        processedSection.style.display = 'none';
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                originalImageDataUrl = event.target.result;
                previewImg.src = originalImageDataUrl;
                previewDiv.style.display = 'none'; // hide until 'view' button is clicked
            };
            reader.readAsDataURL(file);
        }
    });

    // View original image button
    viewOriginalBtn.addEventListener('click', () => {
        if (originalImageDataUrl) {
            previewImg.src = originalImageDataUrl;
            previewDiv.style.display = 'block';
        } else {
            alert("Please upload an image first.");
        }
    });

    // Handle transformation buttons
    transformBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTransform = btn.dataset.transform;
            showInputFields(selectedTransform);
        });
    });

    // Submit image + transformation
    getStartedBtn.addEventListener('click', () => {
        if (!uploadedImageFile) {
            alert("Please upload an image first.");
            return;
        }

        const formData = new FormData();
        formData.append('image', uploadedImageFile);
        formData.append('transformation', selectedTransform);

        const inputs = inputFields.querySelectorAll('input');
        inputs.forEach(input => {
            formData.append(input.name, input.value);
        });

        fetch('/process', {
            method: 'POST',
            body: formData
        })
        .then(res => res.blob())
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            processedImg.src = imageUrl;
            processedSection.style.display = 'block';
        })
        .catch(err => {
            console.error('Processing error:', err);
            alert('Something went wrong while processing the image.');
        });
    });

    function showInputFields(transform) {
        inputFields.innerHTML = '';
        inputArea.style.display = 'block';
        inputTitle.textContent = `Enter ${transform} parameters`;

        const fields = {
            rotate: [{ name: 'rotateAngle', label: 'Angle (°)', type: 'number' }],
            scale: [{ name: 'scaleFactor', label: 'Scale Factor (e.g. 1.2)', type: 'number', step: '0.1' }],
            crop: [
                { name: 'cropX', label: 'X', type: 'number' },
                { name: 'cropY', label: 'Y', type: 'number' },
                { name: 'cropWidth', label: 'Width', type: 'number' },
                { name: 'cropHeight', label: 'Height', type: 'number' }
            ],
            flip: [{ name: 'flipDirection', label: 'Direction (horizontal or vertical)', type: 'text' }],
            translate: [
                { name: 'translateX', label: 'Translate X (px)', type: 'number' },
                { name: 'translateY', label: 'Translate Y (px)', type: 'number' }
            ]
        };

        const inputs = fields[transform] || [];

        inputs.forEach(f => {
            const label = document.createElement('label');
            label.textContent = f.label;
            const input = document.createElement('input');
            input.name = f.name;
            input.type = f.type;
            if (f.step) input.step = f.step;
            input.required = true;
            inputFields.appendChild(label);
            inputFields.appendChild(input);
        });
    }
});
