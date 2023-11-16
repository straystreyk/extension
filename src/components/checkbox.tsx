import { ChangeEvent, FC } from "react";
import { CustomIcon } from "./customIcon";

export const Checkbox: FC<{
  checked: boolean;
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  text?: string;
}> = ({ checked, id, onChange, text = null }) => {
  return (
    <>
      <input
        className="custom-checkbox-input"
        type="checkbox"
        id={id}
        onChange={onChange}
        checked={checked}
      />
      <label className="custom-checkbox-label" htmlFor={id}>
        <span className="custom-checkbox">
          <CustomIcon icon="checkmark" />
        </span>
        {text}
      </label>
    </>
  );
};
