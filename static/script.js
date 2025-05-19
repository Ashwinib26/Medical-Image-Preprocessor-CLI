let uploadedFilename = null;

document.getElementById('imageInput').addEventListener('change', async function () {
  const file = this.files[0];
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/uploads', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  uploadedFilename = data.filename;
});

document.getElementById('view-original-btn').addEventListener('click', function () {
  if (uploadedFilename) {
    const imgUrl = `/static/uploads/${uploadedFilename}`;
    document.getElementById('previewImg').src = imgUrl;
    document.getElementById('preview').style.display = 'block';
  } else {
    alert('Please upload an image first.');
  }
});

document.querySelectorAll('.transform-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const type = this.dataset.transform;
    const inputArea = document.getElementById('input-area');
    const inputFields = document.getElementById('input-fields');
    const inputTitle = document.getElementById('input-title');

    inputArea.style.display = 'block';
    inputTitle.innerText = `Enter Parameters for ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    inputFields.innerHTML = '';

    if (type === 'rotate') {
      inputFields.innerHTML = `<label>Angle: <input type="number" name="angle" value="0" /></label>`;
    } else if (type === 'scale') {
      inputFields.innerHTML = `
        <label>fx: <input type="number" step="0.1" name="fx" value="1" /></label>
        <label>fy: <input type="number" step="0.1" name="fy" value="1" /></label>`;
    } else if (type === 'translate') {
      inputFields.innerHTML = `
        <label>tx: <input type="number" name="tx" value="0" /></label>
        <label>ty: <input type="number" name="ty" value="0" /></label>`;
    } else if (type === 'shear') {
      inputFields.innerHTML = `<label>Shear Value: <input type="number" step="0.1" name="shear" value="0" /></label>`;
    } else if (type === 'flip') {
      inputFields.innerHTML = `
        <label>Mode: 
          <select name="mode">
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label>`;
    } else if (type === 'crop') {
      inputFields.innerHTML = `
        <label>X: <input type="number" name="x" value="0" /></label>
        <label>Y: <input type="number" name="y" value="0" /></label>
        <label>W: <input type="number" name="w" value="100" /></label>
        <label>H: <input type="number" name="h" value="100" /></label>`;
    }

    document.getElementById('get-started-btn').onclick = async () => {
      const inputs = inputFields.querySelectorAll('input, select');
      const params = {};
      inputs.forEach(input => {
        params[input.name] = input.value;
      });

      const res = await fetch('/processed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: uploadedFilename,
          action: type,
          params
        })
      });

      const result = await res.json();
      document.getElementById('processedImg').src = `/${result.processed_image}`;
      document.getElementById('output-area').style.display = 'block';
    };
  });
});
