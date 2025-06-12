import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import { Search, X } from "lucide-react";
import DataTable from "../DataTable";
import _ from "lodash";
import {
  FormatedParticipantsType,
  useParticipantsStore,
} from "@/stores/participants/participantsStore";
import ParticipantTable from "../tables/ParticipantTable";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ParticipantModalProps {
  isOpen: boolean;
  closeModal: () => void;
  fetchExperimentParticipants: () => Promise<void>;
}
const ParticipantModal = ({
  isOpen,
  closeModal,
  fetchExperimentParticipants,
}: ParticipantModalProps) => {
  const { t } = useTranslation("common");
  const params = useParams();
  const experimentId = params.id as string;
  const {
    selectedExperiment,
    addParticipantToExperiment,
    selectedExperimentParticipants,
  } = useExperimentsStore();
  const { participants, formatParticipants, removeParticipant } =
    useParticipantsStore();
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedParticipants, setSelectedParticipants] = useState(
    formatParticipants(participants)
  );

  useEffect(() => {
    setSelectedParticipants(formatParticipants(participants));
  }, [participants, selectedExperimentParticipants]);

  if (!isOpen) return null;
  return (
    <div>
      <ModalBase
        title=""
        onClose={() => {
          closeModal();
          setSelectedParticipants(formatParticipants(participants));
          setSearchTerm("");
        }}
        styles="w-[900px]"
      >
        <p className="text-lg mb-4">{t("participant_modal_title")}</p>
        <p className="text-md">{selectedExperiment.experiment.title}</p>

        <div className="">
          <div className="flex items-center justify-between mb-4 gap-8 mt-6">
            <span className="text-blue-600 text-lg">
              {t("participant_modal_list")}
            </span>
            <div className="search flex relative flex-1 max-w-[372px]">
              <input
                type="text"
                placeholder={t("participant_modal_search_placeholder")}
                className="border-2 border-blue-300 rounded-lg p-2 w-full text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);

                  _.debounce(() => {
                    const filteredParticipants = participants.filter(
                      (participant) =>
                        participant.profile.fullName
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                    );
                    setSelectedParticipants(
                      formatParticipants(filteredParticipants)
                    );
                  }, 300)();
                }}
              />
              {!searchTerm && (
                <Search size={16} className="absolute right-2 top-3" />
              )}
              {searchTerm && (
                <button
                  className="absolute right-2 top-3 text-gray-500 cursor-pointer"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedParticipants(formatParticipants(participants));
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-auto h-full max-h-[400px] min-h-[400px]">
            <ParticipantTable
              headers={[
                { key: "name", label: t("name") },
                { key: "age", label: t("age") },
                { key: "gender", label: t("gender") },
                { key: "nativeLanguage", label: t("language") },
              ]}
              rows={selectedParticipants}
              withAddButton={true}
              addAction={async (id) => {
                const response = await addParticipantToExperiment(
                  experimentId,
                  `${id}`
                );
                if (response.error) {
                  toast.error(response.message);
                } else {
                  toast.success(t("participant_added_to_experiment"));
                  await fetchExperimentParticipants();
                }
              }}
              removeAction={async (id: string) => {
                const response = await removeParticipant(experimentId, id);
                if (response.error) {
                  toast.error(t("paticipant_not_in_experiment"));
                } else {
                  toast.success(t("participant_removed_from_experiment"));
                  await fetchExperimentParticipants();
                }
              }}
            />
          </div>
        </div>
      </ModalBase>
    </div>
  );
};

export default ParticipantModal;
