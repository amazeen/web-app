import { mdiCog } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import BlockMeter from '../components/BlockMeter'
import HistoryTable from '../components/HistoryTable'
import Meter from '../components/Meter'
import Notification from '../components/Notification'
import UpdateThresholdsModal from '../components/UpdateThresholdsModal'

import useAlarm from '../hooks/useAlarm'
import useCapacity from '../hooks/useCapacity'
import useHumidity from '../hooks/useHumidity'
import usePressure from '../hooks/usePressure'
import useTemperature from '../hooks/useTemperature'

import { getThresholds, receiveSiloEvents, stopReceivingSiloEvents } from '../services/api'

const SiloDashboard = () => {

  const {silo, area} = useParams()

  const temperature = useTemperature(area, silo)
  const humidity    = useHumidity(area, silo)
  const pressure    = usePressure(area, silo)

  const [capacity, capacityArr] = useCapacity(area, silo)
  
  const alarm = useAlarm()

  const [thresholds, setThresholds] = useState({})

  const [modalVisible, setModalVisible] = useState(false)
  const [notificationVisible, setNotificationVisible] = useState(false)

  useEffect(() => {
    setNotificationVisible(true)
  },[alarm])

  useEffect(() => {
    
    const init = async() => {
      setThresholds(await getThresholds(area, silo))
    }

    receiveSiloEvents(silo)
    init()

    return () => {
      stopReceivingSiloEvents(silo)
    }
  }, [silo])

  const handleShowModal  = () => setModalVisible(true)
  const handleCloseModal = async () => {
    setModalVisible(false)
    setThresholds(await getThresholds(area, silo))
  }
  
  const handleCloseNotification = () => setNotificationVisible(false)

  return (
    <>
    <div className="section">

      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title">Silo {silo}</h1>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button className="button" onClick={handleShowModal}>
              <span className="icon">
                <Icon path={mdiCog}/>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <Meter name="Temperature" value={temperature} high={thresholds.maxTemperature} low={thresholds.minTemperature} displayUnit="°C"/>
        </div>
        <div className="column">
          <Meter name="Humidity" value={humidity} high={thresholds.maxHumidity} low={thresholds.minHumidity} displayUnit="g/m^3"/>
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <Meter name="Pressure" value={pressure} high={thresholds.maxPressure} low={thresholds.minPressure} displayUnit="hPa"/>
        </div>
        <div className="column">
          <BlockMeter name="Capacity" blocks={capacityArr}/>
        </div>
      </div>

      <h2 className="subtitle is-4">History</h2>
      <HistoryTable silo={silo} area={area} />


      {notificationVisible && alarm && <Notification className="is-danger is-light" onClose={handleCloseNotification}>{alarm}</Notification>}

      {/* TODO: remove */}
      <Notification className="is-danger is-light">TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION TEST ALARM NOTIFICATION</Notification>

      </div>
    {modalVisible && <UpdateThresholdsModal silo={silo} area={area} thresholds={thresholds} onClose={handleCloseModal}/>}
    </>
    
  )
}

export default SiloDashboard
