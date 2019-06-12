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
                document.getElementById('messageLoggedIn').style.color = 'rgb(41, 167, 41)';
                document.getElementById('messageLoggedIn').innerHTML = 'Successful login with username '
                    + response.responseJSON.username;
                window.location.replace("/home.htmnl");
                //disable form
                document.getElementById('usernameid').disabled = true;
                document.getElementById('passwordid').disabled = true;
                document.getElementById('logoutSubmitButton').disabled = false;
                document.getElementById('loginSubmitButton').disabled = false;

            } else {
                document.getElementById('messageLoggedIn').style.color = 'rgb(194, 0, 0)';
                document.getElementById('messageLoggedIn').innerHTML = response.responseJSON.error_message;
            }
        })

        request.fail(function (jqXHR, textStatus, errorThrown) {
            document.getElementById('messageLoggedIn').style.color = 'rgb(194, 0, 0)';
            document.getElementById('messageLoggedIn').innerHTML = "Something failed. Please retry."
        })
        return false;
    })
})