import { useEffect, useState } from 'react'
import { getPressure, getPressureThreshold, realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const usePressure = (silo) => {
  const [pressure, setPressure] = useState(0)

  useEffect(() => {
    const init = async() => {
      setPressure(await getPressure(silo)) 
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
  silo: PropTypes.string
}


export default usePressure
