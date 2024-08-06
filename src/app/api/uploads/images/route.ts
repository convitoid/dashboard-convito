import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { promises as fs } from "fs";
import {
  createDataImage,
  deleteDataImage,
  getDataImages,
  getDataImagesByClientId,
  updateDataImage,
} from "@/services/uploads/images/uploadClientImageService";
import prisma from "@/libs/prisma";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  try {
    const response = await getDataImages(jwtToken as string);
    console.log("response", response);
    if (response.status === 401) {
      return NextResponse.json(
        { mesage: "unauthorized" },
        { status: response.status }
      );
    }

    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    console.log(error);
    const errorMessage = error as Error;
    return NextResponse.json({ error: errorMessage.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("client_image");
  const clientCode = formData.get("client_code");
  const clientId = formData.get("client_id");

  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  if (file && (file as Blob).size === 0) {
    return NextResponse.json(
      { status: 400, error: "Empty file found" },
      { status: 400 }
    );
  }

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { status: 400, error: "No file found" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const unixTimestamp = Date.now();
  const uniqueIdentifier = Math.random().toString(36).substring(2, 15);
  const customFileName = `${unixTimestamp}-${clientCode}-${uniqueIdentifier}-${file.name}`;
  const filePath = join(
    process.cwd(),
    "public/uploads/clients/images",
    customFileName
  );

  try {
    const response = await createDataImage(jwtToken as string, {
      clientId,
      imageName: customFileName,
      imagePath: "/uploads/clients/images/" + customFileName,
      imageOriginalPath: filePath,
    });

    console.log("response", response);

    if (response.status === 401) {
      return NextResponse.json(
        { mesage: "unauthorized" },
        { status: response.status }
      );
    }

    await fs.mkdir(join(process.cwd(), "public/uploads/clients/images"), {
      recursive: true,
    });
    await fs.writeFile(filePath, new Uint8Array(buffer));

    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    console.log("error file upload", error);
    const errorMessage = error as Error;
    return NextResponse.json({ error: errorMessage.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("client_image");
  const clientCode = formData.get("client_code");
  const clientId = formData.get("client_id");

  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  try {
    const findImage = await getDataImagesByClientId(
      jwtToken as string,
      clientId as string
    );

    if (findImage.status === 401) {
      return NextResponse.json(
        { mesage: "unauthorized" },
        { status: findImage.status }
      );
    }

    if (file && (file as Blob).size === 0) {
      return NextResponse.json({ error: "Empty file found" }, { status: 400 });
    }

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { status: 400, error: "No file found" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const unixTimestamp = Date.now();
    const uniqueIdentifier = Math.random().toString(36).substring(2, 15);
    const customFileName = `${unixTimestamp}-${clientCode}-${uniqueIdentifier}-${file.name}`;
    const newFilePath = join(
      process.cwd(),
      "public/uploads/clients/images",
      customFileName
    );

    if ("data" in findImage) {
      const dataImage = findImage.data?.imageName;
      // find image on the server
      const filePath = join(
        process.cwd(),
        "public/uploads/clients/images",
        dataImage as string
      );

      // update database
      const response = await updateDataImage(jwtToken as string, {
        id: findImage.data?.id,
        clientId,
        imageName: customFileName,
        imagePath: "/uploads/clients/images/" + customFileName,
        imageOriginalPath: newFilePath,
      });

      if ("data" in response) {
        await fs.unlink(filePath);
        await fs.mkdir(join(process.cwd(), "public/uploads/clients/images"), {
          recursive: true,
        });
        await fs.writeFile(
          response.data.imageOriginalPath,
          new Uint8Array(buffer)
        );
        return NextResponse.json(response, { status: 200 });
      }
    }
  } catch (error) {
    const errorMessage = error as Error;
    return NextResponse.json({ error: errorMessage.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { clientId } = await req.json();

  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  try {
    const images = await getDataImagesByClientId(jwtToken as string, clientId);

    if (images.status === 401) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: images.status }
      );
    }

    if (images.status === 404) {
      return NextResponse.json(
        { message: "No images found" },
        { status: images.status }
      );
    }

    if ("data" in images) {
      const imageOriginalPath = images.data?.imageOriginalPath;
      const deleteImage = await deleteDataImage(jwtToken as string, {
        id: images.data?.id,
        clientId: images.data?.clientId,
      });

      if ("data" in deleteImage) {
        await fs.unlink(imageOriginalPath);
        return NextResponse.json(deleteImage, { status: deleteImage.status });
      }
    }
  } catch (error) {
    const errorMessage = error as Error;
    return NextResponse.json({ error: errorMessage.message }, { status: 500 });
  }
}
