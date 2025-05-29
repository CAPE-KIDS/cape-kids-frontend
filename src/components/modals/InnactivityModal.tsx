"use client";
import { useInactivityModal } from "@/hooks/useInactiveModal";
import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase";

const InnactivityModal = () => {
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
              Recomendamos que você atualize a página para evitar problemas de
              desempenho ou perda de dados. Isso pode acontecer quando a sessão
              fica inativa por um período prolongado.
            </p>

            <button
              className="mt-4 text-xs px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Atualizar Página
            </button>
          </div>
        </ModalBase>
      )}
    </div>
  );
};

export default InnactivityModal;
