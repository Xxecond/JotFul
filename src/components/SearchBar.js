 function SearchBar({ setSearchTerm }) {
  return (
    <div className=" text-white flex justify-end mt-5 pr-5">
      <input
        type="search"
        placeholder="Search blogs..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-50 placeholder:text-black text-black md:w-60 px-4 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
      />
    </div>
  );
}

export default SearchBar;
