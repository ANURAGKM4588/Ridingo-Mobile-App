const QRCode = require('qrcode');

const expoUrl = 'exp://172.20.10.3:8081';

console.log('\n======================================================');
console.log('📱 SCAN THIS QR CODE WITH YOUR EXPO GO APP ON MOBILE 📱');
console.log('======================================================\n');

QRCode.toString(expoUrl, { type: 'terminal', small: true }, function (err, url) {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
  console.log(url);
  console.log('======================================================');
  console.log('Or enter Expo URL manually in Expo Go app:');
  console.log('👉  exp://172.20.10.3:8081');
  console.log('======================================================\n');
});
