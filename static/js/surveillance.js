const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capture = document.getElementById('capture');
const upload = document.getElementById('upload');
const result = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream);

capture.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    sendImage(canvas.toDataURL('image/jpeg'));
});

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => sendImage(reader.result);
    reader.readAsDataURL(file);
});

async function sendImage(imageData) {
    const response = await fetch('/surveillance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: `image=${encodeURIComponent(imageData)}`
    });
    const data = await response.json();
    result.innerHTML = `<p>Waste ${data.waste_detected ? 'detected' : 'not detected'}</p>`;
}