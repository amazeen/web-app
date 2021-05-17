import { useEffect, useState } from 'react'
import { getTemperature, getTemperatureThreshold, realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const useTemperature = (area, silo) => {
  const [temperature, setTemperature] = useState(0)

  useEffect(() => {
    const init = async() => {
      try{
        setTemperature(await getTemperature(area, silo)) 
      }
      catch(err) {
        console.log('Error retrieving temperature: ' + err)
      }
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
  silo: PropTypes.string,
  area: PropTypes.string
}

export default useTemperature
