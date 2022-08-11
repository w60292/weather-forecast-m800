import { useEffect, useState } from 'react'
import fetchData from '../utils'

/**
 * Search Bar Component with a label and select handler, providing
 * you to input text and list matched selection.
 * 
 * Usage:
 * <SearchBar 
 *  id="your_id" 
 *  label="your_label" 
 *  placeholder="your_placeholder" 
 *  data={your_array} 
 *  filterField="field_name_for_filtering"
 *  handleSelect={selectHandlerFunc} 
 * />
 * 
 * Required Data Format: 
 *  [{ id, name, display }, ...]
 */
export default function SearchBar({ 
  id, 
  label, 
  placeholder, 
  data,
  filterField, 
  handleSelect,
}) {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);

  const filterOptions = (searchText) => {
    // ignore case for filtering
    const lowCaseText = searchText.toLowerCase();
    return searchText 
      ? data.filter((item) => item[filterField].toLowerCase().startsWith(lowCaseText))
      : [];
  };

  useEffect(() => {
    setOptions(filterOptions(search));
  }, [search]);

  return (
    <div>
      <div className={`search-input-container`}>
        <label htmlFor={id}>{label}</label>
        <input 
          type="search" 
          id={id} 
          placeholder={placeholder}
          onChange={(event) => setSearch(event.target.value)}
          value={search}
        />
      </div>
      { (options.length > 0) ? (
          <div className={`search-item-container`}>
            <ul>
              {options.map((item) => (
                <li 
                  key={item.id} 
                  data-item={JSON.stringify(item)} 
                  onClick={(event) => handleSelect(event, setSearch)}
                >{item.display}</li>
              ))}
            </ul>
          </div>
        ) : null
      }
    </div>
  );
}
