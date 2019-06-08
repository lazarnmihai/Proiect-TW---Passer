$(document).ready(function () {
    $("#loginSubmitButton").click(function () {
        var serializedData = $("#loginForm").serialize();

        var request = $.ajax({
            url: "login",
            type: "post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: serializedData
        });

        request.done(function (jqXHR, textStatus, response) {
            if (!response.responseJSON.error_code) {
                document.getElementById('message').style.color = 'rgb(41, 167, 41)';
                document.getElementById('message').innerHTML = 'Successful login with username '
                    + response.responseJSON.username;
            } else {
                document.getElementById('message').style.color = 'rgb(41, 167, 41)';
                document.getElementById('message').innerHTML = response.responseJSON.error_message;
            }
        })

        request.fail(function (jqXHR, textStatus, errorThrown) {
            document.getElementById('message').style.color = 'rgb(41, 167, 41)';
            document.getElementById('message').innerHTML = "Something failed. Please retry."
        })
        return false;
    })
})