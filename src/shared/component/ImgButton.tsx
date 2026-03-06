import clsx from "clsx";

type ImgButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  src: string;
  alt: string;
};

const ImgButton = ({ src, alt, className, ...props }: ImgButtonProps) => {
  return (
    <button className={clsx("cursor-pointer", className)} {...props}>
      <img src={src} alt={alt} className="w-full h-full" />
    </button>
  );
};

export default ImgButton;