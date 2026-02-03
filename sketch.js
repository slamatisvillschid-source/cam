// GANTI LINK INI dengan link model kamu dari Teachable Machine!
let modelURL = 'https://teachablemachine.withgoogle.com/models/vPXVc1vDm/';

let classifier;
let video;
let label = "Loading...";
let port; // Variabel untuk Serial Arduino

function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('canvas-container');
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Setup Serial Port
  port = createSerial();
  
  // Tombol untuk menghubungkan Serial
  let connectBtn = select('#btn-konek');
  connectBtn.mousePressed(connectToArduino);
}

function draw() {
  image(video, 0, 0);
  
  // Tampilkan label hasil deteksi
  fill(0, 255, 0);
  textSize(32);
  textAlign(CENTER);
  text(label, width / 2, height - 20);

  // Proses Klasifikasi
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function connectToArduino() {
  if (!port.opened()) {
    port.open(9600);
  } else {
    port.close();
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  
  label = results[0].label;
  let confidence = results[0].confidence;

  // LOGIKA KIRIM DATA KE ARDUINO
  // Pastikan label "Ada Objek" sama persis dengan di Teachable Machine
  if (port.opened() && confidence > 0.8) {
    if (label === "Ada Objek") {
      port.write('1'); // Mengirim karakter '1' ke Arduino
    } else {
      port.write('0'); // Mengirim karakter '0' ke Arduino
    }
  }
}
