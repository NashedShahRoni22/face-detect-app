// let video = document.getElementById("video");
// let model;
// let faceCount = 0;
// // declare the canvas variable and setting up the context

// let canvas = document.getElementById("canvas");
// let ctx = canvas.getContext("2d");

// const accessCamera = () => {
//   navigator.mediaDevices
//     .getUserMedia({
//       video: { width: 500, height: 400 },
//       audio: false,
//     })
//     .then((stream) => {
//       video.srcObject = stream;
//       video.style.transform = "scaleX(-1)";
//     });
// };

// const detectFaces = async () => {
//   const prediction = await model.estimateFaces(video, false);

//   // Using canvas to draw the video first

//   // ctx.translate(canvas.width, 0);
//   // ctx.scale(-1, 1);
//   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//   // ctx.restore();

//   var showNumber = document.querySelector(".show-number");
//   showNumber.innerHTML = "Number: " + prediction["length"];
//   if (prediction["length"] > 1 || prediction["length"] == 0) {
//     face_distance = "please give single face ";
//   } else {
//     prediction.forEach((predictions) => {
//       const rightEye = predictions.landmarks[0];
//       const leftEye = predictions.landmarks[1];
//       const nose = predictions.landmarks[2];
//       const mouth = predictions.landmarks[3];
//       const rightEar = predictions.landmarks[4];
//       const leftEar = predictions.landmarks[5];

//       // console.log(predictions);

//       console.log(predictions.bottomRight[0] - predictions.topLeft[0]);
//       const distence= predictions.bottomRight[0] - predictions.topLeft[0]
//       const r = rightEye[0] - rightEar[0];
//       const l = leftEar[0] - leftEye[0];

//       if (distence < 200 ) {
//         face_distance = "come closer to camera";
//       } else {
//         face_distance = "perfect";
//       }
//       // Face is facing front

//       if (r > 70) {
//         face_orientation = "left";
//       } else if (l > 60) {
//         face_orientation = "right"; // Face is tilted to the left
//       } else {
//         face_orientation = "front"; // Face is facing front
//       }
//       // console.log(slope)
//       const verticalMidpoint = (nose[1] + mouth[1]) / 2;

//       // Determine up/down orientation
//       let face_orientation_vertical = "";
//       if (verticalMidpoint < 180) {
//         // Adjust this threshold according to your requirements
//         face_orientation_vertical += " up";
//       } else if (verticalMidpoint > 220) {
//         // Adjust this threshold according to your requirements
//         face_orientation_vertical += " down";
//       } else {
//         face_orientation_vertical = "middle";
//       }

//       var showString = document.querySelector(".right_left");
//       showString.innerHTML = "orientation_horizontal: " + face_orientation;

//       var showString = document.querySelector(".up_down");
//       showString.innerHTML =
//         "orientation_vertical: " + face_orientation_vertical;

//       // Drawing rectangle that'll detect the face
//       ctx.beginPath();

//       ctx.lineWidth = "4";
//       ctx.strokeStyle = "green";
//       ctx.rect(
//         predictions.topLeft[0],
//         predictions.topLeft[1],
//         predictions.bottomRight[0] - predictions.topLeft[0],
//         predictions.bottomRight[1] - predictions.topLeft[1]
//       );
//       // The last two arguments denotes the width and height
//       // but since the blazeface models only returns the coordinates
//       // so we have to subtract them in order to get the width and height
//       ctx.stroke();
//       ctx.fillStyle = "red";
//       predictions.landmarks.forEach((landmark) => {
//         ctx.fillRect(landmark[0], landmark[1], 2, 9);
//       });
//     });
//   }

//   var showString = document.querySelector(".face_distance");
//   showString.innerHTML = "distance : " + face_distance;
// };

// accessCamera();
// video.addEventListener("loadeddata", async () => {
//   model = await blazeface.load();
//   // Calling the detectFaces every 40 millisecond
//   setInterval(detectFaces, 40);
// });

// // Example usage:

////// ###################################

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
      video.style.transform = "scaleX(-1)";
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  // Using canvas to draw the video first

  // ctx.translate(canvas.width, 0);
  // ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // ctx.restore();

  var showNumber = document.querySelector(".show-number");
  showNumber.innerHTML = "Number: " + prediction["length"];
  if (prediction["length"] > 1 || prediction["length"] == 0) {
    face_distance = "please give single face ";
  } else {
    // console.log(prediction[0])
    const rightEye = prediction[0].landmarks[0];
    const leftEye = prediction[0].landmarks[1];
    const nose = prediction[0].landmarks[2];
    const mouth = prediction[0].landmarks[3];
    const rightEar = prediction[0].landmarks[4];
    const leftEar = prediction[0].landmarks[5];

    const distence = prediction[0].bottomRight[0] - prediction[0].topLeft[0];

    console.log(distence);

    const r = rightEye[0] - rightEar[0];
    const l = leftEar[0] - leftEye[0];
    if (distence < 150) {
      face_distance = "come closer to camera";

      document.querySelector(".main").style.backgroundColor = "red";

      var showString = document.querySelector(".right_left");
      showString.innerHTML = "orientation_horizontal: " + "NaN";

      var showString = document.querySelector(".up_down");
      showString.innerHTML = "orientation_vertical: " + "NaN";
    } else {
      face_distance = "perfect";

      document.querySelector(".main").style.backgroundColor = "green";
      if (r > 70) {
        face_orientation = "left";
      } else if (l > 60) {
        face_orientation = "right"; // Face is tilted to the left
      } else {
        face_orientation = "front"; // Face is facing front
      }

      // console.log(((rightEye[1]  + leftEye[1])/2)-nose[1]);
      // const verticalMidpoint = (nose[1] + mouth[1]) / 2;
      const verticalMidpoint = (rightEye[1] + leftEye[1]) / 2 - nose[1];

      // console.log(((rightEye[1]  + leftEye[1])/2)-nose[1]);

      // Determine up/down orientation
      let face_orientation_vertical = "";
      if (verticalMidpoint > -13) {
        // Adjust this threshold according to your requirements
        face_orientation_vertical += " up";
      } else if (verticalMidpoint < -50) {
        // Adjust this threshold according to your requirements
        face_orientation_vertical += " down";
      } else {
        face_orientation_vertical = "middle";
      }

      var showString = document.querySelector(".right_left");
      showString.innerHTML = "orientation_horizontal: " + face_orientation;

      var showString = document.querySelector(".up_down");
      showString.innerHTML =
        "orientation_vertical: " + face_orientation_vertical;

      ctx.beginPath();
    // Drawing rectangle that'll detect the face
      ctx.lineWidth = "4";
      ctx.strokeStyle = "green";
      ctx.rect(
        prediction[0].topLeft[0],
        prediction[0].topLeft[1],
        prediction[0].bottomRight[0] - prediction[0].topLeft[0],
        prediction[0].bottomRight[1] - prediction[0].topLeft[1]
      );

      ctx.stroke();
      ctx.fillStyle = "red";
      prediction[0].landmarks.forEach((landmark) => {
        ctx.fillRect(landmark[0], landmark[1], 2, 9);
      });
    }


  }

  var showString = document.querySelector(".face_distance");
  showString.innerHTML = "distance : " + face_distance;
};

accessCamera();
video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  // Calling the detectFaces every 40 millisecond
  setInterval(detectFaces, 40);
});
