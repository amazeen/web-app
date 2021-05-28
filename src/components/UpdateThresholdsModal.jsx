import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import { updateThresholds } from '../services/api'

import Icon from '@mdi/react'
import { mdiArrowCollapseDown, mdiArrowCollapseUp } from '@mdi/js'

const UpdateThresholdsModal = ({area, silo, thresholds, onClose}) => {
  
  const [maxTemperature, setMaxTemperature] = useState(thresholds.maxTemperature)
  const [minTemperature, setMinTemperature] = useState(thresholds.minTemperature)

  const [maxCapacity, setMaxCapacity] = useState(thresholds.maxCapacity)
  const [minCapacity, setMinCapacity] = useState(thresholds.minCapacity)

  const [maxHumidity, setMaxHumidity] = useState(thresholds.maxHumidity)
  const [minHumidity, setMinHumidity] = useState(thresholds.minHumidity)

  const [maxPressure, setMaxPressure] = useState(thresholds.maxPressure)
  const [minPressure, setMinPressure] = useState(thresholds.minPressure)

  const [loading, setLoading] = useState(false)

  const handleClick = async() => {
    setLoading(true)
    try{
      
      await updateThresholds(area, silo, {maxPressure, minPressure, maxCapacity, minCapacity, maxHumidity, minHumidity, minTemperature, maxTemperature})
    }
    catch(err) {
      console.log('Error updating thresholds: ' + err)
    }
    setLoading(false)
    onClose()
  }

  return (
    <div className="modal is-active p-5">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Update thresholds</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">

          <div className="card-content">
          <div className="is-hidden-mobile columns">
            <div className="column">
              <div className="subtitle is-4">Fields</div>
            </div>
            <div className="column">
              <div className="subtitle is-4">Minimum</div>
            </div>
            <div className="column">
              <div className="subtitle is-4">Maximum</div>
            </div>
          </div>

          <div className="field is-horizontal is-mobile">

            <div className="field-label is-normal">
              <label className="label">Temperature</label>
            </div>

            <div className="field-body">
              
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={minTemperature} onChange={(e) => setMinTemperature(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseDown} size={1}/>
                  </span>
                </div>
              </div>

              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={maxTemperature} onChange={(e) => setMaxTemperature(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseUp} size={1}/>
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="field is-horizontal is-mobile">

            <div className="field-label is-normal">
              <label className="label">Capacity</label>
            </div>

            <div className="field-body">
              
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={minCapacity} onChange={(e) => setMinCapacity(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseDown} size={1}/>
                  </span>
                </div>
              </div>

              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseUp} size={1}/>
                  </span>
                </div>
              </div>

            </div>
            
          </div>
          
          <div className="field is-horizontal is-mobile">

            <div className="field-label is-normal">
              <label className="label">Humidity</label>
            </div>

            <div className="field-body">
              
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={minHumidity} onChange={(e) => setMinHumidity(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseDown} size={1}/>
                  </span>
                </div>
              </div>

              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={maxHumidity} onChange={(e) => setMaxHumidity(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseUp} size={1}/>
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="field is-horizontal is-mobile">

            <div className="field-label is-normal">
              <label className="label">Pressure</label>
            </div>

            <div className="field-body">
              
              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={minPressure} onChange={(e) => setMinPressure(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseDown} size={1}/>
                  </span>
                </div>
              </div>

              <div className="field">
                <div className="control has-icons-left">
                  <input className="input" type="number" value={maxPressure} onChange={(e) => setMaxPressure(e.target.value)}/>
                  <span className="icon is-small is-left">
                    <Icon path={mdiArrowCollapseUp} size={1}/>
                  </span>
                </div>
              </div>

            </div>

          </div>

          </div>
        </section>

        <section className="modal-card-foot">
          <button className={`button is-primary ${loading && 'is-loading'}`} onClick={handleClick} disabled={loading}>Update</button>
          <button className="button" onClick={onClose}>Cancel</button>
        </section>
      </div>
    </div>
  )
}

UpdateThresholdsModal.defaultProps = {
  silo: '',
  area: '',
  thresholds: {},
  onClose: () => {}
}

UpdateThresholdsModal.propTypes = {
  silo: PropTypes.string,
  area: PropTypes.string,
  thresholds: PropTypes.object,
  onClose: PropTypes.func
}

export default UpdateThresholdsModal
