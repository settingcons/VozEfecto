var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        if(phoneGapRun()) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
        else
        {
            deviceReady();
        }
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        deviceReady();
    }
};

var context;
//var sound;
var source;
var recorder;
var urlAudio;
var audioAnimation;
var sourceNode;
var analyser;
var audio;
var songs;
function deviceReady() {
    try {

        if(esIOS())
        {

            //Crear fichero audio
            window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);

        }
        else{
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, CrearFicheroAudio, ErrorCrearFicheroAudio);

        }


        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

    }
    catch (ex){alert('deviceReady: '+ex.message);}
}





function Reproducir() {
    try {
        limpiarMedia();
        alert('1');
        if (audio) audio.remove();
        alert('2');
        if (sourceNode) sourceNode.disconnect();
        //cancelAnimationFrame(audioAnimation);
        alert('3');
        audio = new Audio();

        if(esIOS()) {
            var v_fichero = _mediaAudioFicheroIOS;

            var v_dir = window.rootFS.toURL();
            v_dir = v_dir.substring("file://".length);
            v_fichero = v_dir + v_fichero;
        }
        else
        {
            v_fichero=ObtenerFicheroAudio();
        }
        alert(v_fichero);
        audio.src = v_fichero;
        alert('5');
        setupAudioNodes();
        alert('6');
    }
    catch (ex){mensaje(ex.message,'loadSong');}
}

function setupAudioNodes() {
    try {
        //analyser = (analyser || context.createAnalyser());
        //analyser.smoothingTimeConstant = 0.8;
        //analyser.fftSize = 512;
        alert(7);
        sourceNode = context.createMediaElementSource(audio);
        //sourceNode.connect(analyser);
        alert(8);
        sourceNode.connect(context.destination);

        alert(9);
        audio.play();
        //drawSpectrum();
        alert(10);
    }
    catch (ex){mensaje(ex.message,'setupAudioNodes');}
}

function drawSpectrum() {
    var freq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freq);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    audioAnimation = requestAnimationFrame(drawSpectrum);
    for (var i = freq.length - 1; i >= 0; i--) {
        var x = i * (bar.width + bar.gap);
        var y = HEIGHT - (freq[i] * bar.ratio);
        ctx.fillRect(x, y, bar.width, HEIGHT);
    }
}
function loadSound(url) {
    try {
        alert(url);

        limpiarMedia();



        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        alert('loadSound1');
        request.onload = function() {
            alert('loadSound2');
            alert(request.response);
            try
            {
                context.decodeAudioData(request.response, function(buffer) {
                    alert('ok');
                    //sound = buffer;
                    playSound(buffer);
                },ErrorLoad);
            }
            catch (ex){mensaje(ex.message,"ERROR on load")}
        }

        request.send();
    }
    catch (ex){alert('loadSound: '+ex.message);}
}

function limpiarMedia()
{
    try {

        var v_fichero = ObtenerFicheroAudio();

        _mediaAudio = new Media(v_fichero, onSuccessAudioPlay, onErrorAudioPlay);
        if (_mediaAudio != null && _mediaAudio) {
            _mediaAudio.play();
            _mediaAudio.stop();
            //_mediaAudio.release();
        }
        _mediaAudio = null;
    }
    catch(ex){mensaje(ex.message,'limpiarMedia');}
}

function ErrorLoad(e) {
    alert('ErrorLoad');
    alert(e);
    mensaje(e.message,'ErrorLoad');
}
function playSound(buffer) {
    try {
        alert('playSound');
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);
        alert('playSound fin');
    }
    catch (ex){mensaje(ex.message,'ERROR playSound');}
}

function pararPlay(){
    source.stop();
}




