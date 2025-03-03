const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capture = document.getElementById('capture');
const upload = document.getElementById('upload');
const submit = document.getElementById('submit');
const result = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream);

let imageData = null;
capture.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    imageData = canvas.toDataURL('image/jpeg');
});

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => imageData = reader.result;
    reader.readAsDataURL(file);
});

submit.addEventListener('click', async () => {
    if (!imageData) return alert('Please capture or upload an image');
    const issue = document.getElementById('issue').value;
    const position = await new Promise(resolve => navigator.geolocation.getCurrentPosition(resolve));
    const location = `${position.coords.latitude},${position.coords.longitude}`;
    const response = await fetch('/report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: `location=${location}&image=${encodeURIComponent(imageData)}&issue=${issue}`
    });
    const data = await response.json();
    result.innerHTML = `<p>${data.message}</p>`;
});