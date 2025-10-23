import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cell } from "@/shared/components/ui/cell";
import { cn } from "@/shared/lib/utils";

interface OtpInputProps {
  length: number;
  onComplete: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  /** ожидаемое значение для валидации (если нужно подсветить ошибку) */
  expected?: string;
}

export function OtpInput({
  length,
  onComplete,
  className,
  autoFocus = true,
  expected,
}: OtpInputProps) {
  const safeLen = Math.max(1, Math.floor(length));
  const [values, setValues] = useState<string[]>(() =>
    Array.from({ length: safeLen }, () => "")
  );
  const [isError, setIsError] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    setValues(Array.from({ length: safeLen }, () => ""));
    setIsError(false);
  }, [safeLen]);

  useEffect(() => {
    if (!autoFocus) return;
    const idx = values.findIndex((v) => v === "");
    const i = idx === -1 ? 0 : idx;
    inputsRef.current[i]?.focus();
  }, [autoFocus, safeLen, values]);

  const join = useMemo(() => values.join("").trim(), [values]);

  useEffect(() => {
    if (join.length === safeLen) {
      if (expected && join !== expected) {
        setIsError(true);
        setTimeout(() => setIsError(false), 500);
        setValues(Array.from({ length: safeLen }, () => ""));
      } else {
        onComplete(join);
      }
    }
  }, [join, safeLen, onComplete, expected]);

  const setAt = (i: number, val: string) => {
    setValues((prev) => prev.map((v, idx) => (idx === i ? val : v)));
  };

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D+/g, "").slice(0, safeLen);
    if (!digits) return;
    setValues((prev) => {
      const next = [...prev];
      let i = index;
      for (const ch of digits) {
        if (i >= safeLen) break;
        next[i] = ch;
        i++;
      }
      return next;
    });
    requestAnimationFrame(() => {
      const nextEmpty = values.slice(index + 1).findIndex((v) => v === "");
      const nextIndex =
        nextEmpty === -1
          ? Math.min(index + digits.length, safeLen - 1)
          : index + 1 + nextEmpty;
      inputsRef.current[nextIndex]?.focus();
      inputsRef.current[nextIndex]?.select();
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const key = e.key;
    if (key === "Backspace") {
      if (values[index]) {
        setAt(index, "");
        return;
      }
      const prev = Math.max(0, index - 1);
      setAt(prev, "");
      inputsRef.current[prev]?.focus();
      inputsRef.current[prev]?.select();
      e.preventDefault();
    } else if (key === "ArrowLeft") {
      const prev = Math.max(0, index - 1);
      inputsRef.current[prev]?.focus();
      e.preventDefault();
    } else if (key === "ArrowRight") {
      const next = Math.min(safeLen - 1, index + 1);
      inputsRef.current[next]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div
      className={cn(
        "flex gap-1 rounded-md transition-colors",
        isError && "text-red-500",
        className
      )}
    >
      {Array.from({ length: safeLen }).map((_, i) => (
        <Cell
          key={i}
          className={cn(
            "p-0 transition-colors",
            isError && "border-red-500 text-red-500"
          )}
        >
          <input
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            className={cn(
              "w-full text-center bg-transparent outline-none",
              isError && "text-red-500 placeholder-red-500"
            )}
            value={values[i]}
            inputMode="numeric"
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        </Cell>
      ))}
    </div>
  );
}
