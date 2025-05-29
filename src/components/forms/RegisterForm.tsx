"use client";

import { useState } from "react";
import {
  RegisterSchemaType,
  registerSchema,
  ParticipantMetadataSchemaType,
} from "@shared/user";
import { API } from "@/utils/api";
import ParticipantProfileForm from "./ParticipantProfileForm";
import PsychologistProfileForm from "./PsychologistProfileForm";
import ResearcherProfileForm from "./ResearcherProfileForm";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { X } from "lucide-react";
import { set } from "lodash";

interface Props {
  close: () => void;
}

const RegisterForm = ({ close }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterSchemaType>({
    email: "",
    password: "",
    profile: {
      fullName: "",
      profileType: "participant",
      metadata: {},
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const validation = registerSchema.safeParse(form);
    if (!validation.success) {
      const formatted: Record<string, string> = {};

      for (const issue of validation.error.issues) {
        const path = issue.path.join(".");
        if (!formatted[path]) {
          formatted[path] = issue.message;
        }
      }
      console.log("Validation errors:", formatted);
      setErrors(formatted);
      setTimeout(() => {
        setSubmitted(false);
      }, 200);
      return;
    }

    setErrors({});

    console.log("Form submitted:", form);
    const response = await register(form);
    if (response?.error) {
      toast.error(response.message);
      setSubmitted(false);
      return;
    }

    toast.success("Registered successfully");
    resetForm();
    close();
    setSubmitted(false);
  };

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      profile: {
        fullName: "",
        profileType: "participant",
        metadata: {},
      },
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="w-full md:max-w-lg p-6 relative max-h-full h-full space-y-4 mb-4 pb-12 overflow-hidden">
      <button type="button">
        <X
          size={24}
          className="cursor-pointer absolute top-4 right-4"
          onClick={() => {
            setTimeout(() => {
              resetForm();
              close();
            }, 200);
          }}
        />
      </button>
      <form onSubmit={handleSubmit} className="max-h-full overflow-auto pr-4">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-gray-700">Email*</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
                setForm({ ...form, email: e.target.value });
              }}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.replace("String", "Email")}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-700">Password*</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => {
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
                setForm({ ...form, password: e.target.value });
              }}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.replace("String", "Password")}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-700">Full Name*</label>
            <input
              type="text"
              value={form.profile.fullName}
              onChange={(e) => {
                if (errors["profile.fullName"]) {
                  setErrors((prev) => ({
                    ...prev,
                    "profile.fullName": undefined,
                  }));
                }

                setForm({
                  ...form,
                  profile: { ...form.profile, fullName: e.target.value },
                });
              }}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors["profile.fullName"] && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          <div>
            <label className="text-gray-700">Profile Type*</label>
            <select
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.profile.profileType}
              onChange={(e) => {
                setForm({
                  ...form,
                  profile: {
                    fullName: form.profile.fullName,
                    profileType: e.target
                      .value as RegisterSchemaType["profile"]["profileType"],
                    metadata: {},
                  },
                });
                setErrors((prev) => ({
                  ...prev,
                  "profile.profileType": undefined,
                }));
              }}
            >
              <option value="participant">Participant</option>
              {/* <option value="psychologist">Psychologist</option> */}
              <option value="researcher">Researcher</option>
            </select>
            {errors["profile.profileType"] && (
              <p className="text-red-500 text-sm">
                {errors["profile.profileType"]}
              </p>
            )}
          </div>
        </div>
        {form.profile.profileType === "participant" && (
          <ParticipantProfileForm
            value={form.profile.metadata?.participant || {}}
            submitted={submitted}
            onChange={(val) =>
              setForm({
                ...form,
                profile: {
                  ...form.profile,
                  metadata: { participant: val },
                },
              })
            }
          />
        )}

        {form.profile.profileType === "psychologist" && (
          <PsychologistProfileForm
            value={form.profile.metadata?.psychologist || {}}
            submitted={submitted}
            onChange={(val) =>
              setForm({
                ...form,
                profile: {
                  ...form.profile,
                  metadata: { psychologist: val },
                },
              })
            }
          />
        )}

        {form.profile.profileType === "researcher" && (
          <ResearcherProfileForm
            value={form.profile.metadata?.researcher || {}}
            submitted={submitted}
            onChange={(val) =>
              setForm({
                ...form,
                profile: {
                  ...form.profile,
                  metadata: { researcher: val },
                },
              })
            }
          />
        )}

        <div>
          <button
            disabled={submitted}
            type="submit"
            className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded font-semibold mt-4 hover:bg-blue-600 disabled:opacity-50"
          >
            Register
          </button>
          <button
            type="button"
            className="cursor-pointer bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold mt-4 ml-4 hover:bg-gray-400"
            onClick={() => {
              setTimeout(() => {
                resetForm();
                close();
              }, 200);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
