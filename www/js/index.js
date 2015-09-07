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
function deviceReady() {
    try {

        if(esIOS())
        {

            //Crear fichero audio
            window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);

        }

        window.URL = window.URL || window.webkitURL;
        navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

    }
    catch (ex){alert('deviceReady: '+ex.message);}
}


function Grabar(){
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, onSuccessGrabar, onFailGrabar);
    } else {
        mensaje('navigator.getUserMedia not present','Grabar');
    }

}

function onSuccessGrabar(s)
{
    var mediaStreamSource = context.createMediaStreamSource(s);
    recorder = new Recorder(mediaStreamSource);
    recorder.record();
}

function onFailGrabar(error){
    mensaje(error,'onFailGrabar');
}

function Parar(){
    function stopRecording() {
        recorder.stop();
        recorder.exportWAV(function(s) {
            urlAudio = window.URL.createObjectURL(s);
            alert(urlAudio);
        });
    }
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
if(context==null){
    context = new AudioContext();

}

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
    alert('Reproducir3');
    loadSound(urlAudio);
}

function loadSound(url) {
    try {
        alert(url);

        //limpiarMedia();



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
            _mediaAudio.release();
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
