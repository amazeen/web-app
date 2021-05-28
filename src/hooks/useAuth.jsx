import { useEffect, useMemo, useState } from 'react'
import { authNotifier, getUsername, refresh, userCanRead, userCanUpdate } from '../services/api'

const useAuth = () => {
    const [loggedIn, setLoggedIn] = useState(authNotifier.value)
    
    const username = useMemo(getUsername, [loggedIn])
    const canRead = useMemo(userCanRead, [loggedIn])
    const canUpdate = useMemo(userCanUpdate, [loggedIn])

    useEffect(() => {
      authNotifier.subscribe(setLoggedIn)

      try{
        refresh()
      }
      catch(err) {}

      return () => {
        authNotifier.unsubscribe(setLoggedIn)
      }
    },[])

    return {loggedIn, username, canRead, canUpdate}
}

export default useAuth
