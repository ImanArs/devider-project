import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cell } from "@/shared/components/ui/cell";
import { cn } from "@/shared/lib/utils";

interface OtpInputProps {
  length: number;
  onComplete: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function OtpInput({
  length,
  onComplete,
  className,
  autoFocus = true,
}: OtpInputProps) {
  const safeLen = Math.max(1, Math.floor(length));
  const [values, setValues] = useState<string[]>(() =>
    Array.from({ length: safeLen }, () => "")
  );
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    setValues(Array.from({ length: safeLen }, () => ""));
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
      onComplete(join);
    }
  }, [join, safeLen, onComplete]);

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
    <div className={cn("flex gap-1 rounded-md", className)}>
      {Array.from({ length: safeLen }).map((_, i) => (
        <Cell key={i} className="p-0">
          <input
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            className="w-[2.5ch] text-center bg-transparent outline-none px-2 py-2"
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
