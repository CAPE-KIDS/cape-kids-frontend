import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TablePagination,
} from "@mui/material";
import { CirclePlus, MinusCircle, MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

type Header = {
  key: string;
  label: string;
};

type Row = Record<string, any> & {
  id: string | number;
  isInExperiment?: boolean;
};

type ActionItem = {
  label: string;
  onClick: (row: Row) => void;
};

type ParticipantTableProps = {
  headers: Header[];
  rows: Row[];
  pagination?: boolean;

  actions?: (row: Row) => ActionItem[];

  withSimpleAddRemove?: boolean;
  addAction?: (id: string | number) => void;
  removeAction?: (id: string | number) => void;
};

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  headers,
  rows,
  pagination = false,
  actions,
  withSimpleAddRemove = false,
  addAction,
  removeAction,
}) => {
  const { t } = useTranslation("common");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<null | Row>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const open = Boolean(anchorEl);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: Row
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleActionClick = (action: ActionItem) => {
    if (selectedRow) {
      action.onClick(selectedRow);
    }
    handleClose();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsToRender = pagination
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;

  const hasActions = actions || withSimpleAddRemove;

  return (
    <Paper className="!shadow-none">
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader className="!w-full !text-sm !border-collapse">
          <TableHead>
            <TableRow className="!bg-white !border-b !border-gray-300">
              {headers.map((header) => (
                <TableCell
                  key={header.key}
                  className="!px-4 !py-3 !text-xs !text-gray-400 !font-light"
                >
                  {header.label}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="!px-4 !py-3 !text-xs !text-gray-400 !font-light !text-right">
                  {t("ACTIONS")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToRender.map((row) => (
              <TableRow
                key={row.id}
                className="!border-b !border-gray-300 hover:!bg-gray-50"
              >
                {headers.map((header) => (
                  <TableCell
                    key={`${row.id}-${header.key}`}
                    className="!px-4 !py-3 !text-sm !text-gray-800"
                  >
                    {row[header.key]}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell className="!px-4 !py-3 !text-right">
                    {actions && (
                      <IconButton onClick={(e) => handleMenuClick(e, row)}>
                        <MoreVertical size={16} />
                      </IconButton>
                    )}

                    {withSimpleAddRemove && !actions && (
                      <>
                        {row.isInExperiment ? (
                          <button
                            type="button"
                            onClick={() => removeAction?.(row.id)}
                            className="text-red-400 hover:text-red-600 cursor-pointer"
                          >
                            <MinusCircle size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addAction?.(row.id)}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <CirclePlus size={16} />
                          </button>
                        )}
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {selectedRow &&
          actions &&
          actions(selectedRow).map((action, index) => (
            <MenuItem key={index} onClick={() => handleActionClick(action)}>
              {action.label}
            </MenuItem>
          ))}
      </Menu>
    </Paper>
  );
};

export default ParticipantTable;
