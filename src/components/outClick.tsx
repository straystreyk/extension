import { useCallback, useEffect, useRef, FC, ReactNode } from "react";

interface IOutClick {
  children: ReactNode;
  onClick: (e: KeyboardEvent | MouseEvent) => void;
  outboundClickEnabled?: boolean;
  className?: string;
  exceptions?: string[];
}

export const OutClick: FC<IOutClick> = ({
  children,
  onClick,
  outboundClickEnabled = true,
  className,
  exceptions,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!ref.current) return;
      const tag = (event.target as HTMLElement)?.tagName;
      const target =
        tag && tag === "path"
          ? (event.target as HTMLElement)?.closest("svg") || event.target
          : event.target;

      const isOutside = (ref: Node) => !ref.contains(target as HTMLDivElement);
      if (exceptions && exceptions.length) {
        if (
          isOutside(ref.current) &&
          !exceptions.some((item) => {
            return (target as HTMLDivElement).classList.contains(item);
          })
        ) {
          onClick(event);
        }
      } else {
        isOutside(ref.current) && onClick(event);
      }
    },
    [onClick, exceptions]
  );

  const escFunction = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClick(e);
    },
    [onClick]
  );

  useEffect(() => {
    if (outboundClickEnabled) {
      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("contextmenu", handleClickOutside, true);
      document.addEventListener("keydown", escFunction, true);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("contextmenu", handleClickOutside, true);
      document.addEventListener("keydown", escFunction, true);
    };
  }, [handleClickOutside, escFunction, outboundClickEnabled]);

  if (!outboundClickEnabled) {
    return <>{children}</>;
  }

  return (
    <div ref={ref} className={className ?? ""}>
      {children}
    </div>
  );
};
