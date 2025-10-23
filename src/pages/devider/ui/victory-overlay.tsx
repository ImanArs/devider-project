interface Props {
  onClose: () => void;
}

export const VictoryOverlay = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-[min(92vw,380px)] rounded-2xl bg-white/50 text-white p-6 text-center shadow-2xl">
        <p>
          ну тут можно сделать типо поздравляю но я не знаю что именно вписать
          (не придумал простите)
        </p>
        <p>если будете бить то ладно</p>
      </div>
    </div>
  );
};
