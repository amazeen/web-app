import { useEffect, useState, useMemo } from 'react'
import { realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

//TODO: refactor

const useAlarm = (silo) => {
  const [alarm, setAlarm] = useState({value: '', type: ''})

  const msg = useMemo(() => {
    if(alarm.type) return 'Threshold Reached: '+ alarm.type + ' ' + alarm.value
    else return alarm.value
  }, [alarm])

  useEffect(() => { 
    realtimeNotifier.subscribe('alarm', setAlarm)

    return () => {
      realtimeNotifier.unsubscribe('alarm', setAlarm)
    }
  }, [silo])

  return msg
}

useAlarm.propTypes = {
  silo: PropTypes.string
}

export default useAlarm
