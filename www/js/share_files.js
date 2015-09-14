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
function mostratImg(){
    document.getElementById('imgShared2').src = 'img/shared2.jpeg';
}

function ShareImage(){

    alert('Entra ShareImage');
    try {
        myFile = 'img/shared2.gif';
        if (myFile.length>0){
            try {
                window.plugins.socialsharing.shareViaWhatsApp('Share message via WhatsApp', myFile, null,
                    function() {alert('share ok')},
                    function(errormsg){alert(errormsg)});
            }
            catch (ex1) {
                try{
                    //window.plugins.socialsharing.share('Here is your file', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl/');
                    window.plugins.socialsharing.share('Share: ' + myFile, 'the file', myFile);
                }
                catch (ex2){mensaje('Error shareViaWhatsApp: ' + ex2.message,'ShareImage');}
            }

        }
        else{
            alert('No se ha encontrado fichero para adjuntar');
        }

    }
    catch (ex){mensaje('Error socialsharing: ' + ex.message,'ShareImage');}
}


function SocialImage(){

    alert('Entra SocialImage');
    try {
        //obtenerFichero();
        myFile = 'img/shared2.jpeg';
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


     //window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', null /* img */, null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})"

    alert('entra SocialSharingWhatApp');
    try {
        obtenerFichero();
        alert(myFile);
        if (myFile != null){
            if (myFile.length>0){
                window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', myFile, null,
                    function() {alert('share ok')},
                    function(errormsg){alert(errormsg)});
            }
            else{
                alert('No se ha encontrado fichero para adjuntar');
            }
        }
        else{
            myUrl = 'https://www.google.es/';
            if (myUrl !=null){
                if (myUrl.length>0){
                    window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', null, myUrl,
                        function() {alert('share ok')},
                        function(errormsg){alert(errormsg)});
                }
                else{
                    alert('No se ha encontrado fichero para adjuntar');
                }
            }
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
