/* alert */
function alert(message, title) {
    // delete alert elements
    document.querySelectorAll('.alert').forEach(el=>{
        el.remove();
    });


    let html = '<div class="alert alert-warning alert-dismissible" role="alert">';
    if(title != undefined)
        html += '<h4 class="alert-heading">' + title + '</h4>';
    html += '<div>' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    html += '</div>';

    jQuery('body').append(dialog);
}
/* //alert */