import { Fragment } from 'react'

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
