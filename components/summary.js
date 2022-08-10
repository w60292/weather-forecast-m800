import BarChart from '../components/bar-chart'
import PieChart from '../components/pie-chart'

export default function Summary({ data }) {
  const barChartDataConverter = (item) => {
    return [
      {
        label: 'Maximum',
        id: `${item.date}_max`,
        value: item.tempMax,
      }, 
      {
        label: 'Minimum',
        id: `${item.date}_min`,
        value: item.tempMin,
      }
    ];
  };

  return (
    <div className="daily-summary-container">
      {data.map((item) => {
        return (
          <div className="daily-container" key={item.date}>
            <span>{item.date}</span>
            <div className="daily-chart-container">
              <PieChart title="Avg. Humidity" value={item.humidityAvg} unit="%" />
              <BarChart title="Temperature (°C)" data={barChartDataConverter(item)} />
            </div>
          </div>
        )
      })}
    </div>
  );
}
