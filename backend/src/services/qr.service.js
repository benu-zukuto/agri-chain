const QRCode = require('qrcode');
const path = require('path');
const ApiError = require('../utils/apiError');

exports.generateQRCode = async (batchId) => {
    try {
        // Point the QR code to the FRONTEND customer page (port 5173)
        // It will pass the batchId so the frontend can open it directly
        const frontendUrl = `http://${process.env.HOST_IP}:5173/customer?batchId=${batchId}`;
        const filePath = path.join(__dirname, '../../qr', `${batchId}.png`);
        
        await QRCode.toFile(filePath, frontendUrl);
        
        return {
            url: frontendUrl,
            filePath: `/qr/${batchId}.png` 
        };
    } catch (err) {
        throw new ApiError(500, 'Failed to generate QR Code');
    }
};
