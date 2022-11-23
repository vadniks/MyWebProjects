
// noinspection JSUnresolvedFunction

const client = require('./client'),
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    path = require('path')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*
curl localhost:3000 && echo
curl localhost:3000/save -H "Content-Type: application/json" -d '{"name":"c","password":"cc"}' && echo
curl localhost:3000/update -H "Content-Type: application/json" -d '{"id":2,"name":"c@","password":"cc@@"}' && echo
curl localhost:3000/remove -H "Content-Type: application/json" -d '{"id":2}' && echo
curl localhost:3000/greetings -H "Content-Type: application/json" -d '{"name":"a","password":"aa"}' -X GET && echo
*/

app.get("/", (req, res) =>
    client.getAll(null, (err, data) => { if (!err) res.send({ results: data.users }) }))
app.post("/save", (req, res) =>
    client.insert({
        name: req.body.name,
        password: req.body.password
    }, (err, _) => { if (err) throw err; else res.sendStatus(200) })
)
app.post("/update", (req, res) =>
    client.update({
        id: req.body.id,
        name: req.body.name,
        password: req.body.password
    }, (err, _) => { if (err) throw err; else res.sendStatus(200) })
)
app.post("/remove", (req, res) =>
    client.remove({ id: req.body.id }, (err, _) => { if (err) throw err; else res.sendStatus(200) }))
app.post('/greetings', (req, res) =>
    client.greetings({
        name: req.body.name,
        password: req.body.password
    }, (err, data) => { if (err) throw err; else res.send(`Hello ${data.name}!`) })
)
app.get('/view', (_, res) =>
    res.sendFile('index.html', { root: path.join(__dirname) }, null))

app.listen(3000)
