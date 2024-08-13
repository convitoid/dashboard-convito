'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
   return (
      <div>
         <h1>Home Page</h1>
         <button onClick={() => signIn()}>Login</button>
      </div>
   );
}
