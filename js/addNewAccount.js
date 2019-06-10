$(document).ready(function () {
    $("#addAccountButton").click(function () {
        var serializedData = $("#addNewAccForm").serialize();

        var request = $.ajax({
            url: "addNewAccount",
            type: "post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: serializedData
        });

        request.done(function (jqXHR, textStatus, response) {
            if (!response.responseJSON.error_code  ) {
                document.getElementById('messageRegister').innerHTML = 'rgb(41, 167, 41)';
                document.getElementById('messageRegister').innerHTML = 'Successful registration with '
                    + response.responseJSON.title ;
            } else {
                document.getElementById('messageRegister').style.color = 'rgb(194, 0, 0)';
                document.getElementById('messageRegister').innerHTML = "Complete all the fields!";
            }
            //$("#registerResultMessage").text(response.responseJSON.responseText);
        })

        request.fail(function (jqXHR, textStatus, errorThrown) {
            document.getElementById('message').style.color = 'rgb(194, 0, 0)';
            document.getElementById('message').innerHTML = "Something failed. Please retry."
            $("#registerFail").text(errorThrown);
        })
        return false;
    })
})