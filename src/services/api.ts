import axios from 'axios'

let url;

if (process.env.NODE_ENV === 'production') {
  if (process.env.VERCEL) {
    url = process.env.NEXT_PUBLIC_VERCEL_URL
  }

  if (process.env.NETLIFY) {
    url = process.env.NEXT_PUBLIC_URL
  }

  if (!process.env.VERCEL && !process.env.NETLIFY) {
    url = process.env.NEXT_PUBLIC_LOCAL_API_URL
  }
}

if (process.env.NODE_ENV === 'development') {
  url = process.env.NEXT_PUBLIC_LOCAL_API_URL
}

export const api = axios.create({
  baseURL: `${url}/api`
})