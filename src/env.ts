import dotenv from 'dotenv'
dotenv.config()

export const AUTH_TOKEN = process.env.AUTH_TOKEN

const defaultPort = 3000
export const PORT =
  parseInt(process.env.PORT || `${defaultPort}`, 10) || defaultPort

export const WORKERS = parseInt(process.env.WORKERS || '', 10) || undefined
