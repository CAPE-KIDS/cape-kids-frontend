export const getRelativeSize = (px: number, total: number) => {
  return (px / total) * 100;
};

export const getAbsoluteSize = (px: number, total: number) => {
  return (px * total) / 100;
};
