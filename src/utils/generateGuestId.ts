export default function generateGuestId(name: string, clientId: string) {
   const namePart = name.slice(0, 2).toUpperCase();
   const clientPart = clientId.toString();
   const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
   return `${namePart}${randomPart}${clientPart}`;
}
