let confirmFn: ((opts: ConfirmOptions) => Promise<boolean>) | null = null;

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function confirm(opts: ConfirmOptions): Promise<boolean> {
  if (!confirmFn) throw new Error("ConfirmProvider is missing");
  return confirmFn(opts);
}

export function _setConfirmFunction(fn: typeof confirmFn) {
  confirmFn = fn;
}
