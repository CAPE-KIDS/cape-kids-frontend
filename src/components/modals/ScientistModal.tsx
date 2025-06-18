import React, { useEffect, useState } from "react";
import ModalBase from "./ModalBase";
import { useExperimentsStore } from "@/stores/experiments/experimentsStore";
import { Search, X } from "lucide-react";
import DataTable from "../DataTable";
import _ from "lodash";
import {
  FormatedScientistsType,
  useScientistsStore,
} from "@/stores/scientists/scientistsStore";
import ScientistTable from "../tables/ScientistTable";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ScientistModalProps {
  isOpen: boolean;
  closeModal: () => void;
  fetchExperimentScientists: () => Promise<void>;
}
const ScientistModal = ({
  isOpen,
  closeModal,
  fetchExperimentScientists,
}: ScientistModalProps) => {
  const { t } = useTranslation("common");
  const params = useParams();
  const experimentId = params.id as string;
  const {
    selectedExperiment,

    selectedExperimentScientists,
  } = useExperimentsStore();
  const {
    scientists,
    formatScientists,
    removeScientist,
    addScientistToExperiment,
  } = useScientistsStore();
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedScientists, setSelectedScientists] = useState(
    formatScientists(scientists)
  );

  useEffect(() => {
    setSelectedScientists(formatScientists(scientists));
  }, [scientists, selectedExperimentScientists]);

  if (!isOpen) return null;
  return (
    <div>
      <ModalBase
        title=""
        onClose={() => {
          closeModal();
          setSelectedScientists(formatScientists(scientists));
          setSearchTerm("");
        }}
        styles="w-[900px]"
      >
        <p className="text-lg mb-4">{t("scientist_modal_title")}</p>
        <p className="text-md">{selectedExperiment?.experiment.title}</p>

        <div className="">
          <div className="flex items-center justify-between mb-4 gap-8 mt-6">
            <span className="text-blue-600 text-lg">
              {t("scientist_modal_list")}
            </span>
            <div className="search flex relative flex-1 max-w-[372px]">
              <input
                type="text"
                placeholder={t("scientist_modal_search_placeholder")}
                className="border-2 border-blue-300 rounded-lg p-2 w-full text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);

                  _.debounce(() => {
                    const filteredScientists = scientists.filter((scientist) =>
                      scientist.profile.fullName
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    );
                    setSelectedScientists(formatScientists(filteredScientists));
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
                    setSelectedScientists(formatScientists(scientists));
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-auto h-full max-h-[400px] min-h-[400px]">
            <ScientistTable
              headers={[
                { key: "name", label: t("name") },
                { key: "email", label: t("email") },
                { key: "institution", label: t("institution") },
                { key: "department", label: t("department") },
                { key: "isOwner", label: t("creator") },
              ]}
              rows={selectedScientists}
              pagination={true}
              withSimpleAddRemove={true}
              addAction={async (id) => {
                const response = await addScientistToExperiment(
                  experimentId,
                  `${id}`
                );
                if (response.error) {
                  toast.error(t(response.message));
                } else {
                  toast.success(t("scientist_added_to_experiment"));
                  await fetchExperimentScientists();
                }
              }}
              removeAction={async (id) => {
                const response = await removeScientist(experimentId, `${id}`);
                if (response.error) {
                  toast.error(t("paticipant_not_in_experiment"));
                } else {
                  toast.success(t("scientist_removed_from_experiment"));
                  await fetchExperimentScientists();
                }
              }}
            />
          </div>
        </div>
      </ModalBase>
    </div>
  );
};

export default ScientistModal;
