
const htmlDir = __dirname + '/front/html/'
const cssDir = __dirname + '/front/css/'
const jsDir = __dirname + '/front/js/'
const encoding = 'utf8'

const express = require('express')
const app = express()

process.on('uncaughtException', ex => console.log(ex))

app.use(express.static('front'))
app.get('/', (req, res) => res.sendFile(htmlDir + 'index.html'))
app.get('/browse', (req, res) => res.sendFile(htmlDir + 'browse.html'))
app.get('/login', (req, res) => res.sendFile(htmlDir + 'login.html'))
app.get('/admn', (req, res) => res.sendFile(htmlDir + 'admn.html'))
app.get('/about', (req, res) => res.sendFile(htmlDir + 'about.html'))

app.listen(8080, null)

const rsbk = __dirname + '/res_back/'

const dbnm = 'cmps'
const dbPath = rsbk + dbnm + '.db'
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database(dbPath, er => { if (er) throw 1 })

process.on('exit', () => db.close(er => { if (er) throw 1 }))

const fs = require('fs')

const cmpPrfx = '/cmp/'
app.get(cmpPrfx + ':type', (req, res) => {
    const tp = req.params.type
    db.all('SELECT * FROM cmps WHERE type = ?', [tp], (er, rws) => {
        if (er) { console.log(er.message); return }

        let ar = Array()
        rws.forEach(r => {
            const pt = rsbk + r.img + (tp !== 'cpu' ? '_' + tp : '') + '.jpg'

            ar.push({
                nm: r.name,
                dsc: r.descr,
                cst: r.cost,
                img: fs.existsSync(pt) ? fs.readFileSync(pt, {encoding: 'base64'}) : null
            })
        })

        res.send({
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            formData: {
                'ln': ar.length,
                'ar': ar
            }
        })
    })
})

app.get('/dsc/:nm', (req, res) => {
    const nm = req.params.nm
    db.get('SELECT descr FROM cmps WHERE name = ?', [nm], (er, rw) => {
        if (er) { console.log(er.message); return }
        res.send(rw.descr)
    })
})

app.get('/usr/:lgn/:pas', (req, res) => {
    const lg = req.params.lgn, ps = req.params.pas
    db.get('SELECT lgn FROM usrs WHERE lgn = ? AND pas = ?', [lg, ps], (er, rw) => {
        if (er) { console.log(er.message); return }
        res.send(rw == null ? 'false' : 'true')
    })
})

app.get('/cmps', (req, res) => db.all('SELECT * FROM cmps', [], (er, rws) => {
    if (er) { console.log(er.message); return }
    res.send(rws)
}))

app.get('/usrs', (req, res) => db.all('SELECT * FROM usrs', [], (er, rws) => {
    if (er) { console.log(er.message); return }
    res.send(rws)
}))

app.get('/cmps/slc/:prms', (req, res) => {
    const jsn = JSON.parse(req.params.prms)
    let st = '', ar = []

    if (jsn.id) {
        st += 'id = ? AND '
        ar.push(jsn.id)
    }
    if (jsn.type) {
        st += 'type = ? AND '
        ar.push(jsn.type)
    }
    if (jsn.name) {
        st += 'name = ? AND '
        ar.push(jsn.name)
    }
    if (jsn.descr) {
        st += 'descr = ? AND '
        ar.push(jsn.descr)
    }
    if (jsn.cost) {
        st += 'cost = ? AND '
        ar.push(jsn.cost)
    }
    if (jsn.img) {
        st += 'img = ? AND '
        ar.push(jsn.img)
    }

    st = st.substring(0, st.lastIndexOf('AND'))

    db.all('SELECT * FROM cmps WHERE ' + st, ar, (er, rws) => {
        if (er) console.log(er.message)
        res.send(er ? null : rws)
    })
})

app.get('/usrs/slc/:prms', (req, res) => {
    const jsn = JSON.parse(req.params.prms)
    let st = '', ar = []

    if (jsn.id) {
        st += 'id = ? AND '
        ar.push(jsn.id)
    }
    if (jsn.lgn) {
        st += 'lgn = ? AND '
        ar.push(jsn.lgn)
    }
    if (jsn.pas) {
        st += 'pas = ? AND '
        ar.push(jsn.pas)
    }

    st = st.substring(0, st.lastIndexOf('AND'))

    db.all('SELECT * FROM usrs WHERE ' + st, ar, (er, rws) => {
        if (er) console.log(er.message)
        res.send(er ? null : rws)
    })
})

