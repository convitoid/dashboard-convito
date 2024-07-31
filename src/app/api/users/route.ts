import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  updateUser,
} from "@/services/userService";
import { createValidation } from "@/utils/formValidation/user/createValidation";

export async function GET(req: NextRequest) {
const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];
  const response = await fetchUsers(jwtToken as string);
  return NextResponse.json(response, { status: response.status });
}

export async function POST(req: NextRequest) {
  const { username, email, password, createdBy, updatedBy } = await req.json();
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  // validation
  const validation = createValidation({ username, email, password });

  if (validation) {
    return NextResponse.json(validation, { status: 400 });
  }

  const response = await createUser(
    jwtToken as string,
    username,
    email,
    password,
    createdBy,
    updatedBy
  );
  return NextResponse.json(response, { status: response.status });
}

export async function PUT(req: NextRequest) {
  const { id, username, email, password, createdBy, updatedBy } =
    await req.json();
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  if (!id) {
    return NextResponse.json(
      {
        status: 400,
        message: "User ID is required",
      },
      { status: 400 }
    );
  }

  const validation = createValidation({ username, email, password });

  if (validation) {
    return NextResponse.json(validation, { status: 400 });
  }

  const response = await updateUser(
    jwtToken as string,
    id,
    username,
    email,
    password,
    createdBy,
    updatedBy
  );

  return NextResponse.json(response, { status: response.status });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const token = req.headers.get("authorization");
  const jwtToken = token?.split(" ")[1];

  if (!id) {
    return NextResponse.json(
      {
        status: 400,
        message: "User ID is required",
      },
      { status: 400 }
    );
  }

  const response = await deleteUser(jwtToken as string, id);

  return NextResponse.json(response, { status: response.status });
}
