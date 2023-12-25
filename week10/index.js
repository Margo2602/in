import * as handpose from 'https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.1.0/dist/handpose.min.js';
const handpose = require('@tensorflow-models/handpose');

require('@tensorflow/tfjs-backend-webgl');

async function setupCamera() {
    const video = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({ 'video': true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadHandpose() {
    const model = await handpose.load();
    console.log("Model loaded successfully");
    return model;
}

async function calculateFingerAngles(landmarks) {
    console.log("Function called");
    // Визначення довжини пальців та обчислення кутів
    const fingerLengths = {
        thumb: distance(landmarks[0], landmarks[1]),
        indexFinger: distance(landmarks[5], landmarks[9]),
        middleFinger: distance(landmarks[9], landmarks[13]),
        ringFinger: distance(landmarks[13], landmarks[17]),
        pinky: distance(landmarks[17], landmarks[21])
    };

    const angles = {
        thumbIndex: calculateAngle(landmarks[1], landmarks[0], landmarks[5]),
        indexMiddle: calculateAngle(landmarks[9], landmarks[5], landmarks[13]),
        middleRing: calculateAngle(landmarks[13], landmarks[9], landmarks[17]),
        ringPinky: calculateAngle(landmarks[17], landmarks[13], landmarks[21])
    };

    // Виведення результатів на екран
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>Thumb-Index Angle: ${angles.thumbIndex.toFixed(2)} degrees</p>
        <p>Index-Middle Angle: ${angles.indexMiddle.toFixed(2)} degrees</p>
        <p>Middle-Ring Angle: ${angles.middleRing.toFixed(2)} degrees</p>
        <p>Ring-Pinky Angle: ${angles.ringPinky.toFixed(2)} degrees</p>
    `;
}

function distance(point1, point2) {
    return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

function calculateAngle(pointA, pointB, pointC) {
    const vectorAB = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
    const vectorBC = [pointC[0] - pointB[0], pointC[1] - pointB[1]];

    const dotProduct = vectorAB[0] * vectorBC[0] + vectorAB[1] * vectorBC[1];
    const magnitudeAB = Math.sqrt(vectorAB[0] ** 2 + vectorAB[1] ** 2);
    const magnitudeBC = Math.sqrt(vectorBC[0] ** 2 + vectorBC[1] ** 2);

    const cosineTheta = dotProduct / (magnitudeAB * magnitudeBC);
    const angleInRadians = Math.acos(cosineTheta);

    // Перевести радіани в градуси
    const angleInDegrees = (angleInRadians * 180) / Math.PI;

    return angleInDegrees;
}

async function detectHands(net, video) {
    const hands = await net.estimateHands(video);
    return hands;
}

async function runHandpose() {
    const video = await setupCamera();
    const net = await loadHandpose();

    async function detect() {
        const hands = await detectHands(net, video);

        if (hands.length > 0) {
            calculateFingerAngles(hands[0].landmarks);
        }

        requestAnimationFrame(detect);
    }

    detect();
}

runHandpose();
