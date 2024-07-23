type FormInputProps = {
  label?: string;
  placeholder?: string;
  labelStyle?: string;
  inputName?: string;
  inputType?: string;
  inputStyle?: string;
  autoFocus?: boolean;
  value?: any;
  defaultValue?: any;
  onChange?: (e: any) => void;
};

export const FormIinput = ({
  label,
  placeholder,
  labelStyle,
  inputName,
  inputType,
  inputStyle,
  autoFocus,
  value,
  defaultValue,
  onChange,
}: FormInputProps) => {
  return (
    <label className="form-control w-full">
      <div className="label">
        <span
          className={
            labelStyle ??
            "label-text text-slate-100 font-semibold text-[1.05rem] mb-1"
          }
        >
          {label ?? "Input Label"}
        </span>
      </div>
      <input
        type={inputType ?? "text"}
        placeholder={`${placeholder ?? "Input Placeholder"}`}
        className={inputStyle ?? "input input-bordered"}
        autoFocus={autoFocus}
        name={inputName ?? "inputName"}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </label>
  );
};
