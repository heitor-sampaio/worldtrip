import axios from 'axios'
import { parseCookies } from 'nookies';

let url;

if (process.env.NODE_ENV !== 'development') {
  url = process.env.NEXT_PUBLIC_API_URL
}

if (process.env.NODE_ENV === 'development') {
  url = "http://localhost:3000"
}

export function setupApiClient(ctx = undefined) {
  const cookies = parseCookies()

  const token = cookies['@worldtrip.token']

  const api = axios.create({
    baseURL: `${url}/api`,
    headers: {
      Authorization: `Bearer ${token}` 
    }
  })

  return api
}

export const api = setupApiClient()