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
import ContactsBook from "../assets/contactsBook.svg?react";
import Edit from "../assets/edit.svg?react";
import Import from "../assets/import.svg?react";
import Trash from "../assets/trash.svg?react";
import ArrowLeft from "../assets/arrowLeft.svg?react";

type TIcon =
  | "on"
  | "off"
  | "copy"
  | "arrowDown"
  | "arrowUp"
  | "plus"
  | "eyeLock"
  | "import"
  | "eyeOpen"
  | "key"
  | "newContact"
  | "contactsBook"
  | "download"
  | "edit"
  | "arrowLeft"
  | "trash"
  | "cross";

const iconsConfig: { [p in TIcon]: FC<{ className?: string }> } = {
  on: PowerOn,
  off: PowerOff,
  copy: Copy,
  plus: Plus,
  eyeLock: EyeLock,
  import: Import,
  eyeOpen: EyeOpen,
  key: Key,
  cross: Cross,
  arrowDown: ArrowDown,
  arrowUp: ArrowUp,
  arrowLeft: ArrowLeft,
  newContact: NewContact,
  download: Download,
  contactsBook: ContactsBook,
  edit: Edit,
  trash: Trash,
};

export const CustomIcon: FC<{ icon: TIcon; className?: string }> = ({
  icon,
  className,
}) => {
  const Component = iconsConfig[icon];

  return Component ? <Component className={className} /> : null;
};
