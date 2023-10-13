import { FC, InputHTMLAttributes, useState } from "react";
import { CustomIcon } from "./customIcon";

interface PasswordInput extends InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput: FC<PasswordInput> = ({ ...rest }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="password-input">
      <input type={show ? "text" : "password"} {...rest} />
      <button
        className="password-input-show-btn"
        onClick={() => setShow((p) => !p)}
      >
        <CustomIcon icon={show ? "eyeOpen" : "eyeLock"} />
      </button>
    </div>
  );
};
