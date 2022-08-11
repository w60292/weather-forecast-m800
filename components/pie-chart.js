import { Fragment } from 'react'

/**
 * Render a pie chart with a title and a value.
 * 
 * Usage:
 * <PieChart 
 *  title="Pie Chart Title" 
 *  value={float_number} 
 *  unit="%" 
 *  color="#123456"
 * />
 */
export default function PieChart({ title, value, unit, color='#57b6d0' }) {
  return (
    <Fragment>
      <p>{title}</p>
      <div 
        className="pie-chart" 
        style={{ 
          '--pie-color': color,
          '--pie-value': value + '%' 
        }}
      >
        {value}{unit}
      </div>
    </Fragment>
  );
}
