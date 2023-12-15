import { ChangeEvent, useEffect, useState } from "react";

interface SearchInputProps {
  keyword: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ keyword, onChange }) => {
  const [value, setValue] = useState(keyword);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, 500);
    return () => clearTimeout(timeout);
  }, [value, onChange]);

  return (
    <input
      type="text"
      placeholder="Search store here..."
      className="rounded-lg p-2.5 bg-transparent focus:outline-blue-500  w-[400px] placeholder: text-center placeholder:text-gray-700 placeholder:font-semibold"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInput;
