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
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { confirm } from "../confirm/confirm";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string;
  isTemplate: boolean;
  createdBy: string;
  hasPermission?: boolean;
};

type Props = {
  tasks: Task[];
  pagination?: boolean;
};

const TasksTable: React.FC<Props> = ({ tasks, pagination }) => {
  const router = useRouter();
  const { t: tC } = useTranslation("common");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const open = Boolean(anchorEl);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleAction = async (action: string) => {
    if (!selectedId) return;

    switch (action) {
      case "delete":
        handleClose();
        const ok = await confirm({
          title: tC("confirm_generic"),
          message: tC("action_cannot_be_undone"),
        });
        if (!ok) return;
        console.log("deletado");
        break;
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

  const paginated = tasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className="!shadow-none">
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader className="!w-full !text-sm !border-collapse">
          <TableHead>
            <TableRow className="!bg-white !border-b !border-gray-300">
              <TableCell className="!px-4 !py-3 !text-xs !text-gray-400 !font-light !m-0 !p-0">
                <span className="!block !text-xs !text-gray-400 !font-light">
                  {tC("TITLE")}
                </span>
              </TableCell>
              <TableCell className="!px-4 !py-3 !text-xs !text-gray-400 !font-light !m-0 !p-0">
                <span className="!block !text-xs !text-gray-400 !font-light">
                  {tC("DESCRIPTION")}
                </span>
              </TableCell>
              <TableCell className="!px-4 !py-3 !text-xs !text-gray-400 !font-light !m-0 !p-0">
                <span className="!block !text-xs !text-gray-400 !font-light">
                  {tC("TEMPLATE")}
                </span>
              </TableCell>
              <TableCell className="!px-4 !py-3 !text-xs !text-gray-400 !font-light !m-0 !p-0">
                <span className="!block !text-xs !text-gray-400 !font-light">
                  {tC("CREATED_BY")}
                </span>
              </TableCell>
              <TableCell className="!px-4 !py-3 !text-xs !text-gray-400 !font-light !text-right !m-0 !p-0">
                <span className="!block !text-xs !text-gray-400 !font-light !text-right">
                  {tC("ACTIONS")}
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((task) => (
              <TableRow
                key={task.id}
                className="!border-b !border-gray-300 hover:!bg-gray-50"
              >
                <TableCell className="!px-4 !py-3 !text-sm !text-gray-800 !m-0 !p-0">
                  <span className="!block !text-sm !text-gray-800">
                    {task.title}
                  </span>
                </TableCell>
                <TableCell className="!px-4 !py-3 !text-sm !text-gray-800 !m-0 !p-0">
                  <span className="!block !text-sm !text-gray-800">
                    {task.description}
                  </span>
                </TableCell>
                <TableCell className="!px-4 !py-3 !text-sm !text-gray-800 !m-0 !p-0">
                  <span className="!block !text-sm !text-gray-800">
                    {task.isTemplate ? (
                      <Chip
                        label={tC("YES")}
                        size="small"
                        color="primary"
                        onClick={() => false}
                        className="!cursor-default"
                      />
                    ) : (
                      <Chip
                        className="!cursor-default"
                        label={tC("NO")}
                        size="small"
                        onClick={() => false}
                      />
                    )}
                  </span>
                </TableCell>
                <TableCell className="!px-4 !py-3 !text-sm !text-gray-800 !m-0 !p-0">
                  <span className="!block !text-sm !text-gray-800">
                    {task.createdBy.email}
                  </span>
                </TableCell>
                <TableCell className="!px-4 !py-3 !text-right !m-0 !p-0">
                  <span className="!block !text-right">
                    <IconButton onClick={(e) => handleMenuClick(e, task.id)}>
                      <MoreVertical size={16} />
                    </IconButton>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={tasks.length}
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
        {/* <MenuItem onClick={() => handleAction("view")}>
          {tC("view_timeline")}
        </MenuItem> */}
        <MenuItem component={Link} href={`/tasks/${selectedId}/timeline`}>
          {tC("edit")}
        </MenuItem>
        <MenuItem
          component={Link}
          href={`/preview?id=${selectedId}`}
          target="_blank"
        >
          {tC("Preview")}
        </MenuItem>
        <MenuItem onClick={() => handleAction("delete")}>
          {tC("delete")}
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default TasksTable;
