import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import SearchBar from '../components/search-bar'
import BarChart from '../components/bar-chart'
import fetchData from '../utils'
import styles from '../styles/Home.module.css'

export default function Home() {
  const appTitle = 'Weather Forecast';
  // Avoid loading twice while using react v18
  const initFlag = useRef(true);
  // Fetch city list from json file, and save the result for re-using.
  const [cities, setCities] = useState([]);
  const [daily, setDaily] = useState([]);
  const [maxTempList, setMaxTempList] = useState([]);
  const [minTempList, setMinTempList] = useState([]);
  const [humidityList, setHumidityList] = useState([]);
  
  const chartFormat = (rawData, valueField) => {
    return rawData.map((item) => {
      return {
        id: item.dt,
        value: item[valueField],
        label: item.dt_txt,
      };
    });
  };
  const dailyInfoFormat = (rawData) => {
    const hashMap = new Map();
    let dailyInfo = [];

    rawData.forEach((item) => {
      const [key] = item.dt_txt.split(' '); // Use date as the key
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
        <h2 className={styles.title}>{appTitle}</h2>
        <SearchBar data={cities} onSelect={selectHandler} />
        <div className="daily-summary-container">
          {daily.map((item) => {
            const dailyTemp = [{
              id: `${item.date}_max`,
              value: item.tempMax,
              label: 'Maximum',
            }, {
              id: `${item.date}_min`,
              value: item.tempMin,
              label: 'Minimum',
            }]
            return (
              <div className="daily-container" key={item.date}>
                <span>{item.date}</span>
                <div className="daily-chart-container">
                  <p>Avg. Humidity</p>
                  <div className="pie-chart" style={{ '--pie-value': item.humidityAvg + '%' }}>{item.humidityAvg}%</div>
                  <BarChart title="Temperature (°C)" data={dailyTemp} />
                </div>
              </div>
            )
          })}
        </div>
        {/* <BarChart title="4-Day Maximum Temperature (°C)" data={maxTempList} />
        <BarChart title="4-Day Minimum Temperature (°C)" data={minTempList} />
        <BarChart title="4-Day Humidity (%)" data={humidityList} /> */}
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
