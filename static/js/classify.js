document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureButton = document.getElementById('capture');
    const uploadInput = document.getElementById('upload');
    const resultDiv = document.getElementById('result');

    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing webcam:', err);
            resultDiv.innerHTML = '<p class="text-danger">Error accessing webcam. Please upload an image instead.</p>';
        });

    // Capture photo
    captureButton.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        
        fetch('/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'image=' + encodeURIComponent(imageData)
        })
        .then(response => response.text())
        .then(html => {
            document.open();
            document.write(html);
            document.close();
        })
        .catch(err => {
            console.error('Error:', err);
            resultDiv.innerHTML = '<p class="text-danger">Error classifying image.</p>';
        });
    });

    // Upload image
    uploadInput.addEventListener('change', () => {
        const file = uploadInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            
            fetch('/classify', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(html => {
                document.open();
                document.write(html);
                document.close();
            })
            .catch(err => {
                console.error('Error:', err);
                resultDiv.innerHTML = '<p class="text-danger">Error uploading image.</p>';
            });
        }
    });
});