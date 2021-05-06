import { useEffect, useState } from 'react'
import { realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const useAlarm = (silo) => {
  const [alarm, setAlarm] = useState('')

  useEffect(() => { 
    realtimeNotifier.subscribe('alarm', setAlarm)

    return () => {
      realtimeNotifier.unsubscribe('alarm', setAlarm)
    }
  }, [silo])

  return alarm
}

useAlarm.propTypes = {
  silo: PropTypes.string
}

export default useAlarm
