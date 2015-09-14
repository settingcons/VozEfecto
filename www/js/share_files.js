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






/* -------------------------------------------------------------------------- */
/* ---- PLUGIN -- EddyVerbruggen/SocialSharing-PhoneGap-Plugin -------------- */
/* -------------------------------------------------------------------------- */
/* https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin */

function SocialSharing(){

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
    catch (ex){mensaje(ex.message,'SocialSharingWhat');}
}

function SocialSharingWhatApp(){

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
        window.plugins.socialsharing.shareViaWhatsApp('Message via WhatsApp', miFichero, miFichero,
                function() {alert('share ok')},
                function(errormsg){alert(errormsg)});

        alert('Después ejecutar SocialSharingWhatApp');

    }
    catch (ex){mensaje(ex.message,'SocialSharingWhatApp');}

}
