document.addEventListener('DOMContentLoaded', () => {
    const preview = document.getElementById('previewImg');
    const inputArea = document.getElementById('input-area');
    const inputTitle = document.getElementById('input-title');
    const inputFields = document.getElementById('input-fields');
    const transformBtns = document.querySelectorAll('.transform-btn');

    // Show image preview on upload
    document.getElementById('imageInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                preview.src = reader.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Show corresponding input fields on button click
    transformBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-transform');
            inputArea.style.display = 'block';
            inputFields.innerHTML = ''; // Clear old inputs

            switch (type) {
                case 'rotate':
                    inputTitle.textContent = 'Rotate Image';
                    inputFields.innerHTML = `
                        <label for="rotateAngle">Angle (degrees):</label>
                        <input type="number" id="rotateAngle" placeholder="e.g., 90">
                    `;
                    break;

                case 'crop':
                    inputTitle.textContent = 'Crop Image';
                    inputFields.innerHTML = `
                        <label>X:</label><input type="number" id="cropX">
                        <label>Y:</label><input type="number" id="cropY">
                        <label>Width:</label><input type="number" id="cropWidth">
                        <label>Height:</label><input type="number" id="cropHeight">
                    `;
                    break;

                case 'scale':
                    inputTitle.textContent = 'Scale Image';
                    inputFields.innerHTML = `
                        <label>Scale Factor:</label>
                        <input type="number" step="0.1" id="scaleFactor" placeholder="e.g., 0.5">
                    `;
                    break;

                case 'shear':
                    inputTitle.textContent = 'Shear Image';
                    inputFields.innerHTML = `
                        <label>Shear Value (px or deg):</label>
                        <input type="number" id="shearValue">
                    `;
                    break;

                case 'flip':
                    inputTitle.textContent = 'Flip Image';
                    inputFields.innerHTML = `
                        <label>Direction:</label>
                        <select id="flipDirection">
                            <option value="horizontal">Horizontal</option>
                            <option value="vertical">Vertical</option>
                        </select>
                    `;
                    break;

                case 'translate':
                    inputTitle.textContent = 'Translate Image';
                    inputFields.innerHTML = `
                        <label>Translate X:</label><input type="number" id="translateX">
                        <label>Translate Y:</label><input type="number" id="translateY">
                    `;
                    break;
            }
        });
    });
});
