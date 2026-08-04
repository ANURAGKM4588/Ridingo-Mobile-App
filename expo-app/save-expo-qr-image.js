const QRCode = require('qrcode');
const path = require('path');

const expoUrl = 'exp://172.20.10.3:8081';
const outputPath = path.join(__dirname, 'expo_qr_code.png');

QRCode.toFile(outputPath, expoUrl, {
  color: {
    dark: '#121212',
    light: '#FFFFFF'
  },
  width: 400
}, function (err) {
  if (err) throw err;
  console.log('Saved Expo QR Code PNG image to:', outputPath);
});
