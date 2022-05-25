import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://pworldtrip-hs.vercel.app/api'
})