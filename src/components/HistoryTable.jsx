import { useEffect, useState } from 'react'
import { getHistory } from '../services/api'

import PropTypes from 'prop-types'

const HistoryTable = ({area, silo}) => {
  
  const [history, setHistory] = useState([])

  const getHistorySafe = async() => {
      
    try{
      setHistory(await getHistory(area, silo))
    }
    catch(err) {
      console.log('Error retrieving history: ' + err)
    }
  }

  useEffect(() => {
    getHistorySafe()
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
              <td>{row.time}</td>
              <td>{row.temperature}</td>
              <td>{row.pressure}</td>
              <td>{row.humidity}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

HistoryTable.defaultProps = {
  silo: '',
  area: '',
}

HistoryTable.propTypes = {
  silo: PropTypes.string,
  area: PropTypes.string,
}


export default HistoryTable
