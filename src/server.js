/* eslint-disable prettier/prettier */
import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

const log = (req, res, next) => {
  console.log('logging')
  next()
}

const log1 = (req, res, next) => {
  console.log('In Default Route')
  next()
}

app.use(log)

// Routers in Express to septrate business logic of the APIS
const router = express.Router()
router.get('/me', (req, res) => {
  res.send({ message: 'This is a router' })
})
app.use('/api', router)

app.get('/', log1, (req, res) => {
  res.send({ message: 'Hello World!' })
})

app.post('/', (req, res) => {
  console.log(req.body)
  res.send({ message: 'ok' })
})

export const start = () => {
  app.listen(3000, () => {
    console.log('Server Started on 3000!')
  })
}
