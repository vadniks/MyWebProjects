import { itmsLen, itmNms, cmpTps, itmImgs, get, loadLog } from './global.js'

let
    cs,
    isCsShwn,
    csExt,
    csNm,
    csPic,
    ovrl,
    isOvrlShw,
    body,
    csNxt,
    curCmpItm = 0,
    csLst,
    chsnItms = Array(itmsLen),
    csCur,
    csDsc,
    cost,
    ovLst,
    ovAr = Array(itmsLen),
    clrOvrw,
    csSrch

function shwOvrl(a) {
    if (a !== !isOvrlShw) throw 1
    ovrl.style.display = a ? 'initial' : 'none'
    body.style.height = a ? '100%' : 'initial'
    body.style.margin = a ? '0' : 'initial'
    isOvrlShw = a
}

function csFnlz() {
    let ls = csLst.querySelectorAll('div')
    let i = ls.length
    ls.forEach(j => {
        if (i > 1) {
            csLst.removeChild(j)
            i--
        }
    })
    csDsc.textContent = 'Nothing is selected'
    csCur.textContent = 'Nothing is selected'
}

function itmClk(itm) {
    chsnItms[curCmpItm] = itm
    csCur.textContent = itm.querySelector('#cmpSlcItmNm').textContent
    csPic.src = itm.querySelector('#cmpSlcItmImg').src
    get('/dsc/' + csCur.textContent, rsp => csDsc.textContent = rsp)
}

function compItmClck(ndx, isExt) {
    shwOvrl(!isExt)

    cs.style.display = isCsShwn ? 'none' : 'flex'
    isCsShwn = !isCsShwn
    if (isExt)
        return

    const oi = ovAr[ndx]

    csNm.textContent = itmNms[ndx]
    csCur.textContent = oi ? oi.querySelector('#ovrwItmDtls').textContent : 'Nothing is selected'
    csDsc.textContent = oi ? oi.querySelector('#ovrwItmDsc').textContent : 'Not Selected'
    csPic.src = oi ? oi.querySelector('#ovrwItmFlg').src : itmImgs[ndx]

    curCmpItm = ndx

    get('/cmp/' + cmpTps[curCmpItm], rsp => {
        let jsn = JSON.parse(rsp).formData
        let itm = csLst.querySelector('div')

        for (let i = 0; i < jsn.ln; i++) {
            itm = i > 0 ? itm.cloneNode(true) : itm
            let cmp = jsn.ar[i]

            itm.querySelector('#cmpSlcItmImg').src =
                cmp.img ? 'data:image/jpg;base64,' + cmp.img : itmImgs[curCmpItm]
            itm.querySelector('#cmpSlcItmNm').textContent = cmp.nm
            itm.querySelector('#cmpSlcItmCst').textContent = '$' + cmp.cst

            itm.addEventListener('click', e => itmClk(e.currentTarget))

            if (i > 0) csLst.append(itm)
        }
    })
}

function hdCs() {
    isCsShwn = false
    cs.style.display = 'none'
}

function sbmtClk(isLd) {
    if (!isLd) {
        hdCs()
        csFnlz()
        shwOvrl(false)

        let b = ovAr[curCmpItm]
        let c = chsnItms[curCmpItm]
        let a = c.querySelector('#cmpSlcItmNm').textContent

        b.querySelector('#ovrwItmDtls').textContent = a

        b.querySelector('#ovrwItmFlg').src =
            c.querySelector('#cmpSlcItmImg').src

        b.querySelector('#ovrwitmCst').textContent =
            c.querySelector('#cmpSlcItmCst').textContent

        get('/dsc/' + a, rsp =>
            b.querySelector('#ovrwItmDsc').textContent = rsp)

        b.querySelector('#ovrwItmDsc').style.display = 'initial'
    }

    let cst = 0
    for (let i = 0; i < itmsLen; i++)
        if (ovAr[i])
            cst += parseInt(ovAr[i].querySelector('#ovrwitmCst').textContent.substr(1))
    cost.textContent = '$' + cst.toString()
}

function srch() {
    const a = csSrch.value
    if (a.length === 0) return

    let b = csLst.querySelectorAll('div')

    let d = null
    for (let i = 0; i < b.length; i++) {
        let c = b[i].querySelector('#cmpSlcItmNm')

        if (c.textContent.indexOf(a) > -1) {
            if (!d) d = c

            c.style.backgroundColor = 'green'
            setTimeout(() => c.style.backgroundColor = csLst.style.backgroundColor, 2000)
        }
    }
    d.scrollIntoView()
}

