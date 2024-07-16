"use client";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => signIn()}>Login</button>
    </div>
  );
}
