const itmsLen = 10
const itmNms = [
    "Processor",
    "Motherboard",
    "Graphics Card",
    "System Memory",
    "Hard Drive",
    "SSD",
    "Power Supply Unit",
    "CPU Cooler",
    "Case",
    "Operating System"
]
const cmpTps = [ 'cpu', 'mb', 'gpu', 'ram', 'hdd', 'ssd', 'psu', 'fan', 'cas', 'os' ]
const itmImgs = [
    '../res/pc_cpu.jpg',
    '../res/pc_mb.jpg',
    '../res/pc_gpu.jpg',
    '../res/pc_ram.jpg',
    '../res/pc_hdd.jpg',
    '../res/pc_ssd.jpg',
    '../res/pc_psu.jpg',
    '../res/pc_cooler.jpg',
    '../res/pc_case.jpg',
    '../res/pc_os.jpg'
]

function mth(mth, url, clbk, prm = null) {
    let rq = new XMLHttpRequest()
    rq.onreadystatechange = () => {
        if (rq.readyState === 4 && rq.status === 200)
            prm != null ? clbk(rq.response, prm) : clbk(rq.response)
    }
    rq.open(mth, url, true)
    rq.send(null)
}

function get(url, clbk, prm = null) {
    mth('GET', url, clbk, prm)
}

function pst(url, clbk, prm = null) {
    mth('POST', url, clbk, prm)
}

const lgnKy = 'lgnky'

function loadLog(chLg = true) {
    let log = document.getElementById('menuBtLog')
    let c
    try { c = sessionStorage.getItem(lgnKy) }
    catch (_) { c = null }
    const isLgIn = c === true.toString()

    if (!chLg) return isLgIn

    if (log && isLgIn)
        log.textContent = 'Administrate'

    if (log)
        log.addEventListener('click', () =>
            window.location.replace(!isLgIn ? '/login' : '/admn'))

    return isLgIn
}

export { itmsLen, itmNms, cmpTps, itmImgs, get, lgnKy, loadLog, pst }
