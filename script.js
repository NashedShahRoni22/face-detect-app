let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const captureBtn = document.getElementById('capture-btn');
const userId = localStorage.getItem("user_id")
let model;
let faceCount = 0;

captureBtn.addEventListener('click', async () => {
  // Capture image from video stream
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert captured image to data URL
  const imageDataUrl = canvas.toDataURL('image/jpeg');

  const formData = new FormData();
  formData.append("image", imageDataUrl);
  formData.append("user_id", userId);

  // Post the image data to the API
  try {
      const response = await fetch('https://api.sosay.org/api/v1/user/registration/image', {
          method: 'POST',
        body: formData,
      });

      console.log(response);
      
      if (response.ok) {
          alert('Image captured successfully!');
          window.location.href = "https://sosay.org/register_step_two";
      } else {
          throw new Error('Failed to send image to the API');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to capture and send image to the API');
  }
});

// Access camera once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  accessCamera();
});



const accessCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: canvas.width, height: canvas.height },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.style.transform = "scaleX(-1)";
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  // Using canvas to draw the video first
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  var showNumber = document.querySelector(".show-number");
  showNumber.innerHTML = "faces detected: " + prediction["length"];
  if (prediction["length"] > 1 || prediction["length"] == 0) {
    face_distance = "Please give single face.";
    document.querySelector(".tips").style.color = "orange";
  } else {
    const rightEye = prediction[0].landmarks[0];
    const leftEye = prediction[0].landmarks[1];
    const nose = prediction[0].landmarks[2];
    const mouth = prediction[0].landmarks[3];
    const rightEar = prediction[0].landmarks[4];
    const leftEar = prediction[0].landmarks[5];

    const distence = prediction[0].bottomRight[0] - prediction[0].topLeft[0];
    const r = rightEye[0] - rightEar[0];
    const l = leftEar[0] - leftEye[0];
    if (distence < 150) {
      face_distance = "Come closer to camera.";

      document.querySelector(".tips").style.color = "orange";

      var showString = document.querySelector(".right_left");
      showString.innerHTML = "orientation_horizontal: " + "NaN";

      var showString = document.querySelector(".up_down");
      showString.innerHTML = "orientation_vertical: " + "NaN";

      var showString = document.querySelector("#horizontal");
      showString.innerHTML = "NaN";

      var showString = document.querySelector("#vertical");
      showString.innerHTML = "NaN";
    } else {
      face_distance = "Perfect";

      document.querySelector(".tips").style.color = "blue";
      if (r > 70) {
        face_orientation = "left";
      } else if (l > 60) {
        face_orientation = "right"; // Face is tilted to the left
      } else {
        face_orientation = "front"; // Face is facing front
      }
      const verticalMidpoint = (rightEye[1] + leftEye[1]) / 2 - nose[1];
      let face_orientation_vertical = "";
      if (verticalMidpoint > -13) {
        // Adjust this threshold according to your requirements
        face_orientation_vertical += "up";
      } else if (verticalMidpoint < -50) {
        // Adjust this threshold according to your requirements
        face_orientation_vertical += "down";
      } else {
        face_orientation_vertical = "middle";
      }

      var showString = document.querySelector(".right_left");
      showString.innerHTML = "orientation_horizontal: " + face_orientation;

      var showString = document.querySelector(".up_down");
      showString.innerHTML =
        "orientation_vertical: " + face_orientation_vertical;

      var showString = document.querySelector("#horizontal");
      showString.innerHTML = face_orientation;

      var showString = document.querySelector("#vertical");
      showString.innerHTML = face_orientation_vertical;
    }
  }

  var showString = document.querySelector(".face_distance");
  showString.innerHTML = "Tips : " + face_distance;
};

accessCamera();
video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  setInterval(detectFaces, 40);
});
