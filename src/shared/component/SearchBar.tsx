
import type { FormProps } from 'react-router-dom';
import ImgButton from './ImgButton';
import clsx from 'clsx';

 type SearchBarProps = FormProps & {
  placeHolder?: string;
}
const SearchBar = ({ placeHolder, className, ...props }: SearchBarProps) => {
  return (
    <form className={clsx("relative h-full border border-gray-300 rounded-3xl",className)} {...props}>
      <input
        type="text"
        placeholder={placeHolder || "Search"}
        className="w-full h-full pl-10 pr-4 rounded-3xl focus:outline-none"
      />
      <ImgButton src="/src/assets/icon/search.svg" type="submit" alt="Search" className="absolute left-2 top-1/2 transform -translate-y-1/2"/>
    </form>
  )
}

export default SearchBar; 