import { FC } from "react";
import PowerOn from "../assets/on.svg?react";
import PowerOff from "../assets/off.svg?react";
import Copy from "../assets/copy.svg?react";
import Plus from "../assets/plus.svg?react";

type TIcon = "on" | "off" | "copy" | "plus";

const iconsConfig: { [p in TIcon]: FC<{ className?: string }> } = {
  on: PowerOn,
  off: PowerOff,
  copy: Copy,
  plus: Plus,
};

export const CustomIcon: FC<{ icon: TIcon; className?: string }> = ({
  icon,
  className,
}) => {
  const Component = iconsConfig[icon];

  return Component ? <Component className={className} /> : null;
};