app.post('/cmps/ins/:prms', (req, res) => {
    const jsn = JSON.parse(req.params.prms)

    let cms = '', vls = '', ar = []
    if (jsn.id) {
        cms += 'id, '
        vls += '?, '
        ar.push(jsn.id)
    }
    if (jsn.type) {
        cms += 'type, '
        vls += '?, '
        ar.push(jsn.type)
    }
    if (jsn.name) {
        cms += 'name, '
        vls += '?, '
        ar.push(jsn.name)
    }
    if (jsn.descr) {
        cms += 'descr, '
        vls += '?, '
        ar.push(jsn.descr)
    }
    if (jsn.cost) {
        cms += 'cost, '
        vls += '?, '
        ar.push(jsn.cost)
    }
    if (jsn.img) {
        cms += 'img, '
        vls += '?, '
        ar.push(jsn.img)
    }

    cms = cms.substring(0, cms.lastIndexOf(','))
    vls = vls.substring(0, vls.lastIndexOf(','))

    console.log(cms + ' # ' + vls)

    db.run(`INSERT INTO cmps (${cms}) VALUES (${vls})`, ar, er => {
        if (er) console.log(er.message)
        res.send(!er)
    })
})

app.post('/usrs/ins/:prms', (req, res) => {
    const jsn = JSON.parse(req.params.prms)

    let cms = '', vls = '', ar = []
    if (jsn.id) {
        cms += 'id, '
        vls += '?, '
        ar.push(jsn.id)
    }
    if (jsn.lgn) {
        cms += 'lgn, '
        vls += '?, '
        ar.push(jsn.lgn)
    }
    if (jsn.pas) {
        cms += 'pas, '
        vls += '?, '
        ar.push(jsn.pas)
    }

    cms = cms.substring(0, cms.lastIndexOf(','))
    vls = vls.substring(0, vls.lastIndexOf(','))

    db.run(`INSERT INTO usrs (${cms}) VALUES (${vls})`, ar, er => {
        if (er) console.log(er.message)
        res.send(!er)
    })
})

app.post('/cmps/upd/:prms', (req, res) => {
    const jsn = JSON.parse(req.params.prms)
    let st = ''

    if (!jsn.id) throw 1

    let ar = []
    if (jsn.type) {
        st += 'type = ?, '
        ar.push(jsn.type)
    }
    if (jsn.name) {
        st += 'name = ?, '
        ar.push(jsn.name)
    }
    if (jsn.descr) {
        st += 'descr = ?, '
        ar.push(jsn.descr)
    }
    if (jsn.cost) {
        st += 'cost = ?, '
        ar.push(jsn.cost)
    }
    if (jsn.img) {
        st += 'img = ?, '
        ar.push(jsn.img)
    }

    st = st.substring(0, st.lastIndexOf(','))
    ar.push(parseInt(jsn.id))

    db.run(`UPDATE cmps SET ${st} WHERE id = ?`, ar, er => {
        if (er) console.log(er.message)
        res.send(!er)
    })
})

app.post('/usrs/upd/:prms', (req, res) => {
    const jsn = JSON.parse(req.params.prms)
    let st = ''

    if (!jsn.id) throw 1

    let ar = []
    if (jsn.lgn) {
        st += 'lgn = ?, '
        ar.push(jsn.lgn)
    }
    if (jsn.pas) {
        st += 'pas = ?, '
        ar.push(jsn.pas)
    }

    st = st.substring(0, st.lastIndexOf(','))
    ar.push(parseInt(jsn.id))

    db.run(`UPDATE usrs SET ${st} WHERE id = ?`, ar, er => {
        if (er) console.log(er.message)
        res.send(!er)
    })
})

app.post('/:db/dlt/:id', (req, res) => {
    const _db = req.params.db
    const id = parseInt(req.params.id)
    db.run(`DELETE FROM ? WHERE id = ?`, [_db, id], er => {
        if (er) console.log(er.message)
        res.send(!er)
    })
})
