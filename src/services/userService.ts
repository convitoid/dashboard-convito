import { jwtVerify } from "jose";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";
import {
  getErrorResponse,
  getSuccessReponse,
} from "@/utils/response/successResponse";

interface JWTError extends Error {
  code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "");

export async function fetchUsers(jwtToken: string) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);
    const clients = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return getSuccessReponse(clients, 200, "Users data fetched successfully");
  } catch (error) {
    const jwtError = error as JWTError;
    if (jwtError.code === "ERR_JWT_EXPIRED") {
      return getErrorResponse(error as string, 401);
    }
    return getErrorResponse("Failed to fetch clients", 500);
  }
}

export async function fetchUserById(jwtToken: string, id: number) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);
    const user = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      return getErrorResponse(
        "User not found" as string,
        404,
        "User not found"
      );
    }

    return getSuccessReponse(user, 200, "User data fetched successfully");
  } catch (error) {
    const jwtError = error as JWTError;
    if (jwtError.code === "ERR_JWT_EXPIRED") {
      return getErrorResponse(error as string, 401);
    }
    return getErrorResponse("Failed to fetch user", 500);
  }
}

export async function createUser(
  jwtToken: string,
  username: string,
  email: string,
  password: string,
  createdBy: string,
  updatedBy: string
) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(payload);

    const data = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: createdBy,
      updatedBy: updatedBy,
    };

    const result = await prisma.user.create({ data });
    return getSuccessReponse(result, 201, "User created successfully");
  } catch (error) {
    const jwtError = error as JWTError;
    if (jwtError.code === "ERR_JWT_EXPIRED") {
      return getErrorResponse(error as string, 401);
    }

    // get error message from error object
    const errorMessage = error as Error;
    // format to json
    const errorJson = JSON.parse(JSON.stringify(errorMessage));
    console.log(errorJson.meta.target[0]);
    if (errorJson.code === "P2002") {
      return getErrorResponse(
        ` ${errorJson.meta.target[0]} already exists`,
        400
      );
    }
    return getErrorResponse(errorJson, 500);
  }
}

export async function updateUser(
  jwtToken: string,
  id: number,
  username: string,
  email: string,
  password: string,
  createdBy: string,
  updatedBy: string
) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findFirst({
      where: { id: id },
    });

    const data = {
      username,
      email,
      password: hashedPassword,
      createdAt: user?.createdAt,
      updatedAt: new Date(),
      createdBy: createdBy,
      updatedBy: updatedBy,
    };

    if (!user) {
      return getErrorResponse(
        "User not found" as string,
        404,
        "User not found"
      );
    }

    const res = await prisma.user.update({
      where: { id: id },
      data,
    });

    return getSuccessReponse(res, 201, "User updated successfully");
  } catch (error) {
    const jwtError = error as JWTError;
    if (jwtError.code === "ERR_JWT_EXPIRED") {
      return getErrorResponse(error as string, 401);
    }
    return getErrorResponse(error as string, 500);
  }
}

export async function deleteUser(jwtToken: string, id: number) {
  try {
    const { payload } = await jwtVerify(jwtToken, secret);

    const user = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      return getErrorResponse(
        "User not found" as string,
        404,
        "User not found"
      );
    }

    const res = await prisma.user.delete({
      where: { id: id },
    });

    return getSuccessReponse(res, 201, "User deleted successfully");
  } catch (error) {
    const jwtError = error as JWTError;
    if (jwtError.code === "ERR_JWT_EXPIRED") {
      return getErrorResponse(error as string, 401);
    }
    return getErrorResponse(error as string, 500);
  }
}
