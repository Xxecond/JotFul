 function SearchBar({ setSearchTerm }) {
  return (
    <div className="w-full flex justify-center mt-6">
      <input
        type="text"
        placeholder="Search blogs..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-80 md:w-96 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );
}

export default SearchBar;
