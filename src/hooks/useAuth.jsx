import { useEffect, useMemo, useState } from 'react'
import { authNotifier, getAccessToken } from '../services/api'

const useAuth = () => {
    const [loggedIn, setLoggedIn] = useState(authNotifier.value)
    
    const username = useMemo(() => {
      try{
        const data = getAccessToken().split('.')[1]
        const decoded = JSON.parse(atob(data))
        return decoded.username ?? ''
      }
      catch(err) {
        return ''
      }

    },[loggedIn])

    useEffect(() => {
      authNotifier.subscribe(setLoggedIn)

      return () => {
        authNotifier.unsubscribe(setLoggedIn)
      }
    },[])



    return [loggedIn, username]
}

export default useAuth
