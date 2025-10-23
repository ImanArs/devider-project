import { useState, useEffect, useRef } from "react";
import { pp } from "@/entities/task/model/const";
import type { LeftRow } from "@/entities/task/model/types";
import { parseHint, validateInput } from "../lib/utils";

export const useDeviderLogic = () => {
  const { Numbers: numbers, Steps: steps } = pp[0].question;

  const [stepIndex, setStepIndex] = useState(0);
  const [rightAns, setRightAns] = useState("");
  const [leftAns, setLeftAns] = useState("");
  const [quotient, setQuotient] = useState<string[]>([]);
  const [leftRows, setLeftRows] = useState<LeftRow[]>([]);
  const [activeCols, setActiveCols] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const current = steps[stepIndex];
  const done = stepIndex >= steps.length;

  useEffect(() => {
    inputRef.current?.focus();
  }, [stepIndex, current?.Side]);

  useEffect(() => {
    if (done) setShowOverlay(true);
  }, [done]);

  const expect = current ? String(current.Sum) : "";
  const isRight = current?.Side === "right";
  const isLeft = current?.Side === "left";
  const isDrop = !!(isLeft && current && current.D2 === 0);
  const dropDigit = isDrop && current ? expect.slice(-1) : "";

  const submitCommon = (val: string) => {
    if (done || !current) return;
    if (!validateInput(val, expect)) return;

    if (isRight) {
      setQuotient((q) => [...q, expect]);
      setActiveCols((prev) => Math.max(prev, String(current.D1).length));
    }

    if (isLeft && !isDrop) {
      const usedCols = activeCols;
      const { isMul, isSub } = parseHint(current.Hint);

      setLeftRows((r) => [
        ...r,
        {
          id: current.Id,
          value: current.Sum,
          usedCols,
          minus: isMul,
          lineAbove: isSub,
        },
      ]);
    }

    setRightAns("");
    setLeftAns("");
    setStepIndex(stepIndex + 1);
  };

  const submitDrop = (val: string) => {
    if (!isDrop || !current || val !== dropDigit) return;

    setLeftRows((prev) => {
      const next = [...prev];
      const idxRev = [...next]
        .reverse()
        .findIndex((r) => r.value === current.D1);
      const realIdx = idxRev === -1 ? -1 : next.length - 1 - idxRev;

      if (realIdx >= 0) {
        next[realIdx] = {
          ...next[realIdx],
          id: current.Id,
          value: current.Sum,
          usedCols: next[realIdx].usedCols + 1,
        };
      } else {
        next.push({
          id: current.Id,
          value: current.Sum,
          usedCols: activeCols + 1,
        });
      }
      return next;
    });

    setActiveCols((c) => c + 1);
    setLeftAns("");
    setStepIndex(stepIndex + 1);
  };

  const closeOverlay = () => setShowOverlay(false);

  return {
    numbers,
    steps,
    stepIndex,
    rightAns,
    setRightAns,
    leftAns,
    setLeftAns,
    quotient,
    leftRows,
    activeCols,
    showOverlay,
    inputRef,
    current,
    done,
    expect,
    isRight,
    isLeft,
    isDrop,
    dropDigit,
    submitCommon,
    submitDrop,
    closeOverlay,
  };
};
