import React, { useState, useEffect } from 'react';

const Search = (props) => {
  const [searchType, setSearchType] = useState(props?.searchType ?? "");
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    // props.searchValue(e.target.value);
    setSearch(e.target.value);
  };

  const clickSearch = () => {
    props.searchValue(search);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchType("");
    props.searchValue("");
    props.refetcher();
  };

  useEffect(() => {
    setSearchType(props?.searchType ?? "");
  }, [props?.searchType])

  return (
    <form
      method='POST'
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name='formName'
      className='center'
    >
      <label>
        <span>Search {searchType}: </span>
        <input
          autoComplete='off'
          type='text'
          name='searchTerm'
          onChange={handleChange}
        />
      </label>
      <button className="marvel-alt" onClick={clickSearch}>Search</button>
      <button className="marvel-alt" onClick={clearSearch}>Clear</button>
    </form>
  );
};

export default Search;
