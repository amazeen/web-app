import { useState } from 'react'
import { login } from '../services/api'

import Icon from '@mdi/react'
import { mdiKeyVariant, mdiAccount } from '@mdi/js'

import styles from './Login.module.scss'
import Notification from '../components/Notification'

import logo from '../assets/logo.png'

const Login = () => {
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClick = async() => {
    setLoading(true)
    try{
      await login(username,password)
    }
    catch(err) {
      setLoading(false)
      setError(String(err))
      setTimeout(() => setError(''),3000)
    }
    setLoading(false)
  }

  const handleClose = async() => setError('')
  
  return (
    <div className={`level ${styles.container}`}>

        <div className="level-item has-text-centered mt-5-mobile">
          <div className={styles.company}>
            <figure className="image">
              <img src={logo}/>
            </figure>
            <span className="is-size-2 has-text-weight-bold">Sioux Silos</span>
          </div>
        </div>

        <div className="level-item has-text-centered">

          <div className={`box ${styles.login}`}>

            <div className="field control has-icons-left">
              <span className="icon is-small is-left">
                <Icon path={mdiAccount} size={1}/>
              </span>
              <input className="input" type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div className="field control has-icons-left">
              <span className="icon is-small is-left">
                <Icon path={mdiKeyVariant} size={1}/>
              </span>
              <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className="has-text-centered">
              <button className={`control button is-primary ${loading && 'is-loading'}`} onClick={handleClick} disabled={loading}>Login</button>
            </div>

          </div>

      </div>
      
      {error && <Notification className="is-danger is-light" onClose={handleClose}>{error}</Notification>}
    </div>
  )
}

export default Login
