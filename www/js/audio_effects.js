/* URL principal AudioContext  */
// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext


//var context = null;
var osc = null;
var soundSource, concertHallBuffer;


//window.addEventListener('load', init, false);

// *************************************************************
//Funcion de inicio
// *************************************************************
function init() {
    try {
        // creamos el contexto de audio
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API no es soportado por el explorador.');
    }
}

var audioFile = "audios/audio_fiesta.ogg";
var source;
var myArrayBuffer;
var gainNode = context.createGain();

function play(){
    try{
        loadSoundTest(audioFile);
    }
    catch (ex){alert('ERROR. Exception: '+ex.message);}
}

function playFreq(){
    try{
        loadSoundTestFreq(audioFile);
    }
    catch (ex){alert('ERROR. Exception: '+ex.message);}
}

function stop(){
    try{
        if(esIOS()){
            source.noteOff(0);
        }
        else{
            source.stop(0);
        }
    }
    catch (ex){alert('ERROR. Exception: '+ex.message);}
}

function loadSoundTestBuff(url) {
    try
    {
        source = context.createBufferSource(); //this represents the audio source. We need to now populate it with binary data.
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer'; //This asks the browser to populate the retrieved binary data in a array buffer
        request.onload = function(){
            context.decodeAudioData(request.response, function(buffer) {
                source.buffer = buffer;
            }, null);
        }
        request.send();
        alert(source);
        source.connect(context.destination);//destination property is reference the default audio device

        if(esIOS()){
            source.noteOn(0);
        }
        else{
            source.start(0);
        }

    }
    catch (ex){alert('ERROR. Exception: '+ex.message);}
}

/* ------------------------------------------------------------------------------ */
/*                          BUFFER DEL FICHERO                                    */
/* ------------------------------------------------------------------------------ */
function bufferSound(url) {
    try
    {
        source = context.createBufferSource(); //this represents the audio source. We need to now populate it with binary data.
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer'; //This asks the browser to populate the retrieved binary data in a array buffer
        request.onload = function(){
            context.decodeAudioData(request.response, function(buffer) {
                source.buffer = buffer;
            }, null);
        }
        request.send();
    }
    catch (ex9){alert('Web Audio API not supported. Exception: '+ex9.message);}
}

function bufferSoundFreq(url, nChannels, param1, param2) {
    try
    {
        // Stereo
        var channels = 2;
        var frameCount = context.sampleRate * 2.0;
        myArrayBuffer = context.createBuffer(channels, frameCount, context.sampleRate);

        for (var channel = 0; channel < channels; channel++) {
            // This gives us the actual ArrayBuffer that contains the data
            var nowBuffering = myArrayBuffer.getChannelData(channel);
            for (var i = 0; i < frameCount; i++) {
                // Math.random() is in [0; 1.0]
                // audio needs to be in [-1.0; 1.0]
                nowBuffering[i] = Math.random() * 2 - 1;
            }
        }
        source = context.createBufferSource(); //this represents the audio source. We need to now populate it with binary data.
        //source = context.createBufferSource(nChannels, param1, param2); //this represents the audio source. We need to now populate it with binary data.
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer'; //This asks the browser to populate the retrieved binary data in a array buffer
        request.onload = function(){
            context.decodeAudioData(request.response, function(myArrayBuffer) {
                source.buffer = myArrayBuffer;
            }, null);
        }
        request.send();
    }
    catch (ex9){alert('Web Audio API not supported. Exception: '+ex9.message);}
}

function loadSoundTest(url) {
    try
    {
        bufferSound(url);
        source.connect(context.destination);

        if(esIOS()){
            source.noteOn(0);
        }
        else{
            source.start(0);
        }
    }
    catch (ex9){alert('ERROR loadSoundTest. Exception: '+ex9.message);}
}


function loadSoundTestFreq(url) {
    //examples:
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createBiquadFilter

    try
    {
        bufferSound(url);
        //alert(context.sampleRate); // 48000Hz

        /* ----------------------------------------------- */
        //      Speed (velocidad de reproducción)
        /* ----------------------------------------------- */
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
        //      Distorsion
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
        //var gainNode = context.createGain();


        /* ----------------------------------------------- */
        //      biquadFilter (Onda de filtro)
        /* ----------------------------------------------- */
        //https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
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
            alert('Reverb_chk');
            convolver.buffer = undefined;

            convolver.seconds = 1;
            convolver.decay = 1;
            convolver.reverse = 1;
            convolver.buffer = concertHallBuffer;
        }



        /* ----------------------------------------------- */
        //      CONEXION de los NODOS
        /* ----------------------------------------------- */
        source.connect(analyser);
        analyser.connect(compressor);
        compressor.connect(distortion);
        distortion.connect(biquadFilter);
        biquadFilter.connect(context.destination);




        if(esIOS()){
            source.noteOn(0);
        }
        else{
            source.start(0);
        }
    }
    catch (ex9){alert('ERROR loadSoundTest. Exception: '+ex9.message);}
}

