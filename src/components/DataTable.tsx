import React from "react";
import { MoreVertical } from "lucide-react";

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
};

const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  withQuickActions = false,
  actions = [],
}) => {
  const [openRowId, setOpenRowId] = React.useState<string | number | null>(
    null
  );

  return (
    <div className="space-y-2">
      <div className=" rounded-md ">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-b-gray-300 bg-white text-xs text-gray-400 ">
              {headers.map((header) => (
                <th key={header.key} className="px-4 py-3 font-light">
                  {header.label}
                </th>
              ))}
              {withQuickActions && <th className="px-4 py-3"> </th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-b-gray-300 hover:bg-gray-50 relative"
              >
                {headers.map((header) => (
                  <td
                    key={header.key}
                    className="px-4 py-3 text-sm text-gray-800"
                  >
                    {row[header.key]}
                  </td>
                ))}
                {withQuickActions && (
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenRowId(openRowId === row.id ? null : row.id)
                        }
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openRowId === row.id && (
                        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white border z-20 overflow-hidden">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
