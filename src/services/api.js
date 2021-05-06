import axios from 'axios'
import io from 'socket.io-client'

// this headers bypasses localtunnel's reminder page
//if(process.env.LOCALTUNNEL_WORKAROUND) axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = '*'

const dataApi = axios.create({baseURL: process.env.REACT_APP_API_URL + '/data/'})
const authApi = axios.create({baseURL: process.env.REACT_APP_API_URL + '/auth/'})
const realTimeApi = io(process.env.REACT_APP_API_URL + '/real-time/', {auth: {token: ''}}, {autoConnect: false})

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
    error => {
        if(error.response.status != 401) return Promise.reject(error)

        return refresh()
        .then(() => {
            const token = getAccessToken()
            error.config.headers.Authorization = 'Bearer ' + token
            realTimeApi.auth.token = token
            return dataApi(error.config)
        })
        .catch(err => Promise.reject(err))
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

const refresh = async() => {

    try{
        const response = await authApi({
            method: 'post',
            url: '/refresh',
            headers: { Authorization: 'Bearer '+ getRefreshToken() }
        })

        setAccessToken(response.data.access_token)
        authNotifier.notify(true)
    }
    catch(err) {
        logout()
    }
}

// Api auth routes
export const login = async (username, password) => {

    //TODO: remove comments 
    //const response = await authApi.post('/login', {username, password})

    //setAccessToken(response.data.access_token)
    //setRefreshToken(response.data.refresh_token)
    authNotifier.notify(true)
}

export const logout = async() => {
    setAccessToken('')
    setRefreshToken('')
    authNotifier.notify(false)
}

export const getAreas = async() => {

    //TODO: remove comments 
    //const response = await dataApi.post('/')

    //return response.data.areas
    return [
        {
            id: '2',
            silos: [
                '1',
                '2',
                '3',
                '4'
            ]
        },
        {
            id: '1',
            silos: [
                '5',
                '6',
                '7',
                '8'
            ]
        }
        
    ]
}

export const getHistory = async (silo) => {
    //TODO

    return [
        {
            date: "2011-10-05T00:00:00.000Z",
            average_temperature: 50,
            average_humidity: 60,
            average_pressure: 70
        },
        {
            date: "2011-10-06T00:00:00.000Z",
            average_temperature: 60,
            average_humidity: 65,
            average_pressure: 40
        }
    ]
}

export const getThresholds = async (silo) => {
    return {
        minHumidity: 40,
        maxHumidity: 80,
        minPressure: 1000,
        maxPressure: 1100,
        minCapacity: 0,
        maxCapacity: 100,
        minTemperature: 0,
        maxTemperature: 100
    }
}

export const getTemperature = async (silo) => {
    //TODO
    return (Math.random() * 100) + 1
}

export const getPressure = async (silo) => {
    //TODO
    return (Math.random() * 100) + 1000
}

export const getHumidity = async (silo) => {
    //TODO
    return (Math.random() * 50) + 50
}

export const getCapacity = async (silo) => {
    //TODO
    return Math.random() * 101
}

export const updateThresholds = async (data) => {
    //TODO
}

//Used to update state on realtime api hooks
export const realtimeNotifier = {
    notify: function (message, data) { 
        if(message === 'capacity') this.topics[message].forEach(fun => fun({value: data.value, active: data.active}))
        else this.topics[message].forEach(fun => fun(data.value))
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
realTimeApi.on('parameter:treshold-reached', (data) => realtimeNotifier.notify('alarm', data))

const checkRealtimeApiConnection = async () => {
    if(!realTimeApi.connected) await realTimeApi.connect()
}

export const receiveSiloEvents = async (id) => {
    await checkRealtimeApiConnection()

    realTimeApi.auth.token = getAccessToken()
    realTimeApi.emit('silo:join',id)
}

export const stopReceivingSiloEvents = async (id) => {
    await checkRealtimeApiConnection()

    realTimeApi.emit('silo:leave',id)
}

