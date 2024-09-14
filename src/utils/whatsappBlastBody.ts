import prisma from '@/libs/prisma';
import jwt from 'jsonwebtoken';

type WhatsappBlastBodyProps = {
   data: any;
   broadcastTemplate: any;
   image?: any;
   video?: any;
   clientCode?: any;
   link?: any;
};

export const WhatsappBlastBody = async ({
   data,
   broadcastTemplate,
   image,
   video,
   clientCode,
   link,
}: WhatsappBlastBodyProps) => {
   const invitation = await prisma.invitations.findMany({
      select: {
         guestId: true,
         token: true,
      },
      where: {
         guestId: data.guest_id,
      },
   });

   const uniqueData = Object.values(
      invitation.reduce((acc: any, item) => {
         acc[item.guestId] = item;
         return acc;
      }, {})
   );

   const template = broadcastTemplate.map((b: any) => {
      const t = b.map((t: any) => {
         return t.BroadcastTemplate;
      });

      return {
         template_type: t[0].template_type,
         template_name: t[0].template_name,
      };
   });

   switch (template[0].template_type) {
      case 'no_header': {
         const token_no_header = uniqueData.filter((t: any) => t.guestId === data.id).map((t: any) => t.token);
         const body = {
            messaging_product: 'whatsapp',
            to: data.phone_number,
            type: 'template',
            template: {
               name: template[0].template_name,
               language: {
                  code: 'en',
               },
               components: [
                  {
                     type: 'body',
                     parameters: [
                        {
                           type: 'text',
                           text: data.name,
                        },
                     ],
                  },
                  {
                     type: 'button',
                     sub_type: 'url',
                     index: 0,
                     parameters: [
                        {
                           type: 'text',
                           text: `invitation/${token_no_header[0]}`,
                        },
                     ],
                  },
               ],
            },
         };
         return body;
      }

      case 'header_image': {
         const token_header_image = uniqueData.filter((t: any) => t.guestId === data.id).map((t: any) => t.token);

         const bodyImage = {
            messaging_product: 'whatsapp',
            to: data.phone_number,
            type: 'template',
            template: {
               name: template[0].template_name,
               language: {
                  code: 'en',
               },
               components: [
                  {
                     type: 'header',
                     parameters: [
                        {
                           type: 'image',
                           image: {
                              link: `${process.env.NEXTAUTH_URL}${image.imagePath}`,
                           },
                        },
                     ],
                  },
                  {
                     type: 'body',
                     parameters: [
                        {
                           type: 'text',
                           text: data.name,
                        },
                     ],
                  },
                  {
                     type: 'button',
                     sub_type: 'url',
                     index: 0,
                     parameters: [
                        {
                           type: 'text',
                           text: `invitation/${token_header_image[0]}`,
                        },
                     ],
                  },
               ],
            },
         };

         return bodyImage;
      }

      case 'header_video': {
         const token_header_image = uniqueData.filter((t: any) => t.guestId === data.id).map((t: any) => t.token);
         const url = video.video;
         const urlArray = url.split('/');
         const id = urlArray[5];

         const newUrl = `https://drive.google.com/uc?export=download&id=${id}`;

         const bodyVideo = {
            messaging_product: 'whatsapp',
            to: '6282310421496',
            type: 'template',
            template: {
               name: template[0].template_name,
               language: {
                  code: 'en',
               },
               components: [
                  {
                     type: 'header',
                     parameters: [
                        {
                           type: 'video',
                           video: {
                              link: newUrl,
                           },
                        },
                     ],
                  },
                  {
                     type: 'body',
                     parameters: [
                        {
                           type: 'text',
                           text: data.name,
                        },
                     ],
                  },
                  {
                     type: 'button',
                     sub_type: 'url',
                     index: 0,
                     parameters: [
                        {
                           type: 'text',
                           text: `invitation/${token_header_image[0]}`,
                        },
                     ],
                  },
               ],
            },
         };
         return bodyVideo;
      }

      default:
         break;
   }
};
