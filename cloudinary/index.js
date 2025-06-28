require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_KEY)
cloudinary.config({
    cloud_name:"dcxs21ahv",
    api_key: "489499583861194",
    api_secret: "3138XaNTSkaHkhAwDT0UhYTTsVU"
});
// CLOUDINARY_CLOUD_NAME=Root
// CLOUDINARY_KEY=489499583861194
// CLOUDINARY_SECRET=3138XaNTSkaHkhAwDT0UhYTTsVU

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}