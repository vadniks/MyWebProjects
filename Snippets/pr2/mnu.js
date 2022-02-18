
import { cnts } from './glb.js';

var cnt = parent.document.getElementById("cnt1")

document.getElementById("itm1").onclick = function () {
    cnt.src = cnts[0];
};
document.getElementById("itm2").onclick = function () {
    cnt.src = cnts[1];
};
document.getElementById("itm3").onclick = function () {
    cnt.src = cnts[2];
};
