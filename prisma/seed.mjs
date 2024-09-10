import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
   const users = {
      data: [
         {
            username: 'hadi',
            password: await bcrypt.hash('password', 10),
            email: 'hadi@mail.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'admin',
            updatedBy: 'admin',
         },
      ],
   };

   for (const user of users.data) {
      const { username, password, email, createdAt, updatedAt, createdBy, updatedBy } = user;
      await prisma.user.create({
         data: {
            username,
            password,
            email,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy,
         },
      });
   }
}

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
