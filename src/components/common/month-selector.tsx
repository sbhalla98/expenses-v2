type MonthSelectorProps = {
  changeMonth: (number: number) => void;
  title?: string;
  subTitle?: string;
};

export default function MonthSelector({
  changeMonth,
  title,
  subTitle,
}: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between p-2 mb-2">
      <button
        onClick={() => changeMonth(-1)}
        aria-label="Previous Month"
        className="text-lg"
      >
        <i className="bi bi-arrow-left"></i>
        back
      </button>

      <div className="flex flex-col items-center flex-1">
        <p className="text-lg text-secondary">{title}</p>
        <p className="font-semibold text-primary">{subTitle}</p>
      </div>

      <button
        onClick={() => changeMonth(1)}
        aria-label="Next Month"
        className="text-lg"
      >
        <i className="bi bi-arrow-right"></i>
        next
      </button>
    </div>
  );
}
