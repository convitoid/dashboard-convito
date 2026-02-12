import logger from '@/libs/logger';
import FormData from 'form-data';
import axios from 'axios';

/**
 * Upload media to WhatsApp and get media_id
 * @param imageUrl - Full URL of the image to upload
 * @returns media_id from WhatsApp
 */
export async function uploadMediaToWhatsApp(imageUrl: string): Promise<string> {
  try {
    logger.info('Uploading media to WhatsApp', { imageUrl });

    // Step 1: Download image from URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    });

    const imageBuffer = Buffer.from(imageResponse.data);
    const contentType = imageResponse.headers['content-type'] || 'image/jpeg';

    logger.info('Image downloaded successfully', {
      size: imageBuffer.length,
      contentType,
    });

    // Step 2: Upload to WhatsApp
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', imageBuffer, {
      filename: 'image.jpg',
      contentType: contentType,
    });

    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/media`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.NEXT_WHATSAPP_TOKEN_ID}`,
        },
        timeout: 60000, // 60 second timeout for upload
      }
    );

    const mediaId = uploadResponse.data.id;

    logger.info('Media uploaded to WhatsApp successfully', {
      mediaId,
      imageUrl,
    });

    return mediaId;
  } catch (error: any) {
    logger.error('Failed to upload media to WhatsApp', {
      error: error.message,
      imageUrl,
      response: error.response?.data,
    });
    throw new Error(`Failed to upload media: ${error.message}`);
  }
}
