import { render } from '@testing-library/react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import useAuth from '../hooks/useAuth'
import { logout } from '../services/api'

import Icon from '@mdi/react'
import { mdiMenu, mdiAccount } from '@mdi/js'

const Topbar = ({onMenuClicked}) => {

  const [loggedIn, username] = useAuth()

  const history = useHistory()

  const handleLogout  = () => {
    history.push('/')
    logout()
  }

  return (
    <nav className="box level p-4 is-mobile navbar is-fixed-top">

      <div className="level-left">

        <div className="level-item">
          <span className="icon is-clickable">
            <Icon onClick={onMenuClicked} path={mdiMenu}/>
          </span>
        </div>

      </div>
      
      <div className="level-right">

        <div className="level-item mr-5">
          <span className="icon">
            <Icon path={mdiAccount}/>
          </span>
          
          {/* TODO: remove fake username */}
          <span className="has-text-weight-bold">{username ? username : 'fake user'}</span>
        </div>

        <div className="level-item">
          <button className="button is-light" onClick={handleLogout}>Logout</button>
        </div>

      </div>

    </nav>
  )
}

Topbar.defaultProps = {
  onMenuClicked: () => {},
}

Topbar.propTypes = {
  onMenuClicked: PropTypes.func,
}

export default Topbar
