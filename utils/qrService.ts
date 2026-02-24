const QRCode = require('qrcode');

const generateQR = async (registrationId, registrationNumber) => {
  try {
    const qrData = JSON.stringify({
      id: registrationId,
      regNum: registrationNumber,
      timestamp: new Date().toISOString()
    });
    
    // Gunakan toDataURL, bukan toFile
    const qrCodeBase64 = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });
    
    return qrCodeBase64; // Langsung return string base64 gambarnya
  } catch (error) {
    console.error(`Error generating QR: ${error.message}`);
    throw new Error('Gagal membuat QR code');
  }
};