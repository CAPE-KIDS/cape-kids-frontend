// ConfirmProvider.tsx
"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { ConfirmOptions, _setConfirmFunction } from "./confirm";
import ConfirmDialog from "./ConfirmDialog";

type State = ConfirmOptions & {
  open: boolean;
  resolve?: (result: boolean) => void;
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({
    open: false,
    title: "",
    message: "",
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, open: true, resolve });
    });
  }, []);

  _setConfirmFunction(confirm);

  const handleClose = (result: boolean) => {
    state.resolve?.(result);
    setState({ ...state, open: false });
  };

  return (
    <>
      {children}
      <ConfirmDialog
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        onClose={handleClose}
      />
    </>
  );
}
