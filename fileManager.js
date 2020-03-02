// Keep track of all loaded buffers.
var BUFFERS = {};
// Page-wide audio context.
var context = new AudioContext();;

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}


// An object to track the buffers to load {name: path}
var BUFFERS_TO_LOAD = {
    kick: 'kick.wav',
    snare: 'snare.wav',
};

// Loads all sound samples into the buffers object.
function loadBuffers() {
    // Array-ify
    var names = [];
    var paths = [];
    for (var name in BUFFERS_TO_LOAD) {
        var path = BUFFERS_TO_LOAD[name];
        names.push(name);
        paths.push(path);

    }
    bufferLoader = new BufferLoader(context, paths, function(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {
            var buffer = bufferList[i];
            var name = names[i];
            BUFFERS[name] = buffer;
        }
    });
    bufferLoader.load();
}

function playSound(sound, vol, time) {
    var buffer;
    if (sound === "kick") buffer = BUFFERS.kick;
    if (sound === "snare") buffer = BUFFERS.snare;
    var source = context.createBufferSource();
    source.buffer = buffer;
    var gainNode = context.createGain();
    source.connect(gainNode);
    gainNode.gain.value = vol;
    gainNode.connect(context.destination);

    source.start(context.currentTime + time);
}