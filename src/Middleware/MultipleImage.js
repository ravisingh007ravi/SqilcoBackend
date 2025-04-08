const { uploadToCloudinary } = require('../Image/ImageURL');

exports.MultipleImage = async (req) => { 
    try {
        if (!req.files || req.files.length === 0) { throw new Error('No images provided')}
        
        let imageUrls = [];

        for (const file of req.files) { 
            const imageUrl = await uploadToCloudinary(file.buffer);
            imageUrls.push(imageUrl);
        }

        return imageUrls;

    } catch (e) { throw new Error(e.message || 'Failed to upload images');  }
};
