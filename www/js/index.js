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
function deviceReady() {
    try {

        if(esIOS())
        {

            //Crear fichero audio
            //window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);

        }

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
    var v_fichero = _mediaAudioFicheroIOS;

    var v_dir=window.rootFS.toURL();
    v_dir=v_dir.substring("file://".length);
    v_dir=v_dir+'tmp/'
    //var v_dir =window.location.href;
    //v_dir=v_dir.substring("file://".length);
    //v_dir = v_dir.substring(0, v_dir.indexOf("/VozEfectoTEST.app/www/index.html"))
    //v_dir=v_dir+"/Documents/";
    alert(v_dir);
    v_fichero=v_dir+v_fichero;
    loadSound(v_fichero);
}



function loadSound(url) {
    try {
        alert(url);
        //var sound;

        if(_mediaAudio!=null)
        {
            _mediaAudio=null;

        }
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

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
                    alert('ok1');
                    playSound(buffer);
                },ErrorLoad);
            }
            catch (ex){mensaje(ex.message,"ERROR on load")}
        }
//        request.onload = function () {
//            // request.response is encoded... so decode it now
//            alert('antes');
//            context.decodeAudioData(request.response, function (buffer) {
//alert('ok');
//                sound = buffer;
//            }, function (err) {
//                alert('error');
//                alert(err.message);
//            });
//        }

        request.send();
    }
    catch (ex){alert('loadSound: '+ex.message);}
}

function ErrorLoad(e) {
    mensaje(e.message,'ErrorLoad');
}
function playSound(buffer) {
    try {
        alert('playSound');
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);
    }
    catch (ex){mensaje(ex.message,'ERROR playSound');}
}

function parar(){
    source.stop();
}
