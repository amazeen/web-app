import { useEffect, useState } from 'react'
import { getPressure, getPressureThreshold, realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const usePressure = (area, silo) => {
  const [pressure, setPressure] = useState(0)

  useEffect(() => {
    const init = async() => {
      try{
        setPressure(await getPressure(area, silo)) 
      }
      catch(err) {
        console.log('Error retrieving pressure: ' + err)
      }
    }
    
    realtimeNotifier.subscribe('pressure', setPressure)
    init()

    return () => {
      realtimeNotifier.unsubscribe('pressure', setPressure)
    }
  }, [silo])

  return pressure
}

usePressure.propTypes = {
  silo: PropTypes.string,
  area: PropTypes.string
}


export default usePressure
