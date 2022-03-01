import { loadLog } from "./global.js"

window.onload = () => { setTimeout(() => {
    loadLog()
    document.getElementById('menuBtVr')
        .addEventListener('click', () => window.location.replace('/'))
    document.getElementById('menuBtLog')
        .addEventListener('click', () => window.location.replace('/login'))
}, 0) }
