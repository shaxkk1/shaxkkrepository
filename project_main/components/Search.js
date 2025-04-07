function Search() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/veterans/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="search-container">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search veterans..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {results.map(veteran => (
        <div key={veteran.id} className="search-result">
          <h3>{veteran.name}</h3>
          <p>{veteran.branch}</p>
        </div>
      ))}
    </div>
  );
}