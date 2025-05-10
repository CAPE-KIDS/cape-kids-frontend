"use client";

import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useState } from "react";
import { loginSchema, type LoginSchemaType } from "@shared/user";
import { z } from "zod";

export default function Home() {
  const { login } = useAuth();
  const [form, setForm] = useState<LoginSchemaType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginSchemaType, string>>
  >({});
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginSchemaType, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginSchemaType;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    login(form.email, form.password);
  };

  return (
    <main className="w-full h-full bg-blue-500 flex items-center justify-center">
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

          <div className="group border border-gray-400 py-3 px-6 relative flex flex-col focus-within:border-l-[6px] focus-within:border-blue-500 transition-all">
            <label htmlFor="email" className="mb-1 text-gray-500 font-light">
              Email Address
            </label>
            <input
              id="email"
              className="outline-none border-none w-full placeholder-gray-500 text-blue-700"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {errors.email && (
              <span className="text-sm text-red-500 absolute right-2">
                {errors.email.replace("String", "Email")}
              </span>
            )}
          </div>

          <div className="group border border-gray-400 py-3 px-6 relative flex flex-col focus-within:border-l-[6px] focus-within:border-blue-500 transition-all">
            <label htmlFor="password" className="mb-1 text-gray-500 font-light">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="outline-none border-none w-full placeholder-gray-500 text-blue-700"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            {errors.password && (
              <span className="text-sm text-red-500 absolute right-2">
                {errors.password.replace("String", "Password")}
              </span>
            )}
          </div>

          <button
            className="transition-colors mt-8 bg-blue-500 text-white font-semibold px-10 py-4 shadow-2xs cursor-pointer hover:bg-blue-600 mb-10"
            onClick={handleLogin}
          >
            Login
          </button>

          <p className="text-gray-500">
            Don’t have an account?{" "}
            <button
              className="font-bold cursor-pointer"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center bg-blue-500 rounded-br-4xl rounded-tr-4xl relative">
          <Image src="/family.svg" alt="Cape Kids" width={452} height={472} />

          <div
            className={`absolute rounded-tr-4xl rounded-br-4xl top-0 left-0 w-full h-full bg-white flex items-center justify-center opacity-0 ml-[1px] ${
              showRegister ? "opacity-100" : ""
            } transition-opacity duration-300`}
          >
            <RegisterForm close={() => setShowRegister(false)} />
          </div>
        </div>
      </div>
    </main>
  );
}

