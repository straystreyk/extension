import { OutClick } from "./outClick";
import { FC, useState } from "react";
import { CustomIcon } from "./customIcon";

export interface ISelectItem {
  name: string;
  value: string;
}

interface ICustomSelect {
  value: ISelectItem;
  onChange: (item: ISelectItem) => void;
  items: ISelectItem[];
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect: FC<ICustomSelect> = ({
  value,
  items,
  onChange,
  placeholder,
  disabled,
}) => {
  const [open, setOpen] = useState(false);

  const onItemClick = (item: ISelectItem) => () => {
    onChange(item);
    setOpen(false);
  };

  return (
    <OutClick
      className={`custom-select ${disabled ? "custom-select-disabled" : ""}`}
      onClick={() => setOpen(false)}
    >
      <div
        className="custom-select-name"
        onClick={() => !disabled && setOpen((p) => !p)}
      >
        <span className={`${!value.name ? "select-placeholder" : ""}`}>
          {value.name || placeholder || ""}
        </span>
        <CustomIcon icon={open ? "arrowUp" : "arrowDown"} />
      </div>
      {open && (
        <div className="custom-select-items">
          {items.map((item, index) => {
            return (
              <div
                onClick={onItemClick(item)}
                title={item.name}
                className="custom-select-item"
                key={index}
              >
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </OutClick>
  );
};
