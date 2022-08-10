import { useEffect, useState } from 'react'
import fetchData from '../utils'

export default function SearchBar({ data, onSelect }) {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);

  const filterCities = (searchText) => {
    return searchText 
      ? data.filter((item) => item.name.startsWith(searchText))
      : [];
  };
  const summaryFormatter = (raw) => {
    const results = raw.list;

    if (results) {
      return results.map(r => {
        const [date, time] = r.dt_txt.split(' ');
        const [_, month, day] = date.split('-');
        const [hour, minute] = time.split(':')
        return {
          "dt": r.dt,
          "dt_txt": `${month}/${day} ${hour}:${minute}`, 
          "temp_min": r.main.temp_min.toFixed(1),
          "temp_max": r.main.temp_max.toFixed(1),
          "humidity": r.main.humidity,
        };
      });
    }
  };
  const getForecastData = (coord) => {
    const isMock = false;
    const endpoint = 'https://api.openweathermap.org/data/2.5/forecast';
    const { lon, lat } = coord;
    const cnt = 24 / 3 * 4;
    const key = 'a59dbadd28f7a73ac53a69f49ca4b950';
    const url = isMock 
      ? `/mockdata.json`
      : `${endpoint}?lat=${lat}&lon=${lon}&units=metric&cnt=${cnt}&appid=${key}`;

    return fetchData(url, summaryFormatter);
  };

  const clickHandler = (event) => {
    const li = event.target;
    const item = JSON.parse(li.dataset.city);
    
    setSearch(li.textContent);
    getForecastData(item.coord).then(list => onSelect(list));
  };

  useEffect(() => {
    setOptions(filterCities(search));
  }, [search]);

  return (
    <div>
      <div className="city-input-container">
        <label htmlFor="city">City Name:</label>
        <input 
          type="search" 
          id="city" 
          placeholder="Please fill in a city name, e.g. Taipei"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
        />
      </div>
      <div className="city-item-container">
        <ul>
          {options.map((city) => (
            <li key={city.id} data-city={JSON.stringify(city)} onClick={clickHandler}>{`${city.name} (${city.country})`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
