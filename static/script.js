document.getElementById('imageInput').addEventListener('change', function (event) {
    const preview = document.getElementById('previewImg');
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
