import { useEffect, useState } from 'react'
import { getHumidity, getHumidityThreshold, realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const useHumidity = (area, silo) => {
  const [humidity, setHumidity] = useState(0)

  useEffect(() => {
    const init = async() => {
      try{
        setHumidity(await getHumidity(area, silo)) 
      }
      catch(err) {
        console.log('Error retrieving humidity: ' + err)
      }
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
  silo: PropTypes.string,
  area: PropTypes.string
}

export default useHumidity
