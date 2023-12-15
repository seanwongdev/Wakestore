interface SearchBarProps {
  isOpen: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 flex items-top z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {" "}
      </div>

      <div
        className={`bg-white p-8 w-[500px] h-full overflow-y-auto transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-400`}
      >
        test
      </div>
    </>
  );
};
export default SearchBar;
