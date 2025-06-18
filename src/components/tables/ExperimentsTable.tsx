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
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { confirm } from "../confirm/confirm";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import Link from "next/link";

type Experiment = {
  id: string;
  title: string;
  description: string;
  status: string;
};

type Props = {
  experiments: Experiment[];
  pagination?: boolean;
};

const ExperimentsTable: React.FC<Props> = ({ experiments, pagination }) => {
  const router = useRouter();
  const { t: tC } = useTranslation("common");
  const { authState } = useAuthStore();

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
      case "start":
        window.open(`/experiments/${selectedId}/play`, "_blank");
        break;
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

  const paginated = experiments.slice(
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
                  {tC("STATUS")}
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
            {paginated.map((exp) => (
              <TableRow
                key={exp.id}
                className="!border-b !border-gray-300 hover:!bg-gray-50"
              >
                <TableCell className="!px-4 !py-3 !text-sm !text-gray-800 !m-0 !p-0">
                  <span className="!block !text-sm !text-gray-800">
                    {exp.title}
                  </span>
                </TableCell>
                <TableCell className="!px-4 !py-3 !text-sm !text-gray-800 !m-0 !p-0">
                  <span className="!block !text-sm !text-gray-800">
                    {exp.description}
                  </span>
                </TableCell>
                <TableCell className="!px-4 !py-3 !text-sm !text-gray-800 !m-0 !p-0">
                  <span className="!block !text-sm !text-gray-800 !capitalize">
                    {exp.status}
                  </span>
                </TableCell>
                <TableCell className="!px-4 !py-3 !text-right !m-0 !p-0">
                  <span className="!block !text-right">
                    <IconButton onClick={(e) => handleMenuClick(e, exp.id)}>
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
          count={experiments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}

      {authState.user?.profile.profileType !== "participant" ? (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            component={Link}
            href={`/experiments/${selectedId}/timeline`}
          >
            {tC("edit")}
          </MenuItem>
          <MenuItem
            component={Link}
            href={`/preview?id=${selectedId}`}
            target="_blank"
          >
            {tC("Preview")}
          </MenuItem>
          {/* <MenuItem onClick={() => handleAction("view")}>
            {tC("view_timeline")}
          </MenuItem> */}

          <MenuItem
            component={Link}
            href={`/experiments/${selectedId}/participants`}
          >
            {tC("manage_participants")}
          </MenuItem>
          <MenuItem
            component={Link}
            href={`/experiments/${selectedId}/scientists`}
          >
            {tC("manage_scientists")}
          </MenuItem>
          <MenuItem onClick={() => handleAction("delete")}>
            {tC("delete")}
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => handleAction("start")}>
            {tC("start_experiment")}
          </MenuItem>
        </Menu>
      )}
    </Paper>
  );
};

export default ExperimentsTable;
