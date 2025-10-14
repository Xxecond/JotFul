 function SearchBar({ setSearchTerm }) {
  return (
    <div className=" text-white flex justify-end mt-5 pr-5">
      <input
        type="search"
        placeholder="Search blogs..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-50 md:w-60 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );
}

export default SearchBar;
