const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.APIKey,
    api_secret: process.env.APISecret
});

exports.uploadToCloudinary = async (fileBuffer) => {
    try {

        const optimizedBuffer = await sharp(fileBuffer)
            .resize(1080, 720, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, mozjpeg: true })
            .toBuffer();

        
        const uploadResult = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`,
            { resource_type: 'auto', quality: 'auto' }
        );

        return uploadResult.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};
