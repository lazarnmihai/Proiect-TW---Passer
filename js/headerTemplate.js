function updateHeaderWithLoggedInUser() {
    var request = $.ajax({
        url: "/getLoggedInUser",
        type: "get",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    request.done(function (jqXHR, textStatus, response) {
        if (!response.responseJSON.error_code) {
            $("#regLogHeader").text(response.responseJSON.username + ' ' +  response.responseJSON.email)
        } else {
            console.log("ceva eroare " + response.responseText)
        }
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown)
    })
}
$(document).ready(function () {
    updateHeaderWithLoggedInUser();
})
