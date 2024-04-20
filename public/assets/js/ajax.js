const pop_send = {
        content : '<div class="spinner-border text-primary" role="status"></div>',
        html: true,
        placement : 'top', 
        template : '<div class="popover border-primary mb-4" role="tooltip"><div class="popover-body"></div></div>'
        };
const pop_success = {
        content : '<h6 class="text-success text-center m-0">Message envoyé avec succès.</h6>',
        html: true,
        placement : 'top', 
        template : '<div class="popover border-success mb-4" role="tooltip"><div class="popover-body"></div></div>'
        };
const pop_error = {
        content : '<h6 class="text-danger text-center m-0">Une erreur s\'est produite lors de l\'envoi de votre message.<br>Merci de réessayer.</h6>',
        html: true,
        placement : 'top', 
        template : '<div class="popover border-danger mb-4" role="tooltip"><div class="popover-body"></div></div>'
        };
const pop_email_invalid = {
        content : '<h6 class="text-danger text-center m-0">Email non valide.</h6>',
        html: true,
        placement : 'top', 
        template : '<div class="popover border-danger mb-4" role="tooltip"><div class="popover-body"></div></div>'
        };

/***
 *     █████╗      ██╗ █████╗ ██╗  ██╗
 *    ██╔══██╗     ██║██╔══██╗╚██╗██╔╝
 *    ███████║     ██║███████║ ╚███╔╝ 
 *    ██╔══██║██   ██║██╔══██║ ██╔██╗ 
 *    ██║  ██║╚█████╔╝██║  ██║██╔╝ ██╗
 *    ╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
 *                                    
 */

requeteXHR = function(route, dataPost, action){
    console.info("Début requête XHR...");
    let reqXhr = new XMLHttpRequest();
    let data = dataPost;
    reqXhr.onload = function(){action(reqXhr.responseText, reqXhr.status)};
    reqXhr.onerror = function(){action(reqXhr.responseText, reqXhr.status)};
    reqXhr.onabort = function(){action(reqXhr.responseText, reqXhr.status)};
    reqXhr.open("POST", route);
    reqXhr.send(data);
}

returnSendMsg = function(responseXhr = null , responseStatus = null){
    console.info("Retour requête XHR : envoi d'email...");
    $('#btn_send').popover('dispose');
    try {
        if (responseXhr != null && responseStatus == 200) {
            let resultSendMsg = JSON.parse(responseXhr);
            if (resultSendMsg.statusMail) {
                console.info("Retour requête XHR : envoi email OK");
                $('#btn_send').popover(pop_success);
                $('#btn_send').popover('show');
            } else {
                throw true;
            }
        } else {
            throw true;
        }
    } catch(error) {
        console.warn("Retour requête XHR : envoi email KO");
        $('#btn_send').popover(pop_error);
        $('#btn_send').popover('show');
    }
    setTimeout(function(){$('#btn_send').popover('dispose')}, 3000);
}

verificationEmail = function(email) {
    let reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
    return(reg.test(email));
}

document.querySelector("#btn_send").addEventListener("click", function(event){
    event.preventDefault();
    let email = document.querySelector("[type='email']");
    if (verificationEmail(email.value)) {
        console.info("Email OK");
        let dataForm = new FormData(document.querySelector("#form_send_msg"));
        $('#btn_send').popover(pop_send);
        $('#btn_send').popover('show');
        requeteXHR("backend.php", dataForm, returnSendMsg); // voir si l'on peut mettre des valeurs par défaut du type returnSendMsg(null, null)
    } else {
        console.warn('Email non valide');
        $(email).popover(pop_email_invalid);
        $(email).popover('show');
        email.addEventListener('focus', () => $('[type="email"]').popover('dispose'));
    }
});
