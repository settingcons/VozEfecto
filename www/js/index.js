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

function deviceReady() {
}

var context = new AudioContext();
var sound;
var source;

function Reproducir1(){
    var v_fichero = _mediaAudioFicheroIOS;
    loadSound(v_fichero);
}

function Reproducir(){
    alert('Reproducir1');
    var v_fichero = ObtenerFicheroAudio();
    loadSound(v_fichero);
}



function loadSound(url) {
    try {
        alert(url);
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                alert('ok');
                sound = buffer;
                playSound(sound);
            });
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

function playSound(buffer) {
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}

function parar(){
    source.stop();
}
