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


        window.AudioContext = window.AudioContext || window.webkitAudioContext;
         context = new AudioContext(),
            songs  = document.getElementById('aVER');
        //    canvas = document.getElementById('songcanvas'),
        //    WIDTH  = canvas.width,
        //    HEIGHT = canvas.height,
        //// get the context from the canvas to draw on
        //    ctx = canvas.getContext('2d'),
        //    gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT),
        //    bar = { width: 2, gap: 2, ratio: HEIGHT / 256 };
        //
        //gradient.addColorStop(1.00,'#000000');
        //gradient.addColorStop(0.75,'#ff0000');
        //gradient.addColorStop(0.25,'#ffff00');
        //gradient.addColorStop(0.00,'#ffff00');
        //ctx.fillStyle = gradient;
        //
        songs.addEventListener('click', loadSong, false);

    }
    catch (ex){alert('deviceReady: '+ex.message);}
}



function Reproducir1(){
    alert('Reproducir1');
    var v_fichero ="testaudio.wav";
    loadSound(v_fichero);
}

function Reproducir(){
    alert('Reproducir');
    //alert(window.location.href);
    //var v_fichero = ObtenerFicheroAudio();
    limpiarMedia();
    var v_fichero = _mediaAudioFicheroIOS;

    var v_dir=window.rootFS.toURL();
    v_dir=v_dir.substring("file://".length);
    //v_dir=v_dir+'tmp/'
    //var v_dir =window.location.href;
    //v_dir=v_dir.substring("file://".length);
    //v_dir = v_dir.substring(0, v_dir.indexOf("/VozEfectoTEST.app/www/index.html"))
    //v_dir=v_dir+"/Documents/";
    alert(v_dir);
    v_fichero=v_dir+v_fichero;
    loadSound(v_fichero);
}
function Reproducir2(){
    try{
        alert('Reproducir2');
        limpiarMedia();

        alert(_inciAudioFichero2);
        //var v_buff=toArrayBuffer(_inciAudioFichero2);
    if(context!=null) {
        if (source != null) {
            //source.stop();
            source.disconnect();
            delete source;
        }
        delete context;
    }

        context = new AudioContext();

        context.decodeAudioData(_inciAudioFichero2, function(buffer) {
            alert('ok');
            //sound = buffer;
            playSound(buffer);
        },ErrorLoad);
    }
    catch (ex){mensaje(ex.message,'Reproducir2');}
}

function Reproducir3()
{
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext(),
        audioAnimation, sourceNode, analyser, audio,
        songs  = document.getElementById('aVER');
    //    canvas = document.getElementById('songcanvas'),
    //    WIDTH  = canvas.width,
    //    HEIGHT = canvas.height,
    //// get the context from the canvas to draw on
    //    ctx = canvas.getContext('2d'),
    //    gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT),
    //    bar = { width: 2, gap: 2, ratio: HEIGHT / 256 };
    //
    //gradient.addColorStop(1.00,'#000000');
    //gradient.addColorStop(0.75,'#ff0000');
    //gradient.addColorStop(0.25,'#ffff00');
    //gradient.addColorStop(0.00,'#ffff00');
    //ctx.fillStyle = gradient;
    //
    songs.addEventListener('click', loadSong, false);
}

function loadSong(e) {
    try {
        e.preventDefault();
        //var url = e.target.href;
        //if (!url) return false;
        alert('1');
        if (audio) audio.remove();
        alert('2');
        if (sourceNode) sourceNode.disconnect();
        //cancelAnimationFrame(audioAnimation);
        alert('3');
        audio = new Audio();

        var v_fichero = _mediaAudioFicheroIOS;

        var v_dir = window.rootFS.toURL();
        v_dir = v_dir.substring("file://".length);
        v_fichero = v_dir + v_fichero;

        alert('4');
        audio.src = v_fichero;
        alert('5');
        audio.addEventListener('canplay', setupAudioNodes, false);
        alert('6');
    }
    catch (ex){mensaje(ex.message,'loadSong');}
}

function setupAudioNodes() {
    try {
        //analyser = (analyser || context.createAnalyser());
        //analyser.smoothingTimeConstant = 0.8;
        //analyser.fftSize = 512;

        sourceNode = context.createMediaElementSource(audio);
        //sourceNode.connect(analyser);
        sourceNode.connect(context.destination);

        audio.play();
        //drawSpectrum();
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




