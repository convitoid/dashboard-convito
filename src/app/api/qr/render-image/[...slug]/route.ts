// app/api/uploads/[...slug]/route.ts (or use the `pages` folder based on your setup)
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
   if (params.slug[0] === 'qr-gallery') {
      const fullPath = path.join(process.cwd(), `public/uploads/clients/qr/images/${params.slug[1]}`);

      if (fs.existsSync(fullPath)) {
         const file = fs.readFileSync(fullPath);
         const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
         return new NextResponse(file, {
            headers: {
               'Content-Type': mimeType,
            },
         });
      } else {
         return NextResponse.error();
      }
   } else {
      const fullPath = path.join(process.cwd(), `public/uploads/clients/qr/file/${params.slug[0]}/${params.slug[1]}`);

      if (fs.existsSync(fullPath)) {
         const file = fs.readFileSync(fullPath);
         const mimeType = mime.lookup(fullPath) || 'application/octet-stream';
         return new NextResponse(file, {
            headers: {
               'Content-Type': mimeType,
            },
         });
      } else {
         return NextResponse.error();
      }
   }
}
