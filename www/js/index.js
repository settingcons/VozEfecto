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
var sound;
var source;
function deviceReady() {
    try {

        if(esIOS())
        {

            //Crear fichero audio
            window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);
            //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, CrearFicheroAudioIOS, ErrorCrearFicheroAudioIOS);

        }
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

    }
    catch (ex){alert('deviceReady: '+ex.message);}
}


function Reproducir1(){
    alert('Reproducir1');
    var v_fichero = _mediaAudioFicheroIOS;
    loadSound(v_fichero);
}

function Reproducir(){
    alert('Reproducir');
    var v_fichero = ObtenerFicheroAudio();
    loadSound(v_fichero);
}



function loadSound(url) {
    try {
        alert(url);
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        alert('loadSound1');
        request.onload = function() {
            alert('loadSound2');
            context.decodeAudioData(request.response, function(buffer) {
                alert('ok');
                sound = buffer;
                playSound(sound);
            },ErrorLoad);
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
    alert(e.message);
}
function playSound(buffer) {
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}

function parar(){
    source.stop();
}
