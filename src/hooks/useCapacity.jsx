import { useEffect, useMemo, useState } from 'react'
import { getCapacity, getCapacityThreshold, realtimeNotifier } from '../services/api'
import PropTypes from 'prop-types'

const useCapacity = (area, silo) => {
  const [changed, setChanged] = useState({value: 0, active: false})
  const [capacityArray, setCapacityArray] = useState(Array(8).fill(false))
  
  const calcPercentage = (arr) => {
    const last = arr.lastIndexOf(true)
    const length = arr.length
    return last / length * 100
  }

  const capacity = useMemo(() => calcPercentage(capacityArray), [capacityArray])

  useEffect(() => {
    const increment = 100 / capacityArray.length
    const idx = Math.ceil(changed.value / increment) - 1
    const newArray = [...capacityArray]
    newArray[idx] = changed.active
    setCapacityArray(newArray)

  },[changed])


  useEffect(() => {
    
    const init = async () => {
      let capacity = 0
      try {
        capacity = await getCapacity(area, silo)
      }
      catch(err){
        console.log('Error retrieving capacity: '+ err)
      }

      const increment = 100 / capacityArray.length
      const idx = Math.ceil(capacity / increment) - 1
      const newArray = capacityArray.map((el, i) => i <= idx ? true : false)
      setCapacityArray(newArray) 
    }
    
    realtimeNotifier.subscribe('capacity', setChanged)
    init()

    return () => {
      realtimeNotifier.unsubscribe('capacity', setChanged)
    }
  }, [silo])

  return [capacity, capacityArray]
}

useCapacity.propTypes = {
  silo: PropTypes.string,
  area: PropTypes.string
}

export default useCapacity
