import { get, lgnKy, loadLog } from './global.js'

window.onload = () => { setTimeout(() => {
    if (loadLog()) window.location.replace('/')

    document.getElementById('cntFtr').style.height =
        '' + document.getElementById('cntHdr').clientHeight + 'px'

    let lgn = document.getElementById('lgn')
    let pas = document.getElementById('pas')

    let clr = a => {
        if (a) {
            lgn.value = ''
            pas.value = ''
        }
        lgn.style.border = ''
        pas.style.border = ''
        lgn.style.backgroundColor = 'white'
        pas.style.backgroundColor = 'white'
    }
    document.getElementById('clr').addEventListener('click', () => clr(true))

    let hm = () => window.location.replace('/')
    document.getElementById('menuBtVr').addEventListener('click', hm)

    document.getElementById('sbmt').addEventListener('click', () => {
        if (lgn.value.length === 0) {
            lgn.style.border = '5px solid red'
            setTimeout(() => clr(false), 1000)
            return
        }
        if (pas.value.length === 0) {
            pas.style.border = '5px solid red'
            setTimeout(() => clr(false), 1000)
            return
        }
        get('/usr/' + lgn.value + '/' + pas.value, rsp => {
            sessionStorage.setItem(lgnKy, (rsp === true.toString()).toString())

            if (rsp === true.toString())
                hm()
            else {
                lgn.style.backgroundColor = 'red'
                pas.style.backgroundColor = 'red'
                setTimeout(clr, 1000)
            }
        })
    })

    document.getElementById('menuBtAbt')
        .addEventListener('click', () => window.location.replace('/about'))
}, 0) }