function applyEffects() {
    try
    {
        //alert(context.sampleRate); // 48000Hz

        /* ----------------------------------------------- */
        //      Speed (velocidad de reproducción)
        /* ----------------------------------------------- */
        if (document.getElementById('Speed_chk').checked){
            //source.playbackRate.value = rangeSP_Speed_lbl.innerHTML;
            sourceNode.playbackRate.value = rangeSP_Speed_lbl.innerHTML;
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
        //      Distorsion
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
        //var gainNode = context.createGain();


        /* ----------------------------------------------- */
        //      biquadFilter (Onda de filtro)
        /* ----------------------------------------------- */
        //https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
        var biquadFilter = context.createBiquadFilter();
        if (document.getElementById('BiquadFilter_chk').checked){
            // Manipulate the Biquad filter
            // Type : lowshelf, highshelf, peaking
            biquadFilter.type = document.getElementById('rangeBQ_type').value;  //"peaking";
            biquadFilter.frequency.value = rangeBQ_freq_lbl.innerHTML;          //350;    //aprox. frequency human 350
            biquadFilter.gain.value = rangeBQ_gain_lbl.innerHTML;               //25
            biquadFilter.Q.value = rangeBQ_Qf_lbl.innerHTML;                    // nominal range of 0.0001 to 1000.
            biquadFilter.detune.value = rangeBQ_detune_lbl.innerHTML;           //1540;
        }


        /* ----------------------------------------------- */
        //      Reverberación
        /* ----------------------------------------------- */
        var convolver = context.createConvolver();
        if (document.getElementById('Reverb_chk').checked){
            alert('Reverb_chk');
            convolver.buffer = undefined;

            convolver.seconds = 1;
            convolver.decay = 1;
            convolver.reverse = 1;
            convolver.buffer = concertHallBuffer;
        }



        /* ----------------------------------------------- */
        //      CONEXION de los NODOS
        /* ----------------------------------------------- */
        sourceNode.connect(analyser);
        analyser.connect(compressor);
        compressor.connect(distortion);
        distortion.connect(biquadFilter);
        biquadFilter.connect(context.destination);

        /*
        if(esIOS()){
            source.noteOn(0);
        }
        else{
            source.start(0);
        }
        */
    }
    catch (ex9){alert('ERROR loadSoundTest. Exception: '+ex9.message);}
}



/*********************************************************************************************/
/*********************************************************************************************/
//
//                      C O N T R O L       D E       E F E C T O S
//
/*********************************************************************************************/
/*********************************************************************************************/
/* ------------------------------------------------------------------ */
//                          S P E E D
/* ------------------------------------------------------------------ */
var rangeSpeed=0;
function rangeSP_S(){
    try{
        rangeSpeed = rangeSP_Speed.value;
        rangeSP_Speed_lbl.innerHTML = rangeSpeed;
    }
    catch (ex9){alert('Error rangeSP_S. Exception: '+ex9.message);}
}


/* ------------------------------------------------------------------ */
//                          B Q   F I L T E R
/* ------------------------------------------------------------------ */
var rangeBQ=0;

function rangeBQ_G(){
    try{
        rangeBQ = rangeBQ_gain.value;
        rangeBQ_gain_lbl.innerHTML = rangeBQ;
    }
    catch (ex9){alert('Error rangeBQ_G. Exception: '+ex9.message);}
}

function rangeBQ_F(){
    try{
        rangeBQ = rangeBQ_freq.value;
        rangeBQ_freq_lbl.innerHTML = rangeBQ;
    }
    catch (ex9){alert('Error rangeBQ_F. Exception: '+ex9.message);}
}

function rangeBQ_Q(){
    try{
        rangeBQ = rangeBQ_Qf.value;
        rangeBQ_Qf_lbl.innerHTML = rangeBQ;
    }
    catch (ex9){alert('Error rangeBQ_Q. Exception: '+ex9.message);}
}

function rangeBQ_D(){
    try{
        rangeBQ = rangeBQ_detune.value;
        rangeBQ_detune_lbl.innerHTML = rangeBQ;
    }
    catch (ex9){alert('Error rangeBQ_D. Exception: '+ex9.message);}
}


/* ------------------------------------------------------------------ */
//                          A N A L I Z E R
/* ------------------------------------------------------------------ */
//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();

analyser.fftSize = 2048;
var bufferLength = analyser.fftSize;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

function draw() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
};

