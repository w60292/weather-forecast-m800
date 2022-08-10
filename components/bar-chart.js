import { Fragment } from 'react'

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
