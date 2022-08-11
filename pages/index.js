import fetchData from '../utils'
import { createRef, useEffect, useState, useReducer, useRef } from 'react'

import Head from 'next/head'
import SearchBar from '../components/search-bar'
import BarChart from '../components/bar-chart'
import Summary from '../components/summary';

import styles from '../styles/App.module.css'

export default function App() {
  const appTitle = 'Weather Forecast';
  // Avoid loading twice while using react v18+
  const initFlag = useRef(true);
  const initialState = {
    cities: [],
    daily: [],
    maxTempList: [],
    minTempList: [],
    humidityList: [],
  };

  // Fetch city list from json (source: https://bulk.openweathermap.org/sample/)
  const getCityList = async () => {
    const converter = (rawData) => {
      // Add the display field for combobox.
      return rawData.map((item) => {
        return {
          ...item,
          display: `${item.name} (${item.country})`,
        };
      });
    };
    return await fetchData('city.list.json', converter);
  };

  // Convert raw data for bar chart. 
  const chartFormat = (rawData, valueField) => {
    return rawData.map((item) => {
      return {
        id: item.dt,
        value: item[valueField],
        label: item.dt_txt,
      };
    });
  };

  // Covert raw data for daily summary, such as max/min temperature and average humidity.
  const dailyInfoFormat = (rawData) => {
    const hashMap = new Map();
    let dailyInfo = [];

    // Use date as the key and compute the max/min temperature and average humidity.
    rawData.forEach((item) => {
      const [key] = item.dt_txt.split(' ');
      const data = hashMap.get(key);

      if (data) {
        hashMap.set(key, {
          ...data,
          count: data.count + 1,
          humiditySum: data.humiditySum + item.humidity,
          tempMax: (item.temp_max > data.tempMax) ? item.temp_max : data.tempMax,
          tempMin: (item.temp_min < data.tempMax) ? item.temp_min : data.tempMin,
        });
      } else {
        hashMap.set(key, {
          count: 1,
          date: key,
          humiditySum: item.humidity,
          tempMax: item.temp_max,
          tempMin: item.temp_min,
        });
      }
    });
    
    dailyInfo = [...hashMap.entries()].map(([date, item]) => {
      return {
        date,
        humidityAvg: Math.round(item.humiditySum/item.count),
        ...item,
      };
    });

    return dailyInfo;
  };

  const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
      case 'GET_CITY': {
        
        return {
          ...state,
          cities: payload,
        };
      }
      case 'RENDER_REPORT':
        return {
          ...state,
          daily: dailyInfoFormat(payload),
          maxTempList: chartFormat(payload, 'temp_max'),
          minTempList: chartFormat(payload, 'temp_min'),
          humidityList: chartFormat(payload, 'humidity'),
        };
      default:
        break;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  // Convert data for daily summary report.
  const summaryDataConverter = (raw) => {
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

  // Fetch 4-day forecast data from OpenWeather API when isMock is false; 
  // Otherwise, using mockData for dev.
  const getForecastData = (coord) => {
    const isMock = false;
    const endpoint = 'https://api.openweathermap.org/data/2.5/forecast';
    const { lon, lat } = coord;
    const cnt = 24 / 3 * 4;
    const key = 'a59dbadd28f7a73ac53a69f49ca4b950';
    const url = isMock 
      ? `/mockdata.json`
      : `${endpoint}?lat=${lat}&lon=${lon}&units=metric&cnt=${cnt}&appid=${key}`;

    return fetchData(url, summaryDataConverter);
  };

  const searchSelectHandler = (event, setInput) => {
    const li = event.target;
    const item = JSON.parse(li.dataset.item);
    
    setInput(li.textContent);
    getForecastData(item.coord).then(list => dispatch({ type: 'RENDER_REPORT', payload: list }));
  };

  useEffect(() => {
    const init = async () => {
      const cities = await getCityList();
      
      initFlag.current = false;
      dispatch({ type: 'GET_CITY', payload: cities });
    };
    
    if (initFlag.current) {
      init();
    } 
  }, [state.cities]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{appTitle}</title>
        <meta name="description" content="Weather Forecast for M800 Web Developer" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>{`${appTitle} (UTC Time)`}</h2>
        <SearchBar 
          id="city" 
          label="City Name:" 
          placeholder="Please fill in a city name, e.g. Taipei" 
          data={state.cities} 
          filterField="name"
          handleSelect={searchSelectHandler} 
        />
        <Summary data={state.daily} />
        <BarChart title="Next 96-Hour Maximum Temperature (°C)" data={state.maxTempList} />
        <BarChart title="Next 96-Hour Minimum Temperature (°C)" data={state.minTempList} />
        <BarChart title="Next 96-Hour Humidity (%)" data={state.humidityList} color="#57b6d0" />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/w60292/weather-forecast-m800"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Robin Wu @ 2022
        </a>
      </footer>
    </div>
  )
}
