var circles = [];
// var bpm = 116;
// var totalLength = 1*60*1000 / bpm * 7;
var msBetween = totalLength / (numberOfCircles - 1);
var currentCircle = numberOfCircles - 1;

var nextTimeout = 0;

var totalLength = 3102;
var numberOfCircles = 8;
var sameBox = false;
var playSounds = true;
var kickVol = 1.0;
var snareVol = 1.0;
var useEight = true;
var useTriplet = false;
var useSixteenth = true;

window.addEventListener('load', () => {
    loadBuffers();
    reset();

    //scheduleRun();
});

function run() {
    update();
    if (currentCircle >= numberOfCircles) currentCircle = numberOfCircles - 1;
    circles[currentCircle].className = "timer red";
    currentCircle++;
    if (currentCircle == numberOfCircles) currentCircle = 0;
    circles[currentCircle].className = "timer green";
    if (playSounds) {
        if (currentCircle == 0 || (currentCircle == (numberOfCircles - 1) && !sameBox)) playSound("kick", kickVol);
        if (currentCircle == (numberOfCircles - 1) || (currentCircle == (numberOfCircles - 2) && !sameBox)) {
            if (useEight) {
                playSound("snare", snareVol, msBetween / 2000);
            }
            if (useTriplet) {
                playSound("snare", snareVol, msBetween / 3000);
                playSound("snare", snareVol, msBetween * 2 / 3000);
            }
            if (useSixteenth) {
                playSound("snare", snareVol, msBetween / 4000);
                playSound("snare", snareVol, msBetween * 2 / 4000);
                playSound("snare", snareVol, msBetween * 3 / 4000);
            }
        }
        playSound("snare", snareVol);
    }
    scheduleRun();
}

function start() {
    if (nextTimeout == 0) {
        reset();
        scheduleRun();
    }
}

function stop() {
    for (var circle of circles) circle.className = "timer red";
    if (nextTimeout != 0) {
        clearTimeout(nextTimeout);
        nextTimeout = 0; //not running
    }
}

function reset() {
    update();
    currentCircle = numberOfCircles - 1;
}

function update() {
    totalLength = document.getElementById("totalMs").value;
    numberOfCircles = document.getElementById("numBoxes").value;
    sameBox = document.getElementById("same").checked;
    playSounds = document.getElementById("useSound").checked;
    kickVol = document.getElementById("kickVol").value / 100;
    snareVol = document.getElementById("snareVol").value / 100;
    useEight = document.getElementById("useEighth").checked;
    useTriplet = document.getElementById("useTriplet").checked;
    useSixteenth = document.getElementById("useSixteenth").checked;

    msBetween = totalLength / (numberOfCircles - 1);
    if (same) msBetween = totalLength / (numberOfCircles);

    makeCircles();
}

function scheduleRun() {
    nextTimeout = window.setTimeout(run, msBetween);
}

function makeCircles() {
    for (var circle of circles) circle.remove(); //remove all existing circles
    circles = [];
    var container = document.getElementById("container");
    var same = document.getElementById("same").checked;
    for (var x = 0; x < numberOfCircles; x++) {
        circles[x] = document.createElement("div");
        circles[x].className = "timer red";
        container.appendChild(circles[x]);

        if (x == 0 || (x == numberOfCircles - 1 && !same)) { //add Y to circle if first or (last AND same selected)
            var p = document.createElement("p");
            circles[x].appendChild(p);
            p.textContent = "Y"
        }
    }
}