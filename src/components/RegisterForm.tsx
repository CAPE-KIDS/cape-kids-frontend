import { X } from "lucide-react";
import React from "react";

const RegisterForm = ({ close }: { close: () => void }) => {
  return (
    <div>
      <div className="close">
        <button
          onClick={close}
          className="absolute top-4 right-4 cursor-pointer"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>
      <div>RegisterForm</div>
    </div>
  );
};

export default RegisterForm;
