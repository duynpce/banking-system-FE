import type { ImgButtonProps } from "../../types/ImgButtonProps";

const ImgButton = ({ src, alt, className, ...props }: ImgButtonProps) => {
  return (
    <button className={className} {...props}>
      <img src={src} alt={alt} className="w-full h-full" />
    </button>
  );
};

export default ImgButton;