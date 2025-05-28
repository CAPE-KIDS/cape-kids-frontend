import React, { useEffect, useRef, useState, WheelEvent } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CirclePlus, MoreVertical } from "lucide-react";

type Header = {
  key: string;
  label: string;
};

type Row = Record<string, React.ReactNode> & {
  id: string | number;
};

type DataTableProps = {
  headers: Header[];
  rows: Row[];
  withQuickActions?: boolean;
  actions?: { label: string; onClick: (row: Row) => void }[];
  withAddButton?: boolean;
  addAction?: (id: string | number) => void;
  onReorder?: (newOrder: (string | number)[]) => void;
};

const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  withQuickActions = false,
  actions = [],
  onReorder,
  withAddButton = false,
  addAction,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | WheelEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenRowId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = currentOrder.indexOf(active.id);
    const newIndex = currentOrder.indexOf(over.id);

    const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
    setCurrentOrder(newOrder);

    if (onReorder) {
      onReorder(newOrder);
    }
  };

  return (
    <div className={`space-y-2 ${isDragging ? "overflow-hidden" : ""} `}>
      <div className="rounded-md">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(event) => {
            handleDragEnd(event);
            setIsDragging(false);
          }}
        >
          <SortableContext
            items={currentOrder}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full text-left text-sm ">
              <thead>
                <tr className="border-b border-b-gray-300 bg-white text-xs text-gray-400">
                  {headers.map((header) => (
                    <th key={header.key} className="px-4 py-3 font-light">
                      {header.label}
                    </th>
                  ))}
                  {withQuickActions && <th className="px-4 py-3"></th>}
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
                      withQuickActions={withQuickActions}
                      actions={actions}
                      openRowId={openRowId}
                      setOpenRowId={setOpenRowId}
                      dropdownRef={dropdownRef}
                      withAddButton={withAddButton}
                      addAction={addAction}
                    />
                  );
                })}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DataTable;

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
};

const DataRow: React.FC<DataRowProps> = ({
  row,
  headers,
  withQuickActions,
  actions,
  openRowId,
  setOpenRowId,
  dropdownRef,
  withAddButton,
  addAction,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.id });

  const quickActionRef = useRef<HTMLTableCellElement | null>(null);

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
      {withQuickActions && (
        <td className="px-4 py-3 text-right" ref={quickActionRef}>
          <div
            className="inline-block"
            ref={openRowId === row.id ? dropdownRef : null}
          >
            <button
              type="button"
              onClick={() => setOpenRowId(openRowId === row.id ? null : row.id)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer "
            >
              <MoreVertical size={16} />
            </button>
            {openRowId === row.id && (
              <div
                className="fixed right-0 mt-2 w-32 rounded-md shadow-lg bg-white border z-20 overflow-hidden"
                style={{
                  top: quickActionRef.current
                    ? quickActionRef.current.getBoundingClientRect().bottom +
                      window.scrollY -
                      20
                    : 0,
                  left: quickActionRef.current
                    ? quickActionRef.current.getBoundingClientRect().left +
                      window.scrollX -
                      50
                    : 0,
                }}
              >
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick(row);
                      setOpenRowId(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </td>
      )}

      {withAddButton && (
        <td className="px-4 py-3 text-right">
          <div
            className="inline-block"
            ref={openRowId === row.id ? dropdownRef : null}
          >
            <button
              type="button"
              onClick={() => addAction(row.id)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <CirclePlus size={16} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};
