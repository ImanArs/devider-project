export const CELL = 50;
export const GAP = 4;

export const rowWidthPx = (cols: number) =>
  cols * CELL + Math.max(0, cols - 1) * GAP;

export const parseHint = (hint: string) => {
  const text = (hint || "").toLowerCase();
  return {
    isMul: text.startsWith("умнож"),
    isSub: text.startsWith("вычти"),
  };
};

export const validateInput = (value: string, expected: string) =>
  value.trim() === expected;

export const formatQuotient = (quotient: string[]) => quotient.join("");

export const sanitizeNumericInput = (value: string, maxLength = 1) =>
  value.replace(/\D/g, "").slice(0, maxLength);
