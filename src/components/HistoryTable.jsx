import { useEffect, useState } from 'react'
import { getHistory } from '../services/api'

import PropTypes from 'prop-types'

const HistoryTable = ({silo}) => {
  
  const [history, setHistory] = useState([])

  useEffect(() => {
    const init = async() => {
      setHistory(await getHistory(silo))
    }

    init()
  }, [silo])

  return(
    <div className="table-container">
      <table className="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temperature Avg.</th>
            <th>Pressure Avg.</th>
            <th>Humidity Avg.</th>
          </tr>
        </thead>
        <tbody>
          {history.map((row, idx) => 
            <tr key={idx}>
              <td>{row.date}</td>
              <td>{row.average_temperature}</td>
              <td>{row.average_pressure}</td>
              <td>{row.average_humidity}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

HistoryTable.defaultProps = {
  silo: '',
}

HistoryTable.propTypes = {
  silo: PropTypes.string,
}


export default HistoryTable
