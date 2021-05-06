import PropTypes from 'prop-types'
import { useMemo } from 'react'
import Meter from './Meter'

import styles from './BlockMeter.module.scss'

const BlockMeter = ({name, className, blocks, showPercentage}) => {

  const percentage = useMemo(() => {
    const nActive = blocks.reduce((acc, active) => active ? acc + 1 : acc)
    return nActive / blocks.length * 100
  }, [blocks])

  const width = useMemo(() => {
    return (100 / blocks.length).toFixed(2) + '%'
  }, [blocks])

  return (
    <div className={styles.wrapper}>
      {name && <span>{name}</span>}
      
      <div>
        {blocks.map((active, idx) => 
          <div className={styles.block} style={{width}} key={idx}>
            <Meter className={className} value={active ? 2 : -1} displayValue={false}/> 
          </div> 
        )}
        {showPercentage && <span>{percentage.toFixed(2)}%</span>}
      </div>
      
    </div>
  )
}

BlockMeter.defaultProps = {
  className: '',
  name: null,
  blocks: [],
  showPercentage: false
}

BlockMeter.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  blocks: PropTypes.arrayOf(PropTypes.bool),
  showPercentage: PropTypes.bool
}

export default BlockMeter
