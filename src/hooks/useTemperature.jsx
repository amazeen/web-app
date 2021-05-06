import { useEffect, useState } from 'react'
import { getTemperature, getTemperatureThreshold, realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const useTemperature = (silo) => {
  const [temperature, setTemperature] = useState(0)

  useEffect(() => {
    const init = async() => {
      setTemperature(await getTemperature(silo)) 
    }
    
    realtimeNotifier.subscribe('temperature', setTemperature)
    init()

    return () => {
      realtimeNotifier.unsubscribe('temperature', setTemperature)
    }
  }, [silo])

  return temperature
}

useTemperature.propTypes = {
  silo: PropTypes.string
}

export default useTemperature
