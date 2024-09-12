import AdmZip from 'adm-zip';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
   const formData = await req.formData();
   const file = formData.get('file');
   const client_id = formData.get('client_id');

   if (file && (file as Blob).size === 0) {
      return NextResponse.json({ status: 400, error: 'Empty file found' }, { status: 400 });
   }

   if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ status: 400, error: 'No file found' }, { status: 400 });
   }

   const buffer = Buffer.from(await file.arrayBuffer());
   const zip = new AdmZip(buffer);
   const zipEntries = zip.getEntries();

   const targetDir = path.join(process.cwd(), 'public', 'uploads', 'clients', 'qr', 'file', client_id as string);

   try {
      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: client_id as string,
         },
      });

      // Check if the target directory exists
      if (fs.existsSync(targetDir)) {
         // If it exists, delete the directory and its contents
         fs.rmSync(targetDir, { recursive: true, force: true });

         // Remove the files from the database
         await prisma.qrFile.deleteMany({
            where: {
               clientId: client?.id,
            },
         });
      }

      // Create the target directory
      fs.mkdirSync(targetDir, { recursive: true });

      const extractedFiles = [];

      for (const entry of zipEntries) {
         // Skip _MACOSX folder and hidden files starting with .
         if (entry.entryName.includes('__MACOSX') || entry.entryName.startsWith('.')) {
            continue;
         }

         const entryPath = path.join(targetDir, entry.entryName);
         if (entry.isDirectory) {
            fs.mkdirSync(entryPath, { recursive: true });
         } else {
            fs.writeFileSync(entryPath, entry.getData());
            extractedFiles.push({
               name: entry.entryName,
               code: entry.entryName.split('.').slice(0, -1).join('.'),
               path: `uploads/clients/qr/file/${client_id}/${entry.entryName}`,
               originalPath: entryPath,
               clientId: client?.id,
            });
         }
      }

      // Save file metadata to the Prisma database
      const savedFiles = await prisma.qrFile.createMany({
         data: extractedFiles.map((file) => ({
            name: file.name,
            code: file.code,
            path: file.path,
            originalPath: file.originalPath,
            clientId: Number(file.clientId),
         })),
      });

      return NextResponse.json(
         { status: 201, message: 'Upload successful', files: extractedFiles, data: extractedFiles },
         { status: 201 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json({ status: 500, error: 'Failed to extract zip file' }, { status: 500 });
   }
}
