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

        if (audio) audio.remove();
        if (sourceNode) sourceNode.disconnect();
        //cancelAnimationFrame(audioAnimation);
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
        audio.src = v_fichero;
        setupAudioNodes();
    }
    catch (ex){mensaje(ex.message,'loadSong');}
}

var miFichero=null;

function Reproducir_MVL() {

    try {
        var v_fichero = '';
        //limpiarMedia();

        if(esIOS()) {
            v_fichero = _mediaAudioFicheroIOS;

            var v_dir = window.rootFS.toURL();
            v_dir = v_dir.substring("file://".length);
            v_fichero = v_dir + v_fichero;
        }
        else
        {
            v_fichero=ObtenerFicheroAudio();
        }
        miFichero = v_fichero;
        loadSound_MVL(miFichero);
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
        //sourceNode.connect(context.destination);

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

function loadSound_MVL(url) {
    try {
        limpiarMedia();

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            try
            {
                context.decodeAudioData(request.response, function(buffer) {
                    playSound_MVL(buffer);
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

function playSound_MVL(buffer) {
    try {
        source = context.createBufferSource();
        source.buffer = buffer;

        if (document.getElementById('Speed_chk').checked){
            source.playbackRate.value = rangeSP_Speed_lbl.innerHTML;
        }

        var analyser = context.createAnalyser();
        //analyser.minDecibels = -90;
        //analyser.maxDecibels = -10;
        //analyser.smoothingTimeConstant = 0.85;

        /* ----------------------------------------------- */
        //      Compressor
        /* ----------------------------------------------- */
        // Create a compressor node
        var compressor = context.createDynamicsCompressor();
        if (document.getElementById('Compressor_chk').checked) {
            compressor.threshold.value = rangeCMP_threshold_lbl.innerHTML;
            compressor.knee.value = rangeCMP_knee_lbl.innerHTML;
            compressor.ratio.value = rangeCMP_ratio_lbl.innerHTML;
            compressor.reduction.value = rangeCMP_reduction_lbl.innerHTML;
            compressor.attack.value = rangeCMP_attack_lbl.innerHTML;
            compressor.release.value = rangeCMP_release_lbl.innerHTML;
        }



        /* ----------------------------------------------- */
        //      Distortion
        /* ----------------------------------------------- */
        var distortion = context.createWaveShaper();
        if (document.getElementById('Distortion_chk').checked){
            var iCurve = makeDistortionCurve(rangeDist_curve_lbl.innerHTML);  //400
            distortion.curve = iCurve; //makeDistortionCurve(rangeDist_curve_lbl.innerHTML);  //400
            distortion.oversample = document.getElementById('rangeDist_over').value;    // '4x'
        }


        /* ----------------------------------------------- */
        //      Gain (Volumen)
        /* ----------------------------------------------- */
        var gainNode = context.createGain();
        gainNode.gain.value = rangeVOL_Gain_lbl.innerHTML;


        /* ----------------------------------------------- */
        //      biquadFilter (Onda de filtro)
        /* ----------------------------------------------- */
        var biquadFilter = context.createBiquadFilter();
        if (document.getElementById('BiquadFilter_chk').checked){
            // Manipulate the Biquad filter
            // Type : lowshelf, highshelf, peaking
            biquadFilter.type = document.getElementById('rangeBQ_type').value;  //"peaking";
            biquadFilter.frequency.value = rangeBQ_freq_lbl.innerHTML;          //350;    //aprox. frequency human 350
            biquadFilter.gain.value = rangeBQ_gain_lbl.innerHTML;               //25
            biquadFilter.Q.value = rangeBQ_Qf_lbl.innerHTML;;                   // nominal range of 0.0001 to 1000.
            biquadFilter.detune.value = rangeBQ_detune_lbl.innerHTML;           //1540;
        }

        /* ----------------------------------------------- */
        //      Reverberación
        /* ----------------------------------------------- */
        var convolver = context.createConvolver();
        if (document.getElementById('Reverb_chk').checked){
            convolver.buffer = null;
            var duration = rangeRV_second_lbl.innerHTML;
            var decay = rangeRV_decay_lbl.innerHTML;
            var reverse = document.getElementById('rangeRV_rev').value;  //true/false

            var impulseBuffer = impulseResponse(duration, decay ,reverse);
            convolver.buffer = impulseBuffer; //concertHallBuffer;
        }



        /* ----------------------------------------------- */
        //      CONEXION de los NODOS
        /* ----------------------------------------------- */
        source.connect(analyser);
        analyser.connect(compressor);
        compressor.connect(distortion);
        distortion.connect(biquadFilter);
        if (document.getElementById('Reverb_chk').checked){
            biquadFilter.connect(convolver);
            convolver.connect(gainNode);
        }
        else{
            biquadFilter.connect(gainNode);
        }
        gainNode.connect(context.destination);



        // - - - - - - - - P L A Y - - - - - - - -
        source.start(0);
    }
    catch (ex){mensaje(ex.message,'ERROR playSound');}
}

function pararPlay(){
    source.stop();
}

