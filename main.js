var sqs = [];
var numberOfCircles;
// var bpm = 116;
// var totalLength = 1*60*1000 / bpm * 7;
var totalLength;
var msBetween = totalLength / (numberOfCircles - 1);
var n = numberOfCircles - 1;

var runN = 0;
var running = false;
var sameBox = false;


window.addEventListener('load', () => {
    loadBuffers();
    reset();
    
    //scheduleRun(runN);
});

function run(a) {
    if (a != runN) return;

    if (n >= numberOfCircles) n = numberOfCircles - 1;
    sqs[n].className = "timer red";
    n++;
    if (n == numberOfCircles) n = 0;
    sqs[n].className = "timer green";
    if (document.getElementById("useSound").checked) {
        var kickVol = document.getElementById("kickVol").value / 100;
        var snareVol = document.getElementById("snareVol").value / 100;
        if (n == 0 || (n == (numberOfCircles - 1) && !sameBox)) playSound("kick", kickVol);
        if (document.getElementById("useTriplet").checked && (n == (numberOfCircles - 1) || (n == (numberOfCircles - 2) && !sameBox))) {
            playSound("snare", snareVol, msBetween / 3000);
            playSound("snare", snareVol, msBetween * 2 / 3000);
        }
        if (document.getElementById("useEighth").checked && (n == (numberOfCircles - 1) || (n == (numberOfCircles - 2) && !sameBox))) {
            playSound("snare", snareVol, msBetween / 2000);
        }
        if (document.getElementById("useSixteenth").checked && (n == (numberOfCircles - 1) || (n == (numberOfCircles - 2) && !sameBox))) {
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
    totalLength = document.getElementById("totalMs").value;
    numberOfCircles = document.getElementById("numBoxes").value;
    msBetween = totalLength / (numberOfCircles - 1);

    for (var sq of sqs) sq.remove();

    makeSqs();
    n = numberOfCircles - 1;
    if (document.getElementById("same").checked) {
        msBetween = totalLength / (numberOfCircles);
        sameBox = true;
    } else sameBox = false;

}

function scheduleRun(a) {
    window.setTimeout(run, msBetween, a);
}

function makeSqs() {
    var start = document.getElementById("container");
    var same = document.getElementById("same").checked;
    for (var x = 0; x < numberOfCircles; x++) {
        sqs[x] = document.createElement("div");
        sqs[x].className = "timer red";
        start.appendChild(sqs[x]);
        if (x == 0 || (x == numberOfCircles - 1 && !same)) {
            var p = document.createElement("p");
            sqs[x].appendChild(p);
            p.textContent = "Y"
        }
    }
}