import settings from '../config/settings.js';

const uploadFile = async (fileData) => {
  const url = "https://datasense-faceapi.cognitiveservices.azure.com/face/v1.0/detect";
  const queryString = 
    "returnFaceId=true" + 
    "&returnFaceLandmarks=false" +
    "&returnFaceAttributes=age,gender,glasses,emotion,hair,makeup,accessories"

  const headers = {
    "Ocp-Apim-Subscription-Key": settings.azure.faceApiKey,
    "Content-Type": "application/octet-stream"
  };

  return await fetch(`${url}?${queryString}`, {
    method: 'POST',
    headers,
    body: fileData
  }).then(res => res.json());
};


const drawImage = async (imgData) => {
  const img = document.getElementById('displayImage');
  const elementWidth = parseInt(img.width);

  const promise = new Promise((resolve, _) => {
    img.onload = () => {
      resolve(elementWidth / img.naturalWidth);
    }
  });

  img.src = URL.createObjectURL(imgData);
  return promise;
};

const createBoundingBox = (scale, face) => {
  const {faceRectangle, faceAttributes} = face;
  const div = document.createElement('div');
  div.style.position = 'absolute';
  for(let key of Object.keys(faceRectangle)){
    div.style[key] = (faceRectangle[key] * scale) + 'px';
  }
  div.style.border = '2px solid cyan';
  div.setAttribute('data-json', JSON.stringify(faceAttributes, null, 2));
  div.onclick = function(){
    document.getElementById('jsonValue').value = this.getAttribute('data-json');
  };
  return div;
};


const detectFacialFeatures = async () => {
  const file = document.getElementById('file');
  const imgData = file.files[0];
  const json = await uploadFile(imgData);
  const scale = await drawImage(imgData);
  const canvas = document.getElementById('canvas');
  canvas.querySelectorAll('div').forEach(x => canvas.removeChild(x));  
  json.map(x => createBoundingBox(scale, x)).forEach(x => canvas.appendChild(x));
};

const bindForm = () => {
  document.getElementById('inputForm').onsubmit = () => {
    detectFacialFeatures();
    return false;
  };
};

bindForm();