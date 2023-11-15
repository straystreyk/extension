import { OutClick } from "./outClick";
import { FC, useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().startsWith(search.toLowerCase())
      ),
    [search, items]
  );

  const onItemClick = (item: ISelectItem) => () => {
    onChange(item);
    setOpen(false);
    setSearch("");
  };

  if (!items) return null;

  return (
    <OutClick
      className={`custom-select ${disabled ? "custom-select-disabled" : ""}`}
      onClick={() => {
        setOpen(false);
        setSearch("");
      }}
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
        <>
          <div className="custom-select-items">
            <input
              type="text"
              value={search}
              placeholder="Поиск"
              onChange={(e) => setSearch(e.target.value)}
            />
            {filteredItems.map((item, index) => {
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
        </>
      )}
    </OutClick>
  );
};
