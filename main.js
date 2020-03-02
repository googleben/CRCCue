var circles = [];
// var bpm = 116;
// var totalLength = 1*60*1000 / bpm * 7;

var running = false;

var totalLength = 3102;
var numberOfCircles = 8;
var sameBox = false;
var playSounds = true;
var kickVol = 1.0;
var snareVol = 1.0;
var useEighth = true;
var useTriplet = false;
var useSixteenth = true; //These values don't do anything, just moved them here from the HTML file

var msBetween = totalLength / (numberOfCircles - 1);
var currentCircle = numberOfCircles - 1;

window.addEventListener('load', () => {
    setDefaultsByURLQuery();
    
    reset();

    scheduleRun();
});

function run() {
    update();
    if (running) {
        circles[currentCircle].className = "timer red";
        currentCircle++;
        if (currentCircle == numberOfCircles) currentCircle = 0;
        circles[currentCircle].className = "timer green";
        if (playSounds) {
            if (currentCircle == 0 || (currentCircle == (numberOfCircles - 1) && !sameBox)) {
                playSound("kick", kickVol, 0);
            }
            if (currentCircle == (numberOfCircles - 1) || (currentCircle == (numberOfCircles - 2) && !sameBox)) {
                if (useEighth) {
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
            playSound("snare", snareVol, 0);
        }
    }
    scheduleRun();
}

function start() {
    if(Object.keys(BUFFERS).length == 0){ //Sounds not loaded yet
        loadBuffers();
    }
    if (!running) {
        running = true;
        reset();
    }
}

function stop() {
    for (var circle of circles) circle.className = "timer red";
    running = false;
}

function reset() {
    update();
    currentCircle = numberOfCircles - 1;
}

function update() {
    totalLength = document.getElementById("totalMs").value;
    numberOfCircles = document.getElementById("numCircles").value;
    sameBox = document.getElementById("same").checked;
    playSounds = document.getElementById("useSound").checked;
    kickVol = document.getElementById("kickVol").value / 100;
    snareVol = document.getElementById("snareVol").value / 100;
    useEighth = document.getElementById("useEighth").checked;
    useTriplet = document.getElementById("useTriplet").checked;
    useSixteenth = document.getElementById("useSixteenth").checked;

    msBetween = totalLength / (numberOfCircles - 1);
    if (same) msBetween = totalLength / (numberOfCircles);

    makeCircles();
}

function setDefaultsByURLQuery(){
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('totalMs')){
        document.getElementById('totalMs').value = urlParams.get('totalMs');
    }
    if(urlParams.has('numCircles')){
        document.getElementById('numCircles').value = urlParams.get('numCircles');
    }
    if(urlParams.has('pressYOn')){
        if(urlParams.get('pressYOn') == "same"){
            document.getElementById('same').checked = true;
        }
        else if(urlParams.get('pressYOn') == "firstLast"){
            document.getElementById('firstLast').checked = true;
        }
    }
    if(urlParams.has('useSound')){
        if(urlParams.get('useSound') == "true"){
            document.getElementById('useSound').checked = true;
        }
        else if(urlParams.get('useSound') == "false"){
            document.getElementById('useSound').checked = false;
        }
    }
    if(urlParams.has('useEighth')){
        if(urlParams.get('useEighth') == "true"){
            document.getElementById('useEighth').checked = true;
        }
        else if(urlParams.get('useEighth') == "false"){
            document.getElementById('useEighth').checked = false;
        }
    }
    if(urlParams.has('useTriplet')){
        if(urlParams.get('useTriplet') == "true"){
            document.getElementById('useTriplet').checked = true;
        }
        else if(urlParams.get('useTriplet') == "false"){
            document.getElementById('useTriplet').checked = false;
        }
    }
    if(urlParams.has('useSixteenth')){
        if(urlParams.get('useSixteenth') == "true"){
            document.getElementById('useSixteenth').checked = true;
        }
        else if(urlParams.get('useSixteenth') == "false"){
            document.getElementById('useSixteenth').checked = false;
        }
    }
    if(urlParams.has('kickVolume')){
        document.getElementById('kickVol').value = urlParams.get('kickVolume');
    }
    if(urlParams.has('snareVolume')){
        document.getElementById('snareVol').value = urlParams.get('snareVolume');
    }
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