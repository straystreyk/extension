import {
  cloneElement,
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export interface IWizard<T> {
  step: number;
  info: T | Record<string, never>;
}

export interface IWizardChildrenOptions<T> extends IWizard<T> {
  setWizardOption: Dispatch<SetStateAction<IWizard<T>>>;
  nextStep: () => void;
  prevStep: () => void;
  resetWizard: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const Wizard = <T,>({
  children,
  initial,
  onResetWizard,
  initialForReset,
}: {
  children: ReactElement[];
  initial: IWizard<T>;
  initialForReset: IWizard<T>;
  onResetWizard?: () => void;
}) => {
  const [opts, setOpts] = useState<IWizard<T>>(initial);

  const nextStep = () => {
    setOpts((p) => ({ ...p, step: p.step + 1 }));
  };

  const prevStep = () => {
    setOpts((p) => ({ ...p, step: p.step - 1 }));
  };

  const resetWizard = () => {
    setOpts(initialForReset);
    onResetWizard && onResetWizard();
  };

  const isLastStep = opts.step === children?.length - 1;
  const isFirstStep = opts.step === 0;

  useEffect(() => {
    setOpts(initial);
  }, [initial]);

  if (!children) return null;

  return (
    <div className="wizrd">
      {cloneElement(children[opts.step], {
        wizardOptions: {
          ...opts,
          setWizardOption: setOpts,
          nextStep,
          prevStep,
          resetWizard: resetWizard,
          isLastStep,
          isFirstStep,
        },
      })}
    </div>
  );
};

export default Wizard;
