"use client";
import { useInactivityModal } from "@/hooks/useInactiveModal";
import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase";
import { useTranslation } from "react-i18next";

const InnactivityModal = () => {
  const {t} = useTranslation("common");
  const [showModal, setShowModal] = useState(false);

  useInactivityModal({
    timeoutMinutes: 5,
    onTriggerModal: () => setShowModal(true),
  });

  return (
    <div>
      {showModal && (
        <ModalBase title="Sessão inativa" onClose={() => setShowModal(false)}>
          <div>
            <p className="text-sm text-gray-500">
              {t("inactivity_message")}
            </p>

            <button
              className="mt-4 text-xs px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              onClick={() => window.location.reload()}
            >
              {t("inactivity_refresh")}
            </button>
          </div>
        </ModalBase>
      )}
    </div>
  );
};

export default InnactivityModal;
