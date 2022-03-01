import { itmsLen, itmNms, cmpTps, itmImgs, get, loadLog } from './global.js'

let cmpLists, cmVw, ovrl, isCmVwShw

function cmpItmClk(el) {
    isCmVwShw = el != null

    cmVw.style.display = isCmVwShw ? 'flex' : 'none'
    ovrl.style.display = isCmVwShw ? 'initial' : 'none'

    if (!isCmVwShw) return

    let itm = el.currentTarget
    let nm = itm.querySelector('#cmpItmTxt').textContent

    cmVw.querySelector('#cmpVwNm').textContent = nm
    get('/dsc/' + nm, rsp => cmVw.querySelector('#cmpVwDsc').textContent = rsp)
}

function loadCmpLsts() {
    cmpLists = document.getElementById('cmpLists')
    let list = cmpLists.querySelector('#cmpLst')
    let bfr = document.getElementById('cpLstBfr')

    for (let i = 0; i < itmsLen; i++) {
        list = i > 0 ? list.cloneNode(true) : list

        get('/cmp/' + cmpTps[i], (rsp, bnd) => {
            console.log(cmpTps[bnd.ii] + ' ' + bnd.ii)

            let jsn = JSON.parse(rsp).formData
            let b = bnd.lst.querySelectorAll('#cmpItm')

            for (let j = 0; j < jsn.ln; j++) {
                let a = j >= b.length ? b[0].cloneNode(true) : b[j]
                let cmp = jsn.ar[j]

                a.querySelector('#cmpItmImg').src =
                    cmp.img ? 'data:image/jpg;base64,' + cmp.img : itmImgs[bnd.ii]

                a.querySelector('#cmpItmTxt').textContent =
                    cmp.nm ? cmp.nm : itmNms[j]

                a.querySelector('#cmpItmCst').textContent =
                    '$' + (cmp.cst ? cmp.cst : itmNms[j])

                a.addEventListener('click', (e) => cmpItmClk(e))

                if (j > 0) bnd.lst.append(a)
            }
        }, {
            ii: i,
            lst: list
        })

        let bf = i > 0 ? bfr.cloneNode(true) : bfr
        bf.querySelector('span').textContent = itmNms[i]
        bf.style.display = 'inline-block'
        i > 0 ? cmpLists.append(bf) : cmpLists.prepend(bf)

        if (i > 0) cmpLists.append(list)
    }
}

function loadCmpVw() {
    cmVw = document.getElementById('cmpVw')
    ovrl = document.getElementById('overlay')

    cmVw.querySelector('#cmpVwExt')
        .addEventListener('click', () => cmpItmClk(null))
}

window.onload = () => { setTimeout(() => {
    loadCmpLsts()

    document.getElementById('cntFtr').style.height =
        '' + document.getElementById('cntHdr').clientHeight + 'px'

    document.getElementById('menuBtVr').addEventListener('click', () =>
        window.location.replace('/'))

    loadCmpVw()

    document.getElementById('menuBtLog').addEventListener('click', () =>
        window.location.replace('/login'))

    loadLog()

    document.getElementById('menuBtAbt')
        .addEventListener('click', () => window.location.replace('/about'))
}, 0) }
