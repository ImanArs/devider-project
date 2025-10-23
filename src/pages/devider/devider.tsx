import { Cell } from "@/shared/components/ui/cell";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { OtpInput } from "@/shared/components/ui/otp-input";
import { SpacerCell } from "./ui/spacer-cell";
import { LeftRowNumbers } from "./ui/left-row";
import { VictoryOverlay } from "./ui/victory-overlay";
import { useDeviderLogic } from "./hooks/use-devider-logic";
import { rowWidthPx, sanitizeNumericInput, CELL } from "./lib/utils";
import { Header } from "./ui/header";

export const DeviderPage = () => {
  const {
    numbers,
    steps,
    stepIndex,
    rightAns,
    setRightAns,
    activeCols,
    leftAns,
    setLeftAns,
    quotient,
    leftRows,
    showOverlay,
    inputRef,
    current,
    done,
    expect,
    isRight,
    isDrop,
    dropDigit,
    submitCommon,
    submitDrop,
    closeOverlay,
  } = useDeviderLogic();

  const handleLeftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeNumericInput(e.target.value);
    setLeftAns(value);
    if (value === dropDigit) submitDrop(value);
  };

  const handleRightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRightAns(value);
    if (value === expect) submitCommon(value);
  };

  if (!current && !done) return null;

  return (
    <div>
      <Header
        steps={steps}
        stepIndex={stepIndex}
        current={current}
        done={done}
        quotient={quotient}
      />
      <div className="max-w-[400px] mx-auto mt-25">
        <div className="flex justify-between">
          <div className="relative z-50">
            <div className="flex gap-1">
              {String(numbers[0])
                .split("")
                .map((digit, index) => (
                  <Cell key={`top-${index}`}>{digit}</Cell>
                ))}
            </div>

            <div className="mt-2 flex flex-col gap-2">
              {leftRows.map((row) => {
                const isActiveDropRow =
                  isDrop && current && row.value === current.D1;
                const cols = isActiveDropRow ? row.usedCols + 1 : row.usedCols;
                const digits = String(row.value).split("");
                const reserveForInput = isActiveDropRow ? 1 : 0;
                const blanks = Math.max(
                  0,
                  cols - digits.length - reserveForInput
                );

                return (
                  <div key={`l-${row.id}`} className="flex flex-col">
                    {row.lineAbove && (
                      <div
                        className="h-[2px] bg-white/80 mb-1"
                        style={{ width: rowWidthPx(cols) }}
                      />
                    )}

                    <div
                      className="relative"
                      style={{ width: rowWidthPx(cols) }}
                    >
                      {row.minus && (
                        <span className="pointer-events-none absolute -left-6 -top-3 text-2xl leading-none select-none">
                          -
                        </span>
                      )}

                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
                        }}
                      >
                        {Array.from({ length: blanks }).map((_, index) => (
                          <SpacerCell key={`space-${row.id}-${index}`} />
                        ))}

                        {digits.map((digit, index) => (
                          <Cell key={`row-${row.id}-${index}`}>{digit}</Cell>
                        ))}

                        {isActiveDropRow && (
                          <div className="relative z-50">
                            <Tooltip
                              open
                              content={
                                <div className="max-w-[220px] font-medium">
                                  {current?.Hint}
                                </div>
                              }
                            >
                              <Cell className="p-0">
                                <input
                                  ref={inputRef}
                                  className="w-full h-full bg-transparent outline-none text-center"
                                  inputMode="numeric"
                                  maxLength={1}
                                  placeholder={dropDigit}
                                  value={leftAns}
                                  onChange={handleLeftInputChange}
                                />
                              </Cell>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <LeftRowNumbers
                leftAns={leftAns}
                setLeftAns={setLeftAns}
                leftRows={leftRows}
                activeCols={activeCols}
                inputRef={inputRef}
                current={current}
                done={done}
                expect={expect}
                isLeft={current?.Side === "left"}
                isDrop={isDrop}
                dropDigit={dropDigit}
                submitCommon={submitCommon}
                submitDrop={submitDrop}
              />
            </div>
          </div>

          <div className="border-l-2 pl-2 flex flex-col gap-2">
            <div className="flex gap-1 border-b-2 pb-2">
              {String(numbers[1])
                .split("")
                .map((digit, index) => (
                  <Cell key={`side-${index}`}>{digit}</Cell>
                ))}
            </div>

            <div className="flex gap-1">
              {quotient.map((digit, index) => (
                <Cell key={`result-${index}`}>{digit}</Cell>
              ))}

              <Tooltip
                open={!done && !!isRight}
                content={<div className="font-medium">{current?.Hint}</div>}
              >
                {!done &&
                  !!isRight &&
                  (expect.length > 1 ? (
                    <OtpInput
                      length={expect.length}
                      onComplete={submitCommon}
                    />
                  ) : (
                    <Cell className="p-0">
                      <input
                        ref={inputRef}
                        className="w-full h-full bg-transparent outline-none"
                        inputMode="numeric"
                        placeholder={expect}
                        value={rightAns}
                        onChange={handleRightInputChange}
                        onBlur={(e) => submitCommon(e.target.value)}
                      />
                    </Cell>
                  ))}
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {done && showOverlay && <VictoryOverlay onClose={closeOverlay} />}
    </div>
  );
};
