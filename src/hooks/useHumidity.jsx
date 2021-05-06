import { useEffect, useState } from 'react'
import { getHumidity, getHumidityThreshold, realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const useHumidity = (silo) => {
  const [humidity, setHumidity] = useState(0)

  useEffect(() => {
    const init = async() => {
      setHumidity(await getHumidity(silo)) 
    }
    
    realtimeNotifier.subscribe('humidity', setHumidity)
    init()

    return () => {
      realtimeNotifier.unsubscribe('humidity', setHumidity)
    }
  }, [silo])

  return humidity
}

useHumidity.propTypes = {
  silo: PropTypes.string
}

export default useHumidity
