import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: (result: boolean) => void;
}) {
  const { t: tC } = useTranslation("common");

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="confirm-dialog-title"
    >
      <Box
        className="bg-white rounded shadow max-w-sm w-full p-4"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography
          id="confirm-dialog-title"
          variant="h6"
          className="!mb-2 !font-bold"
        >
          {title}
        </Typography>
        <Typography className="!mb-4 !text-sm text-gray-700">
          {message}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onClose(false)}
          >
            {cancelLabel || tC("cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onClose(true)}
          >
            {confirmLabel || tC("confirm")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
