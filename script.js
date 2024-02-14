let video = document.getElementById("video");
let model;
let faceCount = 0;
// declare the canvas variable and setting up the context 

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const accessCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 500, height: 400 },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);
  
  
  // Using canvas to draw the video first

  ctx.drawImage(video, 0, 0, 500, 400);

  var showNumber = document.querySelector('.show-number');
  showNumber.innerHTML = 'Number: ' + prediction['length']
  prediction.forEach((predictions) => {
    

    const leftEye = predictions.landmarks[0];
    const rightEye = predictions.landmarks[1];
    const nose = predictions.landmarks[2];
    const mouth = predictions.landmarks[3];
    // console.log(predictions.landmarks);

    const slope  = (rightEye[1] - leftEye[1]) / (rightEye[0] - leftEye[0]);
    if (slope> 0.2){
      face_orientation="left";
    }else if (slope < 0.01) {
      face_orientation="right"; // Face is tilted to the left
    } else {
      face_orientation="front"; // Face is facing front
    }

    const verticalMidpoint = (nose[1] + mouth[1]) / 2;

    console.log(verticalMidpoint)
    // Determine up/down orientation
    let face_orientation_vertical =''
    if (verticalMidpoint < 150) { // Adjust this threshold according to your requirements
      face_orientation_vertical += " up";
    } else if (verticalMidpoint > 220) { // Adjust this threshold according to your requirements
      face_orientation_vertical += " down";
    }else{
      face_orientation_vertical = "middle"
    }

    
    var showString = document.querySelector('.right_left');
    showString.innerHTML = 'String: ' + face_orientation;

    var showString = document.querySelector('.up_down');
    showString.innerHTML = 'String: ' + face_orientation_vertical;
    // faceOrientationElement.innerHTML = prediction['length'],face_orintation;

    
    // Drawing rectangle that'll detect the face
    ctx.beginPath();
    
    ctx.lineWidth = "4";
    ctx.strokeStyle = "green";
    ctx.rect(
      predictions.topLeft[0],
      predictions.topLeft[1],
      predictions.bottomRight[0] - predictions.topLeft[0],
      predictions.bottomRight[1] - predictions.topLeft[1]
    );
    // The last two arguments denotes the width and height
    // but since the blazeface models only returns the coordinates  
    // so we have to subtract them in order to get the width and height
    ctx.stroke();
  });
};

accessCamera();
video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  // Calling the detectFaces every 40 millisecond
  setInterval(detectFaces, 40);
});