/* ------------------------------------------------------------------ */
//                          C O M P R E S S O R
/* ------------------------------------------------------------------ */
var rangeComp=0;
function rangeCMP_T(){
    try{
        rangeComp = rangeCMP_threshold.value;
        rangeCMP_threshold_lbl.innerHTML = rangeComp;
    }
    catch (ex9){alert('Error rangeCMP_T. Exception: '+ex9.message);}
}

function rangeCMP_K(){
    try{
        rangeComp = rangeCMP_knee.value;
        rangeCMP_knee_lbl.innerHTML = rangeComp;
    }
    catch (ex9){alert('Error rangeCMP_K. Exception: '+ex9.message);}
}

function rangeCMP_R(){
    try{
        rangeComp = rangeCMP_ratio.value;
        rangeCMP_ratio_lbl.innerHTML = rangeComp;
    }
    catch (ex9){alert('Error rangeCMP_K. Exception: '+ex9.message);}
}

function rangeCMP_D(){
    try{
        rangeComp = rangeCMP_reduction.value;
        rangeCMP_reduction_lbl.innerHTML = rangeComp;
    }
    catch (ex9){alert('Error rangeCMP_D. Exception: '+ex9.message);}
}

function rangeCMP_A(){
    try{
        rangeComp = rangeCMP_attack.value;
        rangeCMP_attack_lbl.innerHTML = rangeComp;
    }
    catch (ex9){alert('Error rangeCMP_A. Exception: '+ex9.message);}
}

function rangeCMP_L(){
    try{
        rangeComp = rangeCMP_release.value;
        rangeCMP_release_lbl.innerHTML = rangeComp;
    }
    catch (ex9){alert('Error rangeCMP_L. Exception: '+ex9.message);}
}


/* ------------------------------------------------------------------ */
//                          D I S T O R T I O N
/* ------------------------------------------------------------------ */
var rangeDist=0;
function rangeDist_C(){
    try{
        rangeDist = rangeDist_curve.value;
        rangeDist_curve_lbl.innerHTML = rangeDist;
    }
    catch (ex9){alert('Error rangeDist_C. Exception: '+ex9.message);}
}


function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
};

/* ------------------------------------------------------------------ */
//                          R E V E R B
/* ------------------------------------------------------------------ */
function reverb() {
    try {
        var url = audioFile;
        source = context.createBufferSource();
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer'; //This asks the browser to populate the retrieved binary data in a array buffer
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                source.buffer = buffer;
            }, null);
        }
        request.send();
        source.connect(context.destination);//destination property is reference the default audio device

        if (esIOS()) {
            source.noteOn(0);
        }
        else {
            source.start(0);
        }
    }
    catch (ex9){alert('Error Reverb. Exception: '+ex9.message);}
} //this represents the audio source. We need to now populate it with binary data.

function reverb_1(){

    //var audioCtx = new window.AudioContext || window.webkitAudioContext;
    var convolver = context.createConvolver();
    var soundSource, concertHallBuffer;
    try{
        source = context.createBufferSource();
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open('GET', audioFile, true);
        ajaxRequest.responseType = 'arraybuffer';

        ajaxRequest.onload = function() {
            context.decodeAudioData(ajaxRequest.response, function(buffer) {
                concertHallBuffer = buffer;
                soundSource = context.createBufferSource();
                soundSource.buffer = concertHallBuffer;

            }, function(e){"Error with decoding audio data" + e.err});
        }
        ajaxRequest.send();
        //convolver.buffer = concertHallBuffer;

        source.connect(convolver);
        convolver.connect(context.destination);

        source.start(0);

    }
    catch (ex9){alert('Error Reverb. Exception: '+ex9.message);}

}


/* ------------------------------------------------------------------ */
//                          C O M U N
/* ------------------------------------------------------------------ */
function esIOS() {
    return(navigator.userAgent.match(/(iPhone|iPod|iPad)/));
}


