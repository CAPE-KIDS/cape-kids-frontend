"use client";

import RegisterForm from "@/components/forms/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { loginSchema, type LoginSchemaType } from "@shared/user";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation("common");
  const { login } = useAuth();
  const [form, setForm] = useState<LoginSchemaType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginSchemaType, string>>
  >({});
  const [showRegister, setShowRegister] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [awaiting, setAwaiting] = useState(false);

  const handleLogin = async () => {
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
    setAwaiting(true);
    const response = await login(form.email, form.password);
    if (response?.error) {
      toast.error(response.message);
      setLoginError(response.message);
      setAwaiting(false);

      return;
    }
    toast.success(t("login_success"));
  };

  useEffect(() => {
    return () => {
      setForm({ email: "", password: "" });
      setErrors({});
      setLoginError("");
      setAwaiting(false);
      setShowRegister(false);
    };
  }, []);

  return (
    <main className="w-full h-full px-4 bg-blue-500 flex items-center justify-center">
      <div>
        <div className="absolute top-4 right-4">
          <select
            className="bg-white text-blue-500 font-semibold px-2 py-2 rounded-lg text-xs"
            value={i18n.language}
            onChange={(e) => {
              const newLang = e.target.value;
              i18n.changeLanguage(newLang);
              localStorage.setItem("lang", newLang);
            }}
          >
            <option value="en">EN</option>
            <option value="pt">PT</option>
          </select>
        </div>
      </div>
      <div className="max-w-7xl w-full  mx-auto bg-white rounded-4xl shadow-lg flex border-2 border-white relative">
        <div className="w-full md:w-1/2 p-8">
          <Image
            src="/cape-kids-logo.svg"
            alt="Logo"
            width={280}
            height={61.46}
          />

          <h2 className="text-2xl md:text-4xl font-normal my-4 md:my-11 max-w-[430px]">
            {t("login_title")}
          </h2>

          <p className="text-gray-500 mb-4">{t("please_login")}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="group border border-gray-400 py-3 px-6 relative flex flex-col focus-within:border-l-[6px] focus-within:border-blue-500 transition-all">
              <label htmlFor="email" className="mb-1 text-gray-500 font-light">
                {t("email_address")}
              </label>
              <input
                id="email"
                className="outline-none border-none w-full placeholder-gray-500 text-blue-700"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, email: e.target.value }));
                  setErrors((prev) => ({ ...prev, email: undefined }));
                  setLoginError("");
                }}
              />
              {errors.email && (
                <span className="text-sm text-red-500 absolute right-2">
                  {t("invalid_email")}
                </span>
              )}
            </div>

            <div className="group border border-gray-400 py-3 px-6 relative flex flex-col focus-within:border-l-[6px] focus-within:border-blue-500 transition-all">
              <label
                htmlFor="password"
                className="mb-1 text-gray-500 font-light"
              >
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                className="outline-none border-none w-full placeholder-gray-500 text-blue-700"
                placeholder={t("your_password")}
                value={form.password}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, password: e.target.value }));
                  setErrors((prev) => ({ ...prev, password: undefined }));
                  setLoginError("");
                }}
              />
              {errors.password && (
                <span className="text-sm text-red-500 absolute right-2">
                  {t("invalid_password")}
                </span>
              )}
            </div>

            <div className="relative">
              <button
                disabled={awaiting}
                className={`transition-colors mt-8 bg-blue-500 text-white font-semibold px-10 py-4 shadow-2xs cursor-pointer hover:bg-blue-600 mb-10 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={handleLogin}
              >
                Login
              </button>
              {loginError && (
                <p className="text-red-500 text-sm absolute top-0">
                  {loginError}
                </p>
              )}
            </div>
          </form>

          <p className="text-gray-500">
            {t("dont_have_account")}&nbsp;
            <button
              className="font-bold cursor-pointer"
              onClick={() => setShowRegister(true)}
            >
              {t("register")}
            </button>
          </p>
        </div>
        <div
          className={`w-full md:w-1/2 items-center justify-center bg-blue-500 rounded-br-4xl rounded-tr-4xl ${
            showRegister
              ? "absolute md:relative left-0 z-10 h-full md:h-auto rounded-4xl md:rounded-none md:rounded-br-4xl md:rounded-tr-4xl  bg-white md:bg-blue-500"
              : "hidden md:flex relative"
          }`}
        >
          <Image
            className="hidden md:block"
            src="/family.svg"
            alt="Cape Kids"
            width={452}
            height={472}
          />

          <div
            className={`absolute z-10 rounded-tr-4xl rounded-br-4xl top-0 left-0 w-full h-full bg-white flex items-center justify-center opacity-0 ml-[1px]  ${
              showRegister
                ? "opacity-100  rounded-4xl md:rounded-none md:rounded-tr-4xl md:rounded-br-4xl"
                : ""
            } transition-opacity duration-300`}
          >
            <RegisterForm close={() => setShowRegister(false)} />
          </div>
        </div>
      </div>
    </main>
  );
}
