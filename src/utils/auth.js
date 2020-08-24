import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send(400).send({ message: 'Email and Password Required!' })
  }

  try {
    const user = await User.create(req.body)
    const usertoken = newToken(user)
    return res.status(201).send({ usertoken })
  } catch (e) {
    return res.status(400).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send(400).send({ message: 'Email and Password Required!' })
  }

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(401).send({ message: 'no auth!' })
  }
  try {
    const match = user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send({ message: 'no auth!' })
    }
  } catch (e) {
    return res.status(401).send({ message: 'no auth!' })
  }

  const ntoken = newToken(user)
  res.status(200).send({ ntoken })
}

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).end()
  }

  let token = req.headers.authorization.split('Bearer ')[1]

  if (!token) {
    res.status(401).end()
  }

  try {
    const payload = await verifyToken(token)
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    req.user = user
    next()
  } catch (e) {
    res.status(401).end()
  }
}
