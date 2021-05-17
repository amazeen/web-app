import { useMemo } from 'react'
import PropTypes from 'prop-types'

import styles from './Meter.module.scss'

const Meter = ({className, name, low, high, value, displayValue, displayUnit}) => {
  
  const min = useMemo(() => low  - ((high - low) / 10), [high, low])
  const max = useMemo(() => high + ((high - low) / 10), [high, low])

  const width = useMemo(() => {
    const percentage = (value - min) / (max - min) * 100
    
    if(percentage < 0) return '0'
    if(percentage > 100) return '100%'
    return percentage.toFixed(2) + '%'
  }, [high, low, value])

  return (
    <div className={styles.wrapper}>
      {name && <span className={styles.name}>{name}</span>}
      <div className={styles.bar}>
        {displayValue && <span className={styles.value}>{value.toFixed(2)} {displayUnit}</span>}
        <span className={`${styles.progress} ${className}`} style={{width}}></span>
      </div>
    </div>
  )
}

Meter.defaultProps = {
  className: '',
  name: null,
  displayValue: true,
  displayUnit: null,
  low: 0,
  high: 1
}

Meter.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  displayValue: PropTypes.bool,
  displayUnit: PropTypes.string,
  low: PropTypes.number,
  high: PropTypes.number,
  value: PropTypes.number
}

export default Meter
