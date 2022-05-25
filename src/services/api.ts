import axios from 'axios'

export const api = axios.create({
  baseURL: 'worldtrip-hs.vercel.app/api'
})