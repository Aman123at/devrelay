import {v2 as cloudinaryV2} from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
export class CloudinaryService {
    initConfig(){
        cloudinaryV2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    presignedUploadUrl(){
        const uniqueId = uuidv4();
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinaryV2.utils.api_sign_request(
            { timestamp, public_id: uniqueId },
            process.env.CLOUDINARY_API_SECRET
        );
        const presignedUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload?public_id=${uniqueId}&timestamp=${timestamp}&signature=${signature}&api_key=${process.env.CLOUDINARY_API_KEY}`;
        return presignedUrl;
    }
}