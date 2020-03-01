var sqs = [];
var numSq = 8;
// var bpm = 116;
// var msTotal = 1*60*1000 / bpm * 7;
var msTotal = 3102;
var msBetween = msTotal / (numSq - 1);
var n = numSq - 1;
var timeIn;
var circlesIn;

var runN = 0;
var running = false;
var sameBox = false;


window.addEventListener('load', () => {

    loadBuffers();

    timeIn = document.getElementById("totalMs");
    timeIn.value = msTotal;
    circlesIn = document.getElementById("numBoxes");
    circlesIn.value = numSq;

    var start = document.getElementById("container");
    var same = document.getElementById("same").checked;
    makeSqs();
    if (same) {
        msBetween = msTotal / (numSq);
        sameBox = true;
    } else sameBox = false;

    //scheduleRun(runN);

});

function run(a) {
    if (a != runN) return;



    if (n >= numSq) n = numSq - 1;
    sqs[n].className = "timer red";
    n++;
    if (n == numSq) n = 0;
    sqs[n].className = "timer green";
    if (document.getElementById("useSound").checked) {
        var kickVol = document.getElementById("kickVol").value / 100;
        var snareVol = document.getElementById("snareVol").value / 100;
        if (n == 0 || (n == (numSq - 1) && !sameBox)) playSound("kick", kickVol);
        if (document.getElementById("useTriplet").checked && (n == (numSq - 1) || (n == (numSq - 2) && !sameBox))) {
            playSound("snare", snareVol, msBetween / 3000);
            playSound("snare", snareVol, msBetween * 2 / 3000);
        }
        if (document.getElementById("useEighth").checked && (n == (numSq - 1) || (n == (numSq - 2) && !sameBox))) {
            playSound("snare", snareVol, msBetween / 2000);
        }
        if (document.getElementById("useSixteenth").checked && (n == (numSq - 1) || (n == (numSq - 2) && !sameBox))) {
            playSound("snare", snareVol, msBetween / 4000);
            playSound("snare", snareVol, msBetween * 2 / 4000);
            playSound("snare", snareVol, msBetween * 3 / 4000);
        }
        playSound("snare", snareVol);
    }
    scheduleRun(a);
}

function stop() {
    runN++;
    running = false;
    for (var sq of sqs) sq.className = "timer red";
}

function reset() {
    msTotal = timeIn.value;
    numSq = circlesIn.value;
    msBetween = msTotal / (numSq - 1);

    for (var sq of sqs) sq.remove();

    makeSqs();
    n = numSq - 1;
    if (document.getElementById("same").checked) {
        msBetween = msTotal / (numSq);
        sameBox = true;
    } else sameBox = false;

}

function scheduleRun(a) {
    window.setTimeout(run, msBetween, a);
}

function makeSqs() {
    var start = document.getElementById("container");
    var same = document.getElementById("same").checked;
    for (var x = 0; x < numSq; x++) {
        sqs[x] = document.createElement("div");
        sqs[x].className = "timer red";
        start.appendChild(sqs[x]);
        if (x == 0 || (x == numSq - 1 && !same)) {
            var p = document.createElement("p");
            sqs[x].appendChild(p);
            p.textContent = "Y"
        }
    }
}