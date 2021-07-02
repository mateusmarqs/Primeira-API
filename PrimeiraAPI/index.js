const express = require('express')
const app = express()
const cors = require("cors")
const jwt = require('jsonwebtoken')

const JWTSecret = 'asdasd788sfsfgsdf7hg878as89fd7987sa098d'

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// middleware
function auth(req, res, next) {
    const authToken = req.headers['authorization']
    // console.log(authToken)

    if (authToken != undefined) {
        const token = authToken.split(' ')[1]

        jwt.verify(token, JWTSecret, (err, data) => {
            if (err){
                res.status(401)
                res.json('Token inválido')
            } else {
                // Essas variáveis podem ser acessada em toda rota que utilizar esse middleware
                req.token = token
                req.user = {
                    id: data.id,
                    user: data.user
                }
                next()
            }
        })
    } else {
        res.status(401)
        res.json({err: 'Token inválido'})
    }
}

var DB = {
    games: [
        {
            id: 23,
            title: 'Call of Duty MW',
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: 'Sea of Thieves',
            year: 2018,
            price: 40
        },
        {
            id: 23,
            title: 'Minecraft',
            year: 2012,
            price: 20
        }
    ],
    users: [
        {
            id: 1,
            nome: 'Mateus Marques',
            user: 'mateusmarqs',
            password: "node<3"
        }
    ]
}

app.get('/games', auth, (req, res) => {

    res.statusCode = 200
    res.json(DB.games) // utiliza o _ para informar ao usuário que não é uma informação principal, e sim secundária.
})

app.get('/game/:id', auth,(req, res) => {
    var id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        if (id < 0 || id > DB.games.length - 1) {
            res.sendStatus(404)
        } else {

            var HATEOAS = [
                {
                    href: 'http://localhost:4567/game/'+id,
                    method: 'DELETE',
                    rel: 'delete_game'
                },
                {
                    href: 'http://localhost:4567/game/'+id,
                    method: 'GET',
                    rel: 'get_game' 
                },
                {
                    href: 'http://localhost:4567/game/'+id,
                    method: 'PUT',
                    rel: 'edit_game' 
                },
                {
                    href: 'http://localhost:4567/auth',
                    method: 'POST',
                    rel: 'login' 
                }
            ]

            res.json({games: DB.games[id], _links: HATEOAS})
        }
    }
})

app.post('/game', auth, (req, res) => {

    // O certo é validar os dados recebidos para o POST
    var {title, price, year} = req.body

    DB.games.push({
        id: 43,
        title,
        year,
        price
    })

    res.sendStatus(200)
})

app.delete('/game/:id', auth, (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        let id = parseInt(req.params.id)    
        let index = DB.games.findIndex( g => g.id == id)
        // console.log(index)

        if (index < 0) {
            res.sendStatus(404)
        } else {
            DB.games.splice(index, 1)
            res.sendStatus(200)
        }
    }
})

app.put('/game/:id', auth, (req, res) => {
    var id = req.params.id
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        var id = parseInt(id)
        game = DB.games.find( g => g.id == id)

        if (game != undefined) {
            var {title, price, year} = req.body

            if (title != undefined) {
                game.title = title
            }

            if (year != undefined) {
                game.year = year
            }

            if (price != undefined) {
                game.price = price
            } 
        }
        res.sendStatus(200)
    }
})

app.post('/auth', (req, res) => {
    var {user, password} = req.body

    if (user != undefined){
        var user = DB.users.find(userAuth => userAuth.user == user)

        if (user != undefined){
            if (password == user.password) {

                jwt.sign({
                    id: user.id,
                    user: user.user
                },
                JWTSecret, {expiresIn: '48h'}, (err, token) => {
                    if (err){
                        res.status(400)
                        res.json('Falha interna')
                    } else {
                        res.status(200)
                        res.json({token: token})
                    }
                })
            } else {
                res.status(401)
                res.json('Senha incorreta')
            }
        } else {
            res.status(404)
            res.json('Usuário não encontrado')
        }
    } else {
        res.status(400)
        res.json('O usuário está inválido')
    }
})

app.listen(4567, () => {
    // console.log('API RODANDO!')
})