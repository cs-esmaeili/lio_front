import { Input } from "@/components/shadcn/input";

type Props = {
  index: number;
  value: string;
  error: boolean;
  autoFocus?: boolean;

  inputRef: (el: HTMLInputElement | null) => void;

  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};

export function OtpInput({
  index,
  value,
  error,
  autoFocus,
  inputRef,
  onChange,
  onKeyDown,
  onPaste,
}: Props) {
  return (
    <Input
      ref={inputRef}
      id={`otp-${index}`}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste}
      aria-label={`رقم ${index + 1} کد تایید`}
      aria-invalid={error}
      className={[
        "h-12 w-12 rounded-lg border text-center text-xl font-semibold outline-none transition-all caret-primary-1 text-secondary-black-3",
        "focus:ring-2",
        error
          ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
          : value
            ? "border-primary-2 focus:border-primary-2 focus:ring-primary-2/20"
            : "border-slate-200 focus:border-primary-1 focus:ring-primary-1/20",
      ].join(" ")}
    />
  );
}
