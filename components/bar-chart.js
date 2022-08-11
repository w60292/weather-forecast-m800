import { Fragment } from 'react'

/**
 * Render a bar chart with title, labels and values.
 * 
 * Usage: 
 * <BarChart 
 *  title="Chart Title" 
 *  data={your_data_array}
 *  color=#123456
 * />
 * 
 * For example, data = [{ id, value, label }, ...]
 */
export default function BarChart({ title, data, color='#16A085' }) {
  return (
    <Fragment>
      { data && data.length ? (
        <div className="bar-chart">
          <table>
            <tbody>
              <tr>
                <td colSpan={data.length} className="bar-chart-title">{title}</td>
              </tr>
              <tr className="bars">
                { data.map((item) => (
                  <td key={item.id}>
                    <span>{item.value}</span>
                    <div className="bar" style={{ 
                      '--bar-color': color,
                      height: (item.value/40*100).toFixed(2) + 'px'
                    }}/>
                    <span>{item.label}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : null }
    </Fragment>
  );
}
