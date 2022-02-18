import { get, lgnKy, loadLog, pst } from "./global.js";

const dbsLn = 2

const cmps = ['id', 'type', 'name', 'descr', 'cost', 'img']
const usrs = ['id', 'lgn', 'pas']
const acs = ['Select', 'Insert', 'Update', 'Delete']
let dbSw, curId = 0
let dbs, vws = [], lss = [], act1, act2, ovrl
const rw1 = ['Id', 'Tp', 'Nm', 'Ds', 'Cs', 'Im'].map(vl => '1' + vl)
const rw2 = ['Id', 'Lg', 'Ps'].map(vl => '2' + vl)

function preLoadDbs() {
    dbs = document.getElementById('dbs')
    let vw = dbs.querySelector('div')

    for (let i = 0; i < dbsLn; i++) {
        vw = i > 0 ? vw.cloneNode(true) : vw

        const ls = vw.querySelector('#dbLs')
        if (i > 0) dbs.append(vw)

        vws[i] = vw
        lss[i] = ls
    }
}

function altrFrst(ls, a) {
    let b = ls.querySelector('div')
    b.style.backgroundImage =
        'linear-gradient(to left, #202324, #333a3a, #3d4545, #333a3a, #202324)'

    let c = b.querySelectorAll('button')
    c[0].style.pointerEvents = 'none'
    c[0].textContent = !a ? 'cnts' : 'usrs'
    c[0].style.visibility = 'visible'
    c[0].style.backgroundColor = '#202324'
    c[1].style.display = 'none'

    b.querySelectorAll('span').forEach(i => i.style.fontWeight = 'bold')

    b.classList.add('dbItmFrs')
}

function shwAct(a, b) {
    const ac = a ? act1 : act2
    ac.style.display = 'flex'

    ac.querySelector('#actNm').textContent = (a ? 'cnts' : 'usrs') + ': ' + b
    ac.querySelector('#actFtBt').textContent = b
    
    ovrl.style.display = 'initial'

    const mn = ac.querySelector('#actMn')
    const nps = mn.querySelectorAll('input, textarea')

    nps[0].style.pointerEvents = b === acs[2] ? 'none' : 'all'
    nps[0].style.backgroundColor = b === acs[2] ? 'grey' : 'white'

    console.log(curId + ' ' + a + ' ' + b + ' ' + (b === acs[2]))

    if (b !== acs[2]) {
        for (let i = 0; i < (a ? cmps : usrs).length; i++)
            nps[i].value = ''
        return
    }

    if (a) {
        get('/cmps/slc/' + JSON.stringify({id: parseInt(curId)}), rsp => {
            const jsn = JSON.parse(rsp)[0]
            nps[0].value = jsn.id
            nps[1].value = jsn.type
            nps[2].value = jsn.name
            nps[3].value = jsn.descr
            nps[4].value = jsn.cost
            nps[5].value = jsn.img
        })
    } else {
        get('/usrs/slc/' + JSON.stringify({id: parseInt(curId)}), rsp => {
            const jsn = JSON.parse(rsp)[0]
            nps[0].value = jsn.id
            nps[1].value = jsn.lgn
            nps[2].value = jsn.pas
        })
    }
}

function clrDb(fr) {
    const rws = lss[!fr ? 0 : 1].querySelectorAll('#dbItm')

    let j = rws.length - 1;
    rws.forEach(i => {
        if (j > 0)
            i.remove()
        else {
            let l = 0
            i.querySelectorAll('span').forEach(k => {
                k.textContent = (!fr ? cmps : usrs)[l]
                l++
            })
        }
        j--
    })
}

function perfAct(ac) {
    const fr = ac.substring(0, ac.indexOf(':')) === 'usrs'
    const act = !fr ? act1 : act2
    const mn = act.querySelector('#actMn')

    const flds = !fr ? cmps : usrs
    const fls = mn.querySelectorAll('input, textarea')

    if (flds.length !== fls.length) throw 1

    const jsn = !fr ? {
        id: parseInt(fls[0].value),
        type: fls[1].value,
        name: fls[2].value,
        descr: fls[3].value,
        cost: fls[4].value,
        img: fls[5].value
    } : {
        id: parseInt(fls[0].value),
        lgn: fls[1].value,
        pas: fls[2].value
    }

    const mth = ac.substring(ac.indexOf(':') + 2)

    const er = () => {
        act.style.backgroundColor = 'red'
        setTimeout(() => act.style.backgroundColor = '#202324', 1000)
    }

    const clb = rsp => {
        if (rsp === true.toString())
            window.location.reload()
        else
            er()
    }

    const _db = (!fr ? '/cmps' : '/usrs')
    const st = JSON.stringify(jsn)
    switch (mth) {
        case acs[0]:
            get(_db + '/slc/' + st, rsp => {
                if (rsp == null || rsp.length === 0) {
                    er()
                    return
                }

                clrDb(fr)
                fillDbs(fr, rsp)
            })
            break
        case acs[1]:
            pst(_db + '/ins/' + st, clb)
            break
        case acs[2]:
            pst(_db + '/upd/' + st, clb)
            break
        case acs[3]:
            pst(_db + '/dlt/' + curId.toString(), clb)
            break
    }
}

