import prisma from '@/libs/prisma';

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

   switch (broadcastTemplate.template_type) {
      case 'no_header':
         const token_no_header = uniqueData.filter((t: any) => t.guestId === data.id).map((t: any) => t.token);
         const body = {
            messaging_product: 'whatsapp',
            to: data.phone_number,
            type: 'template',
            template: {
               name: broadcastTemplate.template_name,
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
         break;

      case 'header_image':
         const token_header_image = uniqueData.filter((t: any) => t.guestId === data.id).map((t: any) => t.token);
         const bodyImage = {
            messaging_product: 'whatsapp',
            to: data.phone_number,
            type: 'template',
            template: {
               name: broadcastTemplate.template_name,
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
                              // link: `https://images.unsplash.com/flagged/photo-1620830102229-9db5c00d4afc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
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
         break;

      case 'header_video':
         const bodyVideo = {
            messaging_product: 'whatsapp',
            to: data.phone_number,
            type: 'template',
            template: {
               name: 'template_video',
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
                              link: `${process.env.NEXT_BASE_URL}${video?.video}`,
                           },
                        },
                     ],
                  },
               ],
            },
         };
         break;

      default:
         break;
   }
};
