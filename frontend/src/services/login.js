import axios from 'axios'
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT
const baseUrl = API_ENDPOINT + 'api/login'

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default { login }