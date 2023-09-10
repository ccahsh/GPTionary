document.addEventListener('DOMContentLoaded', () => {
  // const recordButton = document.getElementById('recordButton');
  // const stopButton = document.getElementById('stopButton');
  const voiceInput = document.getElementById('voice-input-button');
  const transcriptionResult = document.getElementById('transcriptionResult');
  let mediaRecorder;
  let audioChunks = [];

  // Check if the browser supports getUserMedia
  if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };

      // Start recording when the "Start Recording" button is clicked
      // recordButton.addEventListener('click', () => {
      voiceInput.addEventListener('click', () => { 
          navigator.mediaDevices.getUserMedia(constraints)
              .then(function (stream) {
                  mediaRecorder = new MediaRecorder(stream);

                  mediaRecorder.ondataavailable = event => {
                      if (event.data.size > 0) {
                          audioChunks.push(event.data);
                      }
                  };

                  mediaRecorder.onstop = () => {
                      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                      const formData = new FormData();
                      formData.append('audio', audioBlob, 'recording.wav');

                      // Send the audio data to the transcription service
                      fetch('https://gptionary-answer.vercel.app/transcribe', {
                          method: 'POST',
                          body: formData
                      })
                      .then(response => response.json())
                      .then(data => {
                          transcriptionResult.innerHTML = `Transcription: ${data.transcription}`;
                      })
                      .catch(error => {
                          transcriptionResult.innerHTML = `Transcription: failed`;
                          console.error('Error transcribing audio:', error);
                      });
                  };

                  mediaRecorder.start();
                  // recordButton.disabled = true;
                  // stopButton.disabled = false;
                  voiceInputButton.disabled = true;
              })
              .catch(function (error) {
                  console.error('Error accessing microphone:', error);
              });
      });

      // Stop recording when the "Stop Recording" button is clicked
      // stopButton.addEventListener('click', () => {
      //     mediaRecorder.stop();
      //     // recordButton.disabled = false;
      //     // stopButton.disabled = true;
      //     // voiceInputButton.disabled = false;
      // });
  } else {
      console.error('getUserMedia is not supported in this browser');
  }
});