function fillDbs(fr, _rsp = null) {
    const lmb = rsp => {
        const ar = JSON.parse(rsp)
        const ls = lss[!fr ? 0 : 1]
        let a = ls.querySelector('#dbItm')
        let b = a.querySelector(`#dbRw${!fr ? 1 : 2}`)

        a.querySelector(`#dbRw${fr ? 1 : 2}`).style.display = 'none'

        const c = (itm, _a) => itm.textContent = _a
        const d = !fr ? [
            (i) => ar[i].id,
            (i) => ar[i].type,
            (i) => ar[i].name,
            (i) => ar[i].descr,
            (i) => ar[i].cost,
            (i) => ar[i].img
        ] : [
            (i) => ar[i].id,
            (i) => ar[i].lgn,
            (i) => ar[i].pas
        ]

        let itms = b.querySelectorAll('span')
        for (let i = 0; i < rsp.length; i++) {
            a = a.cloneNode(true)

            b = a.querySelector(`#dbRw${!fr ? 1 : 2}`)
            a.querySelector(`#dbRw${fr ? 1 : 2}`).style.display = 'none'

            itms = b.querySelectorAll('span')

            if (ar[i] == null) break

            for (let j = 0; j < d.length; j++)
                c(itms[j], d[j](i))

            const _id = ar[i].id
            a.querySelector('#dbCtUp').addEventListener('click', () => {
                curId = _id
                shwAct(!fr, acs[2])
            })
            a.querySelector('#dbCtDl').addEventListener('click', () => {
                curId = _id
                perfAct((!fr ? 'cnts' : 'usrs') + ': ' + acs[3])
            })

            ls.append(a)
        }

        altrFrst(ls, fr)
    }
    _rsp ? lmb(_rsp) : get(!fr ? '/cmps' : '/usrs', lmb)
}

function loadAct(fr, act) {
    act.querySelector('#actExt')
        .addEventListener('click', () => {
            act.style.display = 'none'
            ovrl.style.display = 'none'
        })

    const mn = act.querySelector('#actMn')

    const fls = !fr ? cmps : usrs
    const len = fls.length
    const tar = !fr ? [2, 3] : []

    const _a = mn.querySelector('input')
    let a = _a
    for (let i = 0; i < len; i++) {
        let b = false

        for (let j = 0; j < tar.length; j++)
            if ((b = tar[j] === i))
                break

        if (b) {
            a = document.createElement('textarea')
            a.style.resize = 'none'
            a.style.fontSize = 'large'
        } else
            a = i > 0 ? _a.cloneNode(true) : a

        a.value = ''
        a.placeholder = fls[i]
        if (i > 0) mn.append(a)
    }

    act.querySelector('#actFtBt').addEventListener('click', () =>
        perfAct(act.querySelector('#actNm').textContent))
}

let ht

window.onload = () => { setTimeout(() => {
    if (!loadLog(false)) window.location.replace('/')

    document.getElementById('cntFtr').style.height =
        '' + document.getElementById('cntHdr').clientHeight + 'px'

    preLoadDbs()
    fillDbs(false)
    fillDbs(true)

    document.getElementById('dbCtSl').addEventListener('click',
        () => shwAct(!dbSw, acs[0]))
    document.getElementById('dbCtDd').addEventListener('click',
        () => shwAct(!dbSw, acs[1]))

    act1 = document.getElementById('act')
    act2 = act1.cloneNode(true)
    document.getElementsByTagName('body')[0].append(act2)
    loadAct(false, act1)
    loadAct(true, act2)

    dbSw = false
    let ds = document.getElementById('dbCtSw')
    ds.addEventListener('click', e => {
        dbSw = !dbSw
        e.currentTarget.style.backgroundColor = !dbSw ? 'green' : 'brown'
        e.currentTarget.textContent = !dbSw ? 'cmps' : 'usrs'
    })
    ds.style.backgroundColor = 'green'
    ds.textContent = 'cmps'
    
    ovrl = document.getElementById('overlay')

    document.getElementById('menuBtVr').addEventListener('click', () =>
        window.location.replace('/'))

    document.getElementById('menuBtLog').addEventListener('click', () => {
        sessionStorage.removeItem(lgnKy)
        window.location.replace('/')
    })

    const cntHdr = document.getElementById('cntHdr')
    const _dbs = document.getElementById('dbs')
    ht = cntHdr.clientHeight

    let cnt = document.getElementById('content')

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > cnt.offsetTop) {
            cntHdr.style.position = 'fixed'
            cntHdr.style.top = '0'
            cntHdr.style.width = window.innerWidth > 950 ? ' 90%' : '98%'
            _dbs.style.marginTop = ht + 'px'
        } else {
            cntHdr.style.position = 'relative'
            _dbs.style.marginTop = '0'
            cntHdr.style.width = ' 100%'
        }
    })
}, 0) }
