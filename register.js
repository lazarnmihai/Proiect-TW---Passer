$(document).ready(function () {
    $("#registerSubmitButton").click(function () {
        var serializedData = $("#registerForm").serialize();

        var request = $.ajax({
            url: "register",
            type: "post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: serializedData
        });

        request.done(function (jqXHR, textStatus, response) {
            if (!response.responseJSON.error_code) {
                document.getElementById('message').style.color = 'rgb(41, 167, 41)';
                document.getElementById('message').innerHTML = 'Successful registration with username '
                    + response.responseJSON.username + " and email " + response.responseJSON.email + ".";
            } else {
                document.getElementById('message').style.color = 'rgb(41, 167, 41)';
                document.getElementById('message').innerHTML = response.responseJSON.error_message;
            }
            $("#registerResultMessage").text(response.responseJSON.responseText);
        })

        request.fail(function (jqXHR, textStatus, errorThrown) {
            document.getElementById('message').style.color = 'rgb(41, 167, 41)';
            document.getElementById('message').innerHTML = "Something failed. Please retry."
            $("#registerFail").text(errorThrown);
        })
        return false;
    })
})
