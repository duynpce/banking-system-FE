import clsx from "clsx";

type CardProps = {
  title: string;
  children?: React.ReactNode;
  innerClassName?: string;
 } & React.HTMLAttributes<HTMLDivElement>;

const Card = ({ title, className, innerClassName, children, ...props }: CardProps) => {
  return (
    <div className={clsx(className)} {...props}>
      <h1 className="text-xl mb-3">{title}</h1>
      <div className={clsx("p-4 rounded-3xl", innerClassName)}>
        {children}
      </div>
    </div>
  );
};

export default Card;