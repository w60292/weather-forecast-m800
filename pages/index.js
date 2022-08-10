import fetchData from '../utils'
import { useEffect, useState, useRef } from 'react'

import Head from 'next/head'
import SearchBar from '../components/search-bar'
import BarChart from '../components/bar-chart'
import Summary from '../components/summary';

import styles from '../styles/App.module.css'

export default function App() {
  const appTitle = 'Weather Forecast';
  // Avoid loading twice while using react v18
  const initFlag = useRef(true);
  // Fetch city list from json file, and save the result for re-using.
  const [cities, setCities] = useState([]);
  const [daily, setDaily] = useState([]);
  const [maxTempList, setMaxTempList] = useState([]);
  const [minTempList, setMinTempList] = useState([]);
  const [humidityList, setHumidityList] = useState([]);
  
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
  const selectHandler = (rawData) => {
    setDaily(dailyInfoFormat(rawData));
    setMaxTempList(chartFormat(rawData, 'temp_max'));
    setMinTempList(chartFormat(rawData, 'temp_min'));
    setHumidityList(chartFormat(rawData, 'humidity'));
  };

  useEffect(() => {
    const init = async () => {
      initFlag.current = false;
      setCities(await fetchData('city.list.json'));
    };
    
    if (initFlag.current) {
      init();
    } 
  }, [cities]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{appTitle}</title>
        <meta name="description" content="Weather Forecast for M800 Web Developer" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>{`${appTitle} (UTC Time)`}</h2>
        <SearchBar data={cities} onSelect={selectHandler} />
        <Summary data={daily} />
        <BarChart title="Next 96-Hour Maximum Temperature (°C)" data={maxTempList} />
        <BarChart title="Next 96-Hour Minimum Temperature (°C)" data={minTempList} />
        <BarChart title="Next 96-Hour Humidity (%)" data={humidityList} color="#57b6d0" />
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
