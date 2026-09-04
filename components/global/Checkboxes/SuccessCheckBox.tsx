interface SuccessCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}

export function SuccessCheckbox({ checked, onChange, label, className = "" }: SuccessCheckboxProps) {
    return (
        <div className="flex items-center justify-end gap-2">
            <label className="relative flex items-center gap-2 cursor-pointer select-none">
                {/* Hidden native checkbox – we’ll style a custom one */}
                <input
                    type="checkbox"
                    checked= {checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer sr-only"  // screen-reader only, hides native checkbox
                />
                {/* Custom checkbox element */}
                <div className="w-5 h-5 border-1 rounded border-gray-300 bg-white 
                    peer-checked:bg-primary-0 peer-checked:border-primary-0
                    peer-focus:ring-2 peer-focus:ring-primary-0/50
                    transition-all duration-200 flex items-center justify-center">
                    {/* Tick icon (SVG) – appears when checked */}
                    <svg
                        className="w-4 h-4 text-white peer-checked:block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                {/* Dynamic label */}
                <span className="text-sm text-gray-700">باکس</span>
            </label>
        </div>
    );
}