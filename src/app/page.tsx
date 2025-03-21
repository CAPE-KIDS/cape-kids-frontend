"use client";

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="w-full h-full  bg-blue-500 flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto bg-white rounded-4xl shadow-lg flex border-2 border-white">
        <div className="w-1/2 p-8">
          <Image
            src="/cape-kids-logo.svg"
            alt="Logo"
            width={280}
            height={61.46}
          />

          <h2 className="text-4xl font-normal mt-11 mb-11 max-w-[400px]">
            Exploring the world of cognitive capabilities
          </h2>

          <p className="text-gray-500 mb-4">Please login to your account.</p>

          <div className="group border border-gray-400 py-3 px-6 relative flex flex-col focus-within:border-l-[6px]  focus-within:border-blue-500 transition-all">
            <label htmlFor="email" className="mb-1 text-gray-500 font-light">
              Email Address
            </label>
            <input
              className="outline-none border-none w-full placeholder-gray-500 text-blue-700"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
            />
          </div>

          <div className="group border border-gray-400 py-3 px-6 relative flex flex-col focus-within:border-l-[6px] focus-within:border-blue-500 transition-all">
            <label htmlFor="password" className="mb-1 text-gray-500 font-light">
              Password
            </label>
            <input
              className="outline-none border-none w-full placeholder-gray-500 text-blue-700"
              placeholder="Your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
            />
          </div>

          <button
            className="transition-colors mt-8 bg-blue-500 text-white font-semibold px-10 py-4 shadow-2xs cursor-pointer hover:bg-blue-600 mb-10"
            onClick={() => login(email, password)}
          >
            Login
          </button>

          <p className="text-gray-500">
            Don’t have an account?{" "}
            <Link className="font-bold" href="/register">
              Register
            </Link>
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center bg-blue-500 rounded-br-4xl rounded-tr-4xl">
          <Image src="/family.svg" alt="Cape Kids" width={452} height={472} />
        </div>
      </div>
    </main>
  );
}

