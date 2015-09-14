/**
 * Created by mvarela on 10/09/2015.
 */

function shareFiles(){
    alert('entra shareFiles');
    try{
        //app.openExternalDoc();
        navigator.openExternalDoc();
        alert('Después openExternalDoc');
    }
    catch (ex){mensaje('shareFiles. Error: ' + ex.message,'ERROR Sharing');}
}


var myFile=null;
var myUrl=null;

function obtenerFichero(){

    try {
        var v_fichero = '';
        if(esIOS()) {
            v_fichero = _mediaAudioFicheroIOS;
            var v_dir = window.rootFS.toURL();
            v_dir = v_dir.substring("file://".length);
            v_fichero = v_dir + v_fichero;
        }
        else{
            v_fichero=ObtenerFicheroAudio();
        }
        myFile = v_fichero;
    }
    catch (ex){mensaje('Error: ' + ex.message,'obtenerFichero');}

}




/* -------------------------------------------------------------------------- */
/* ---- PLUGIN -- EddyVerbruggen/SocialSharing-PhoneGap-Plugin -------------- */
/* -------------------------------------------------------------------------- */
/* https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin */

/* Change Pluggin para adjuntar audio en vez de audio: */
/* http://stackoverflow.com/questions/29608287/intel-xdk-share-audio-file
 */

/* ------------------------------------------------------ */
/*          S H A R E    F I L E
 /* ------------------------------------------------------ */
function SocialImage(){

    alert('Entra SocialImage');
    try {
        //obtenerFichero();
        myFile = 'img/shared.png';
        if (myFile.length>0){
            window.plugins.socialsharing.share('Here is your file', 'Your file', myFile);
        }
        else{
            alert('No se ha encontrado fichero para adjuntar');
        }

    }
    catch (ex){mensaje('Error: ' + ex.message,'SocialSharingWhat');}
}

function SocialSharing(){

    try {
        obtenerFichero();
        if (myFile.length>0){
            window.plugins.socialsharing.share('Here is your file', 'Your file', myFile);
        }
        else{
            alert('No se ha encontrado fichero para adjuntar');
        }

    }
    catch (ex){mensaje('Error: ' + ex.message,'SocialSharingWhat');}
}

function SocialSharing_OLD(){

    //alert('entra SocialSharing');
    try {
        var v_fichero = '';
        if(esIOS()) {
            v_fichero = _mediaAudioFicheroIOS;
            var v_dir = window.rootFS.toURL();
            v_dir = v_dir.substring("file://".length);
            v_fichero = v_dir + v_fichero;
        }
        else{
            v_fichero=ObtenerFicheroAudio();
        }

        miFichero = v_fichero;

        window.plugins.socialsharing.share('Here is your WAV file', 'Your WAV', miFichero);
        //alert('Después ejecutar SocialSharing');

    }
    catch (ex){mensaje('Error: ' + ex.message,'SocialSharingWhat');}
}



/* ------------------------------------------------------ */
/*          W H A T S A P P    S H A R E    F I L E
/* ------------------------------------------------------ */
function SocialSharingWhatApp(){

    alert('entra SocialSharingWhatApp');
    try {
        //obtenerFichero();
        myFile = null; //'img/shared.png';
        myUrl = 'https://www.google.es/';
        if (myFile.length>0){
            window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', myFile, myUrl,
                function() {alert('share ok')},
                function(errormsg){alert(errormsg)});
        }
        else{
            alert('No se ha encontrado fichero para adjuntar');
        }

        alert('Después ejecutar SocialSharingWhatApp');

    }
    catch (ex){mensaje('Error: ' + ex.message,'SocialSharingWhatApp');}
}

function SocialSharingWhatApp_OLD(){

    alert('entra SocialSharingWhatApp');
    try {
        var v_fichero = '';
        if(esIOS()) {
            v_fichero = _mediaAudioFicheroIOS;
            var v_dir = window.rootFS.toURL();
            v_dir = v_dir.substring("file://".length);
            v_fichero = v_dir + v_fichero;
        }
        else{
            v_fichero=ObtenerFicheroAudio();
        }

        miFichero = v_fichero;

        //window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', null /* img */, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
        window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', null, miFichero,
            function() {alert('Share OK')},
            function(errormsg){alert(errormsg)});

        alert('Después ejecutar SocialSharingWhatApp');

    }
    catch (ex){mensaje('Error: ' + ex.message,'SocialSharingWhatApp');}
}
