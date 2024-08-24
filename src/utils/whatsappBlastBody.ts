type WhatsappBlastBodyProps = {
   data: any;
   broadcastTemplate: any;
   image?: any;
   video?: any;
   clientCode?: any;
};

export const WhatsappBlastBody = ({ data, broadcastTemplate, image, video, clientCode }: WhatsappBlastBodyProps) => {
   switch (broadcastTemplate.template_type) {
      case 'no_header':
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
                           text: `invitation/${clientCode}/${data.id}`,
                        },
                     ],
                  },
               ],
            },
         };
         return body;
         break;

      case 'header_image':
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
                              //   link: `${process.env.NEXT_BASE_URL}${image.imagePath}`,
                              link: `https://images.unsplash.com/flagged/photo-1620830102229-9db5c00d4afc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
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
                           text: `invitation/${clientCode}/${data.id}`,
                        },
                     ],
                  },
               ],
            },
         };
         return bodyImage;
         break;

      case 'header_video':
         console.log('template_type', 'header_video');
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
