import { FC } from "react";
import PowerOn from "../assets/on.svg?react";
import PowerOff from "../assets/off.svg?react";
import Copy from "../assets/copy.svg?react";
import Plus from "../assets/plus.svg?react";
import EyeLock from "../assets/eyeLock.svg?react";
import EyeOpen from "../assets/eyeOpen.svg?react";
import Cross from "../assets/cross.svg?react";
import Key from "../assets/key.svg?react";
import ArrowUp from "../assets/arrowUp.svg?react";
import ArrowDown from "../assets/arrowDown.svg?react";
import NewContact from "../assets/newContact.svg?react";
import Download from "../assets/download.svg?react";

type TIcon =
  | "on"
  | "off"
  | "copy"
  | "arrowDown"
  | "arrowUp"
  | "plus"
  | "eyeLock"
  | "eyeOpen"
  | "key"
  | "newContact"
  | "download"
  | "cross";

const iconsConfig: { [p in TIcon]: FC<{ className?: string }> } = {
  on: PowerOn,
  off: PowerOff,
  copy: Copy,
  plus: Plus,
  eyeLock: EyeLock,
  eyeOpen: EyeOpen,
  key: Key,
  cross: Cross,
  arrowDown: ArrowDown,
  arrowUp: ArrowUp,
  newContact: NewContact,
  download: Download,
};

export const CustomIcon: FC<{ icon: TIcon; className?: string }> = ({
  icon,
  className,
}) => {
  const Component = iconsConfig[icon];

  return Component ? <Component className={className} /> : null;
};
