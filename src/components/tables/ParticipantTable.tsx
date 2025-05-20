import React, { useEffect, useRef, useState } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CirclePlus, MinusCircle } from "lucide-react";

type Header = {
  key: string;
  label: string;
};

type Row = Record<string, React.ReactNode> & {
  id: string | number;
};

type ParticipantTableProps = {
  headers: Header[];
  rows: Row[];
  withAddButton?: boolean;
  addAction?: (id: string | number) => void;
  removeAction?: (id: string) => void;
  onReorder?: (newOrder: (string | number)[]) => void;
};

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  headers,
  rows,
  onReorder,
  withAddButton = false,
  addAction,
  removeAction,
}) => {
  const [openRowId, setOpenRowId] = useState<string | number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [currentOrder, setCurrentOrder] = useState<(string | number)[]>(
    rows.map((r) => r.id)
  );
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setCurrentOrder(rows.map((r) => r.id));
  }, [rows]);

  return (
    <div className={`space-y-2 ${isDragging ? "overflow-hidden" : ""}`}>
      <div className="rounded-md">
        <SortableContext
          items={currentOrder}
          strategy={verticalListSortingStrategy}
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-b-gray-300 bg-white text-xs text-gray-400">
                {headers.map((header) => (
                  <th key={header.key} className="px-4 py-3 font-light">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentOrder.map((id) => {
                const row = rows.find((r) => r.id === id);
                if (!row) return null;
                return (
                  <DataRow
                    key={row.id}
                    row={row}
                    headers={headers}
                    openRowId={openRowId}
                    setOpenRowId={setOpenRowId}
                    dropdownRef={dropdownRef}
                    withAddButton={withAddButton}
                    addAction={addAction}
                    removeAction={removeAction}
                  />
                );
              })}
            </tbody>
          </table>
        </SortableContext>
      </div>
    </div>
  );
};

export default ParticipantTable;

type DataRowProps = {
  row: Row;
  headers: Header[];
  withQuickActions: boolean;
  actions: { label: string; onClick: (row: Row) => void }[];
  openRowId: string | number | null;
  setOpenRowId: (id: string | number | null) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  withAddButton: boolean;
  addAction: (id: string | number) => void;
  removeAction: (id: string) => void;
};

const DataRow: React.FC<DataRowProps> = ({
  row,
  headers,
  openRowId,
  setOpenRowId,
  dropdownRef,
  withAddButton,
  addAction,
  removeAction,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border-b border-b-gray-300 hover:bg-gray-50"
    >
      {headers.map((header) => (
        <td
          {...listeners}
          key={header.key}
          className="px-4 py-3 text-sm text-gray-800"
        >
          {row[header.key]}
        </td>
      ))}
      {withAddButton && (
        <td className="px-4 py-3 text-right">
          <div
            className="inline-block"
            ref={openRowId === row.id ? dropdownRef : null}
          >
            {row.isInExperiment ? (
              <button
                type="button"
                onClick={() => removeAction(row.id as string)}
                className="text-red-400 hover:text-red-600 cursor-pointer"
              >
                <MinusCircle size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => addAction(row.id)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <CirclePlus size={16} />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};
