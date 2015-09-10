/**
 * Created by mvarela on 10/09/2015.
 */

function shareFiles(){
    alert('entra shareFiles');
    try{
        app.openExternalDoc();
        alert('Después openExternalDoc');
    }
    catch (ex){mensaje(ex.message,'ERROR playSound');}
}