function loadCmpSlc() {
    cs = document.getElementById('cmpSlc')
    csExt = cs.querySelector('#cmpSlcExt')
    csExt.addEventListener('click', () => {
        csFnlz()
        compItmClck(null, true)
    })
    csNm = cs.querySelector('#cmpSlcNm')
    csPic = cs.querySelector('#cmpSlcPic')

    csNxt = cs.querySelector('#cmpSlcNxt')
    csNxt.addEventListener('click', () => {
        if (curCmpItm + 1 < 0 || curCmpItm + 1 >= itmsLen)
            curCmpItm = -1

        hdCs()
        csFnlz()
        shwOvrl(false)
        compItmClck(++curCmpItm, false)
    })
    csLst = cs.querySelector('#cmpSlcLst')
    csCur = cs.querySelector('#cmpSlcCur')
    csDsc = cs.querySelector('#cmpSlcDsc')

    cs.querySelector('#cmpSlcSbmt').addEventListener('click', () =>
        sbmtClk(false))

    csSrch = cs.querySelector('#cmpSlcSrch')
    csSrch.addEventListener('keyup', () => srch())
}

function loadOvrl() {
    ovrl = document.getElementById('overlay')
    body = document.getElementsByTagName('body')[0]
}

function loadMenuBts() {
    document.getElementById('menuBtVr')
        .addEventListener('click',
            () => { window.location.replace('/browse') })

    document.getElementById('menuBtAbt')
        .addEventListener('click',
            () => { window.location.replace('/about') })
}

function loadOvrw() {
    ovLst = document.getElementById('overview')
    let a = ovLst.querySelector('div')

    for (let i = 0; i < itmsLen; i++) {
        a = i > 0 ? a.cloneNode(true) : a
        if (i > 0) ovLst.append(a)
        a.addEventListener('click', () => compItmClck(i, false))
        ovAr[i] = a
    }
}

const ckLstKy = 'chsnAr'

function saveLst() {
    let b = Array(itmsLen)

    for (let i = 0; i < itmsLen; i++) {
        b[i] = {
            img: ovAr[i].querySelector('#ovrwItmFlg').src,
            dtl: ovAr[i].querySelector('#ovrwItmDtls').textContent,
            cst: ovAr[i].querySelector('#ovrwitmCst').textContent,
            dsc: ovAr[i].querySelector('#ovrwItmDsc').textContent
        }
    }

    sessionStorage.setItem(ckLstKy, JSON.stringify(b))
}

function loadLst() {
    let a
    try { a = sessionStorage.getItem(ckLstKy) }
    catch (_) { a = null }

    let cst = 0
    let c = a ? JSON.parse(a) : null
    for (let i = 0; i < itmsLen; i++) {
        ovAr[i].querySelector('#ovrwItmNm').textContent = itmNms[i]
        ovAr[i].querySelector('#ovrwItmFlg').src = a && c[i].img && c[i].img.indexOf('base64') > -1 ? c[i].img : itmImgs[i]
        ovAr[i].querySelector('#ovrwItmDtls').textContent = a && c[i].dtl ? c[i].dtl : 'Not Selected'
        ovAr[i].querySelector('#ovrwitmCst').textContent = a && c[i].cst ? c[i].cst : '$0'

        if (a && c[i].cst)
            cst += parseInt(c[i].cst.substr(1))

        let b = a && c[i].dsc && c[i].dtl && c[i].dtl.toLowerCase() !== 'Not Selected'.toLowerCase()
        if (b)
            get('/dsc/' + c[i].dtl, rsp =>
                ovAr[i].querySelector('#ovrwItmDsc').textContent = rsp)
        ovAr[i].querySelector('#ovrwItmDsc').style.display = b ? 'initial' : 'none'
    }
    cost.textContent = '$' + cst
}

function clrLst() {
    sessionStorage.removeItem(ckLstKy)
    for (let i = 0; i < itmsLen; i++) {
        ovAr[i].querySelector('#ovrwItmFlg').src = itmImgs[i]
        ovAr[i].querySelector('#ovrwItmDtls').textContent = 'Not Selected'
        ovAr[i].querySelector('#ovrwitmCst').textContent = '$0'

        let a = ovAr[i].querySelector('#ovrwItmDsc')
        a.textContent = 'Not Selected'
        a.style.display = 'none'
    }
    cost.textContent = '$0'
}

window.onload = () => { setTimeout(() => {
    loadCmpSlc()
    loadOvrl()
    loadMenuBts()
    loadOvrw()
    cost = document.getElementById('componentCst')
    loadLst()

    clrOvrw = document.getElementById('clrOvrw')
    clrOvrw.addEventListener('click', () => clrLst())

    loadLog()

    document.getElementById('menuBtAbt')
        .addEventListener('click', () => window.location.replace('/about'))
}, 0) }

window.onbeforeunload = () => saveLst()
