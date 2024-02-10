import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4321',
})

export const login = ({ email, password }) =>
  axiosInstance.post('/login', { email, password })

export const register = ({ email, password }) =>
  axiosInstance.post('/register', { email, password })

export const privates = ({ token }) =>
  axiosInstance.get('/private', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const forgot = ({ email }) => axiosInstance.post('/forgot', { email })
