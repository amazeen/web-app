import { useEffect, useState } from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import useAuth from './hooks/useAuth'
import Login from './pages/Login'
import SiloDashboard from './pages/SiloDashboard'

import styles from './App.module.scss'
import Topbar from './components/Topbar'
import Info from './pages/Info'

const App = () => {

  const [loggedIn, username] = useAuth()
  const [showSideBar, setShowSideBar]  = useState(true)  

  const handleToggleBar = () => setShowSideBar(!showSideBar)
  const handleCloseBar  = () => setShowSideBar(false)

  if(!loggedIn) {
    document.body.classList.remove('has-navbar-fixed-top')
    return <Login />
  }

  document.body.classList.add('has-navbar-fixed-top')

  return (
    <BrowserRouter>

      {showSideBar &&
        <div className={styles.sidebar}>
          <Sidebar onClose={handleCloseBar}/>
        </div>
      }

      <div className={showSideBar ? styles.pad : ''}>
        
        <Topbar onMenuClicked={handleToggleBar}/>

        <Switch>
          <Route exact path="/">
            <Info>Select a silo</Info>
          </Route>
          <Route exact path="/area/:area/silo/:silo">
            <SiloDashboard/>
          </Route>
          <Route path="*">
            <Info>Page not found</Info>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
