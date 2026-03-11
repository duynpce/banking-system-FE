import clsx from 'clsx';
type InputWithLabelProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  blockClassName?: string;
};

const InputWithLabel = ({ label, className, blockClassName, ...props }: InputWithLabelProps) => {
  return (
    <div className={clsx("flex flex-col gap-1", blockClassName)}>
      <label >
        {label}
      </label>
      <input className={clsx(className)} {...props}
        
      />
    </div>
  );
};

export default InputWithLabel;