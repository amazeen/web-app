import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getAreas } from '../services/api'

import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'

import styles from './Sidebar.module.scss'
import logo from '../assets/logo.png'


const Sidebar = ({onClose}) => {
  
  const location = useLocation()
  const [areas, setAreas] = useState([]) 

  const getAreasSafe = async () => {

    try{
      const data = await getAreas()
      data.sort((a, b) => a.id - b.id)
      setAreas(data)
    }
    catch(err){
      console.log('Error retrieving areas: ' + err)
    }
  }

  useEffect(() => {
    getAreasSafe()
  },[])

  //TODO: More Colors
  return (
    <div className={`m-5 ${styles.menu}`}>
      
      <span className={`icon is-clickable ${styles.close}`} onClick={onClose}>
        <Icon path={mdiClose}/>
      </span>

      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <figure className="image is-96x96">
              <img src={logo}/>
            </figure>
          </div>

          <div className="level-item">
            <span className="is-size-5 has-text-weight-bold has-text-grey">Sioux Silos</span>
          </div>
        </div>
      </div>

      <div className="menu">

        {areas.map((area, idx) => 
          <React.Fragment key={idx}>
            <p className="menu-label is-size-6 has-text-weight-bold"> Area {area.id}</p>
            <ul className="menu-list">
              {area.silos.map((silo, idx) => {
                const link = `/area/${area.id}/silo/${silo}`
                return <li key={idx}>
                  <Link className={ location.pathname == link ? 'is-active' : ''} to={link}>Silo {silo}</Link>
                </li>
              })}
            </ul>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

Sidebar.defaultProps = {
  onClose: () => {},
}

Sidebar.propTypes = {
  onClose: PropTypes.func,
}

export default Sidebar
