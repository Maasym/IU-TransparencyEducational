import axios from 'axios'
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT
const baseUrl = API_ENDPOINT + 'api/tickets'

let token = null
let getToken = null
let userID = null
let idUrl = null

const getUserID = () => {
    userID = window.localStorage.getItem('userID').replaceAll('"', '')
    return userID
}

const createTicket = async newObject => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const getTickets = async () => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.get(baseUrl, config)

    return response.data
}

const getTicket = async (id) => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    idUrl = baseUrl + '/' + id


    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.get(idUrl, config)

    return response.data
}

const updateTicket = async (newObject, id) => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    idUrl = baseUrl + '/' + id

    console.log(newObject)

    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.put(idUrl, newObject, config)
    return response.data
}

const getAttachment = async (id) => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    idUrl = baseUrl + '/attachment/' + id


    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.get(idUrl, config)

    return response.data
}

const updateAttachment = async (newObject, id) => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    idUrl = baseUrl + '/attachment/' + id


    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.put(idUrl, newObject, config)

    return response.data
}

const getComment = async (id) => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    idUrl = baseUrl + '/comment/' + id


    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.get(idUrl, config)

    return response.data
}

const createComment = async (comment, id) => {

    getToken = window.localStorage.getItem('token').replaceAll('"', '')
    token = `bearer ${getToken}`

    idUrl = baseUrl + '/comment/' + id

    const newComment = {
        comment: comment
    }

    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.put(idUrl, newComment, config)

    return response.data
}

export default {createTicket, getUserID, getTickets, getTicket, updateTicket, getAttachment, updateAttachment, getComment, createComment }