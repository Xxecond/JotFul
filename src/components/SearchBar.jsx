 function SearchBar({ setSearchTerm }) {
  return (
    <div className=" flex justify-end mt-5 pr-5">
      <input
        type="search"
        placeholder="Search blogs..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-1/3  placeholder:text-black dark:placeholder:text-white text-black dark:text-white px-4 border border-black dark:border-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition"
      />
    </div>
  );
}

export default SearchBar;
