const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const playButton = document.getElementById('play');
const downloadButton = document.getElementById('download');
const audio = document.getElementById('audio');
const durationDiv = document.getElementById('duration');
const durationSpan = document.getElementById('durationSpan');

let mediaRecorder;
let audioChunks = [];
let startTime;
let isRecording = false;

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
playButton.addEventListener('click', playRecording);
downloadButton.addEventListener('click', downloadRecording);

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstart = () => {
        startTime = new Date().getTime();
        isRecording = true;
        durationDiv.style.display = 'block';
        updateDuration();
    };

    mediaRecorder.onstop = () => {
        isRecording = false;
        durationDiv.style.display = 'none';
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audio.src = audioUrl;
        playButton.disabled = false;
        downloadButton.disabled = false;
    };

    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
    if (isRecording) {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
        durationDiv.style.display = 'none';
        audioChunks = [];
    }
}

function updateDuration() {
    if (isRecording) {
        const currentTime = new Date().getTime();
        const elapsedTime = new Date(currentTime - startTime);
        const minutes = elapsedTime.getUTCMinutes();
        const seconds = elapsedTime.getUTCSeconds();
        durationSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        setTimeout(updateDuration, 1000);
    }
}

function playRecording() {
    if (audio.src) {
        audio.play();
    }
}

function downloadRecording() {
    if (audio.src) {
        const a = document.createElement('a');
        a.href = audio.src;
        a.download = 'recorded_audio.wav';
        a.click();
    }
}
