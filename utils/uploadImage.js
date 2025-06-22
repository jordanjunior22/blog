const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary configuration from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and removes it afterward.
 * @param {string} localFilePath - Path to the file saved by multer.
 * @param {string} folder - Cloudinary folder (default: 'blog_uploads')
 * @returns {Promise<{ url: string, public_id: string }>}
 */
async function uploadImage(localFilePath, folder = 'blog_uploads') {
  if (!localFilePath) throw new Error('No file path provided');

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      use_filename: true,
      unique_filename: false,
      resource_type: 'image',
    });

    // Delete local file after successful upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.warn('Failed to delete local file:', err.message);
    });

    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

module.exports = uploadImage;
