import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { protect } from './modules/auth'
import { createNewUser, signin } from './handlers/user'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    console.log('Hello from the server')
    res.status(200)
    res.json({ message: 'hello' })
})

app.get('/test-error', (req, res, next) => {
    res.json({
        messgae: 'This is test-error route'
    })
})

app.use('/api', protect, router)
app.post('/user', createNewUser)
app.post('/signin', signin)

app.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({ message: 'unauthorized' })
    } else if (err.type === 'input') {
        res.status(400).json({ message: 'bad request' })
    } else {
        res.status(500).json({ message: 'internal server error' })
    }
})

export default app