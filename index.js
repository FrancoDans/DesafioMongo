const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }


const app = express()
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({ 
        
        mongoUrl: 'mongodb://daniel:daniel123@cluster0-shard-00-00.nfdif.mongodb.net:27017,cluster0-shard-00-01.nfdif.mongodb.net:27017,cluster0-shard-00-02.nfdif.mongodb.net:27017/sesiones?ssl=true&replicaSet=atlas-bwvi2w-shard-0&authSource=admin&retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    

    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

const getNombreSession = req => req.session.nombre? req.session.nombre: ''

app.get('/', (req,res) => {
    if(req.session.contador) {
        req.session.contador++
        res.send(`${getNombreSession(req)} visitaste la página ${req.session.contador} veces.`)
    }
    else {
        let { nombre } = req.query
        req.session.nombre = nombre
        req.session.contador = 1
        res.send(`Bienvenido/a ${getNombreSession(req)}!`)
    }
})

app.get('/olvidar', (req,res) => {
    let nombre = getNombreSession(req)
    req.session.destroy( err => {
        if(!err) res.send(`Hasta luego ${nombre}`)
        else res.send({error: 'olvidar', body: err})
    })
})

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})
server.on("error", error => console.log(`Error en servidor: ${error}`))