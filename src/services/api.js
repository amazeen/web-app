//TODO: catch errors

import axios from 'axios'
import io from 'socket.io-client'

// this headers bypasses localtunnel's reminder page
//if(process.env.LOCALTUNNEL_WORKAROUND) axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = '*'

const getPathname = (url) => {
    alert(new URL(url).pathname)
    return new URL(url).pathname
}

const dataApi = axios.create({baseURL: process.env.REACT_APP_API_URL + '/data/'})
const authApi = axios.create({baseURL: process.env.REACT_APP_API_URL + '/auth/'})

const realTimeApi = io(new URL(process.env.REACT_APP_API_URL).origin, {path: new URL(process.env.REACT_APP_API_URL).pathname + '/realtime/socket.io', autoConnect: false, reconnection: false})

// Access and refresh token management
dataApi.interceptors.request.use(
    async config => {
        config.headers.Authorization = 'Bearer ' + getAccessToken()
        return config
    },
    error => Promise.reject(error)
)

dataApi.interceptors.response.use(
    response => response,
    async (error) => {
        if(error.response.status != 401) return Promise.reject(error)

        try{
            await refresh()
            const token = getAccessToken()
            error.config.headers.Authorization = 'Bearer ' + token

            return dataApi(error.config)
        }
        catch(err) {
            return Promise.reject(error)
        }
    }
)

export const getAccessToken  = () => localStorage.getItem('access_token')
const getRefreshToken = () => localStorage.getItem('refresh_token')
const setAccessToken  = (token) => localStorage.setItem('access_token',  token)
const setRefreshToken = (token) => localStorage.setItem('refresh_token', token)

// Used to update state on useAuth hook
export const authNotifier = {
    value: false,
    notify: function (_value) {
        this.value = true
        this.notifiers.forEach(fun => fun(_value))
    },
    subscribe: function (fun) {
        this.notifiers.push(fun)  
    },
    unsubscribe: function (fun) {
        this.notifiers = this.notifiers.filter(x => x != fun)
    },
    notifiers: []
}

export const refresh = async() => {

    
    try{
        if(getRefreshToken() == '') throw 'Refresh token missing'
        
        const response = await authApi({
            method: 'post',
            url: '/refresh',
            headers: { Authorization: 'Bearer '+ getRefreshToken() },
            data: {}
        })

        setAccessToken(response.data.access_token)

        //realTimeApi.extraHeaders.Authorization = 'Bearer '+ getAccessToken()
        if(!realTimeApi.connected) realTimeApi.connect()

        authNotifier.notify(true)
    }
    catch(err) {
        logout()
        throw 'Refresh token expired'
    }
}

// Api auth routes
export const login = async (username, password) => {
    
    const response = await authApi.post('/login', {username, password})

    setAccessToken(response.data.access_token)
    setRefreshToken(response.data.refresh_token)

    //realTimeApi.extraHeaders.Authorization = 'Bearer '+ getAccessToken()
    realTimeApi.connect()

    authNotifier.notify(true)
}

export const logout = async() => {

    setAccessToken('')
    setRefreshToken('')

    try{
        //realTimeApi.extraHeaders.Authorization = ''
        realTimeApi.disconnect()
    }
    catch(err) {}

    authNotifier.notify(false)

    try {
        
        const response = await authApi({
            method: 'post',
            url: '/logout',
            headers: { Authorization: 'Bearer '+ getRefreshToken() },
            data: {}
        })
    }
    catch(err) {}
}

export const getAreas = async() => {

    const areas = (await dataApi.get('/')).data.areas
    const result = Promise.all(areas.map(async (area) => {
        const response = await dataApi.get('/area/' + area)
        return response.data
    }))

    return result
}

export const getHistory = async (area, silo) => {

    const response = await dataApi.get(`/area/${area}/silo/${silo}/history`)
    return response.data
}

export const getTemperature = async (area, silo) => {
    const response = await dataApi.get(`/area/${area}/silo/${silo}/parameters`)
    return response.data.temperature
}

export const getPressure = async (area, silo) => {
    const response = await dataApi.get(`/area/${area}/silo/${silo}/parameters`)
    return response.data.pressure
}

export const getHumidity = async (area, silo) => {
    const response = await dataApi.get(`/area/${area}/silo/${silo}/parameters`)
    return response.data.humidity
}

export const getCapacity = async (area, silo) => {
    const response = await dataApi.get(`/area/${area}/silo/${silo}/parameters`)
    return response.data.capacity
}

export const getThresholds = async (area, silo) => {
    
    const response = await dataApi.get(`/area/${area}/silo/${silo}/thresholds`)

    return {
        minHumidity:    response.data.find(x => x.type == 'humidity').minimum,
        maxHumidity:    response.data.find(x => x.type == 'humidity').maximum,
        minPressure:    response.data.find(x => x.type == 'pressure').minimum,
        maxPressure:    response.data.find(x => x.type == 'pressure').maximum,
        minCapacity:    response.data.find(x => x.type == 'capacity').minimum,
        maxCapacity:    response.data.find(x => x.type == 'capacity').maximum,
        minTemperature: response.data.find(x => x.type == 'temperature').minimum,
        maxTemperature: response.data.find(x => x.type == 'temperature').maximum
    }
}

export const updateThresholds = async (area, silo, data) => {
    const apiData = [
        {
            type: 'temperature',
            minimum: data.minTemperature,
            maximum: data.maxTemperature
        },
        {
            type: 'pressure',
            minimum: data.minPressure,
            maximum: data.maxPressure
        },
        {
            type: 'humidity',
            minimum: data.minHumidity,
            maximum: data.maxHumidity
        },
        {
            type: 'capacity',
            minimum: data.minCapacity,
            maximum: data.maxCapacity
        }
    ]

    const response = await dataApi.put(`/area/${area}/silo/${silo}/thresholds`, apiData)

}

//Used to update state on realtime api hooks
export const realtimeNotifier = {
    notify: function (message, data) { 
        try{
            if(message === 'capacity') this.topics[message].forEach(fun => fun({value: data.value, active: data.active}))
            else this.topics[message].forEach(fun => fun(data.value))
        }
        catch(err) {
            //Unknown message type
        }
        
    },
    subscribe: function (message, fun) {
        this.topics[message].push(fun)
    },
    unsubscribe: function (message, fun) {
        this.topics[message] = this.topics[message].filter(x => x != fun)
    },
    topics: {
        'temperature': [],
        'capacity': [],
        'pressure': [],
        'humidity': [],
        'alarm': []
    }
}

realTimeApi.on('error', (data) => realtimeNotifier.notify('alarm', data))
realTimeApi.on('connect_error', (data) => realtimeNotifier.notify('alarm', data))
realTimeApi.on('reconnect_error', (data) => realtimeNotifier.notify('alarm', data))

realTimeApi.on('parameter:reading', (data) => realtimeNotifier.notify(data.type, data))
realTimeApi.on('parameter:threshold-reached', (data) => realtimeNotifier.notify('alarm', data))

const checkRealtimeApiConnection = async () => {
    if(!realTimeApi.connected) await realTimeApi.connect()
}

export const receiveSiloEvents = async (id) => {
    await checkRealtimeApiConnection()

    //realTimeApi.extraHeaders.Authorization = 'Bearer '+ getAccessToken()
    realTimeApi.emit('silo:join',id)
}

export const stopReceivingSiloEvents = async (id) => {
    await checkRealtimeApiConnection()

    realTimeApi.emit('silo:leave',id)
}

