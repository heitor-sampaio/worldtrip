import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://worldtrip-heitorosampaio-gmailcom.vercel.app/api'
})