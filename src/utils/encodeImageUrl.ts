/**
 * Encodes image path for WhatsApp API
 * WhatsApp requires properly encoded URLs to download media
 * Special characters like [], spaces need to be URL encoded
 */
export const encodeImageUrl = (baseUrl: string, imagePath: string): string => {
   // Remove leading slash from imagePath if baseUrl ends with slash
   const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
   const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
   
   // Split path into segments and encode each segment (except the slashes)
   const encodedPath = cleanPath
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
   
   return `${cleanBaseUrl}/${encodedPath}`;
};
