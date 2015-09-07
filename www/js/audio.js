function ObtenerFicheroAudio(){
    if(esIOS())
    {
        //alert('ios');
        //return _mediaAudioFicheroIOS;
        return _mediaAudioFicheroIOSFullPath;
    }
    else
    {
        //alert('no ios');
        return _mediaAudioFichero;
    }
}

function AudioGrabacionConfirma() {
    try{
        var v_mensaje = "s'està gravant al teu missatge de veu...";
        var v_titulo = "Gravació";
        var v_botones = "Finalitzar,Descartar";

        //var v_imagen = document.getElementById('imgAudioPlay');
        //v_imagen.src = "images/play_gray.png";

        //Iniciar Grabación
        var v_fichero=ObtenerFicheroAudio();
        _mediaAudio = new Media(v_fichero,onSuccessAudio,onErrorAudio);
        _mediaAudio.startRecord();

        if(navigator.notification && navigator.notification.confirm){
            navigator.notification.confirm(v_mensaje,AudioGrabacion,v_titulo,v_botones);
        }
        else
        {
            var v_retorno = confirm(v_mensaje);
            if (v_retorno){
                AudioGrabacion(1);
            }
            else {
                AudioGrabacion(2);
            }
        }
    }
    catch (ex){mensaje(ex.message,"error");}
}
function onSuccessAudio() {
}

function onErrorAudio(error) {
    _inciAudioFichero='';
    mensaje(error.message,"error");
}

function AudioGrabacion(respuesta){
    try{
        //Finalizar grabación
        _mediaAudio.stopRecord();
        if (respuesta==1) {
            if(esIOS())
            {
                window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, ConvertirFicheroAudioToBase64IOS, onErrorAudio);
                //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirFicheroAudioToBase64IOS, onErrorAudio);

            }
            else {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirFicheroAudioToBase64, onErrorAudio);
            }
        }
        else{
            _inciAudioFichero='';
            //var imagen = document.getElementById('buttonAudioPlay');
            //imagen.src = "images/play_gray.png";
        }
    }
    catch (ex){mensaje(ex.message,"error");}

}

function ConvertirFicheroAudioToBase64(fileSystem) {
    fileSystem.root.getFile(_mediaAudioFichero, null, LeerFicheroAudio, onErrorAudio);
}
function LeerFicheroAudio(fileEntry) {
    fileEntry.file(LeerFicheroAudioOK, onErrorAudio);
}
// the file is successfully retreived
function LeerFicheroAudioOK(file){
    TransformarFicheroAudioToBase64(file);
}
// turn the file into a base64 encoded string, and update the var base to this value.
function TransformarFicheroAudioToBase64(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        _inciAudioFichero = evt.target.result;
        _inciAudioFichero  =   _inciAudioFichero.toString().substring(_inciAudioFichero.toString().indexOf(",")+1);
        //var imagen = document.getElementById('imgAudioPlay');
        //imagen.src = "images/play_red.png";
    };
    reader.readAsDataURL(file);
}

function MostrarAudioReproducir(){
    if (_inciAudioFichero !='') {
        $('#divDatosIncidenciaAudioPlay').show();
    }
    else{
        mensaje("No hi ha fitxer d'àudio per reproduir","avís");
    }
}
function AudioReproducir(){
    try {

        //if (_inciAudioFichero != '') {

            //Iniciar Reprodución
            //var v_src="data:audio/mpeg;base64," +_inciAudioFichero;
            var v_fichero = ObtenerFicheroAudio();

        _mediaAudio = new Media(v_fichero, onSuccessAudioPlay, onErrorAudioPlay);
            _mediaAudio.play();
            if (_mediaTimer == null) {
                _mediaTimer = setInterval(function () {
                    // get my_media position
                    _mediaAudio.getCurrentPosition(
                        // success callback
                        function (position) {
                            if (position > -1) {
                                var iPos = parseInt(position);
                                setAudioPosition(iPos + " seg.");
                            }
                        },
                        // error callback
                        function (e) {
                            setAudioPosition("Error: " + e.message);
                        }
                    );
                }, 1000);
            }
        //}
    }
    catch (ex){mensaje(ex.message,'Error AudioReproducir')}

}

function setAudioPosition(position) {
    //document.getElementById('audio_position').innerHTML = position;
    //document.getElementById('audio_position').style.color='#b80529';
}

function onSuccessAudioPlay() {
}

function onErrorAudioPlay(error) {
    if(error!=null && error.message!=null) {
        mensaje(error.message, "error");
    }
}

function stopAudio() {
    if(_mediaAudio!=null && _mediaAudio){
        _mediaAudio.stop();
    }
    clearInterval(_mediaTimer);
    _mediaTimer=null;
}

function pauseAudio() {
    if(_mediaAudio!=null && _mediaAudio) {
        _mediaAudio.pause();
    }
}


function cerrarAudio() {
    if(_mediaAudio!=null && _mediaAudio) {
        _mediaAudio.stop();
    }
    _mediaAudio=null;
    _mediaTimer=null;
    //$('#divDatosIncidenciaAudioPlay').hide();
}

//--------------------------------------------------------------------------------------------
//Tratar audio IOS
//--------------------------------------------------------------------------------------------
function ErrorCrearFicheroAudioIOS() {
    if(error!=null && error.message!=null) {
        mensaje(error.message, "Error creació fitxer audio");
    }
    else
    {
        mensaje(error, "Error creació fitxer audio");
    }
}
function CrearFicheroAudioIOS(fileSystem) {
    try{
        window.rootFS=fileSystem.root;
        alert(fileSystem.root.toURL());
    }
    catch(ex){mensaje(ex.message,"ERROR root")}
    fileSystem.root.getFile(_mediaAudioFicheroIOS, {create: true, exclusive: false}, CrearFicheroAudioIOSCorrecto, CrearFicheroAudioIOSError);
}

function CrearFicheroAudioIOSError(error) {
    if(error!=null && error.message!=null) {
        mensaje("Error creació fitxer audio:\n"+error.message, "error");
    }
}

function CrearFicheroAudioIOSCorrecto(fileEntry) {
    _mediaAudioFicheroIOSFullPath=fileEntry.fullPath;

}

function ConvertirFicheroAudioToBase64IOS(fileSystem) {
    fileSystem.root.getFile(_mediaAudioFicheroIOS,{create: false,exclusive:false}, LeerFicheroAudioIOS, onErrorAudio);
}

function LeerFicheroAudioIOS(fileEntry) {
    fileEntry.file(LeerFicheroAudioOKIOS, onErrorAudio);
}

function LeerFicheroAudioOKIOS(file){
    TransformarFicheroAudioToBase64IOS(file);
}

function TransformarFicheroAudioToBase64IOS(file) {
    file.type='audio/wav';
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        alert(evt.target.result);
        _inciAudioFichero2 = evt.target.result;
        _inciAudioFichero  =   _inciAudioFichero2.toString().substring(_inciAudioFichero2.toString().indexOf(",")+1);
        //var imagen = document.getElementById('imgAudioPlay');
        //imagen.src = "images/play_red.png";
    };
    reader.readAsDataURL(file);
}
