import { pp } from "@/entities/task/model/const";
import type { Step } from "@/entities/task/model/types";

interface Props {
  steps: Step[];
  stepIndex: number;
  current: Step | undefined;
  done: boolean;
  quotient: string[];
}

export const Header = ({
  steps,
  stepIndex,
  current,
  done,
  quotient,
}: Props) => {
  return (
    <div>
      <h1 className="text-center text-4xl">{pp[0].questionText}</h1>

      <div className="max-w-[200px] mx-auto text-sm opacity-80 mt-5">
        {!done ? (
          <>
            Шаг {stepIndex + 1} из {steps.length}: {current?.Hint}
          </>
        ) : (
          <div className="font-medium">Готово! Ответ: {quotient.join("")}</div>
        )}
      </div>
    </div>
  );
};
