import { Cell } from "@/shared/components/ui/cell";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { OtpInput } from "@/shared/components/ui/otp-input";
import { CELL, rowWidthPx } from "../lib/utils";
import { SpacerCell } from "./spacer-cell";

interface Props {
  leftAns: string;
  setLeftAns: (v: string) => void;
  leftRows: { id: number; value: number; usedCols: number }[];
  activeCols: number;

  inputRef: React.RefObject<HTMLInputElement | null>;

  current?: { D1: number; Hint: string };
  done: boolean;
  expect: string;
  isLeft?: boolean;
  isDrop: boolean;
  dropDigit: string;
  submitCommon: (v: string) => void;
  submitDrop: (v: string) => void;
}

export const LeftRowNumbers: React.FC<Props> = ({
  leftAns,
  setLeftAns,
  leftRows,
  activeCols,
  inputRef,
  current,
  done,
  expect,
  isLeft,
  isDrop,
  dropDigit,
  submitCommon,
  submitDrop,
}) => {
  if (done || !isLeft) return null;

  if (isDrop && current) {
    const hasD1Row = leftRows.some((r) => r.value === current.D1);
    if (!hasD1Row) {
      const digits = String(current.D1).split("");
      const cols = activeCols + 1;
      const blanks = Math.max(0, cols - digits.length - 1);

      return (
        <div className="relative z-50" style={{ width: rowWidthPx(cols) }}>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, ${CELL}px)` }}
          >
            {Array.from({ length: blanks }).map((_, index) => (
              <SpacerCell key={`space-${index}`} />
            ))}
            {digits.map((digit, index) => (
              <Cell key={`digit-${index}`}>{digit}</Cell>
            ))}

            <div className="relative z-50">
              <Tooltip
                open
                content={
                  <div className="max-w-[220px] font-medium">
                    {current.Hint}
                  </div>
                }
              >
                <Cell className="p-0">
                  <input
                    ref={inputRef}
                    className={`w-full h-full bg-transparent outline-none text-center ${
                      leftAns && leftAns !== dropDigit ? 'text-red-400' : 'text-white'
                    }`}
                    inputMode="numeric"
                    maxLength={1}
                    placeholder={dropDigit}
                    value={leftAns}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 1);
                      setLeftAns(value);
                      if (value === dropDigit) submitDrop(value);
                    }}
                  />
                </Cell>
              </Tooltip>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const cols = activeCols;
  const blanks = Math.max(0, cols - expect.length);
  const lowerHint = (current?.Hint || "").toLowerCase();
  const isSub = lowerHint.startsWith("вычти");
  const isMul = lowerHint.startsWith("умнож");

  return (
    <div className="flex flex-col">
      {isSub && (
        <div
          className="h-[2px] bg-white/80 mb-1"
          style={{ width: rowWidthPx(cols) }}
        />
      )}

      <div className="relative" style={{ width: rowWidthPx(cols) }}>
        {isMul && (
          <span className="pointer-events-none absolute -left-6 -top-3 text-2xl leading-none select-none">
            -
          </span>
        )}

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, ${CELL}px)` }}
        >
          {Array.from({ length: blanks }).map((_, index) => (
            <SpacerCell key={`space-${index}`} />
          ))}

          <div className="relative z-50">
            <Tooltip
              open
              content={
                <div className="max-w-[220px] font-medium">{current?.Hint}</div>
              }
            >
              {expect.length > 1 ? (
                <OtpInput
                  key={`left-${current?.D1}-${expect}`}
                  length={expect.length}
                  expected={expect}
                  onComplete={submitCommon}
                />
              ) : (
                <Cell className="p-0">
                  <input
                    ref={inputRef}
                    className={`w-full h-full bg-transparent outline-none text-center ${
                      leftAns && leftAns !== expect ? 'text-red-400' : 'text-white'
                    }`}
                    inputMode="numeric"
                    placeholder={expect}
                    value={leftAns}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLeftAns(value);
                      if (value === expect) submitCommon(value);
                    }}
                  />
                </Cell>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
