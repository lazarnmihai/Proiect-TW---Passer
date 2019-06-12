$(document).ready(function () {
    $("#addAccountButton").click(function () {
        var serializedData = $("#addNewAccForm").serialize();

        if (!(validateLoginBtn() && validateTitle())){
            return;    
        }
        var request = $.ajax({
            url: "addNewAccount",
            type: "post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: serializedData
        });

        request.done(function (jqXHR, textStatus, response) {
            if (!response.responseJSON.error_code) {
                document.getElementById('messageAddNewAcc').innerHTML = 'rgb(41, 167, 41)';
                document.getElementById('messageAddNewAcc').innerHTML = 'Successful registration with: ' +"<br>"
                    + response.responseJSON.title ;
            } else {
                document.getElementById('messageAddNewAcc').style.color = 'rgb(194, 0, 0)';
                document.getElementById('messageAddNewAcc').innerHTML = response.responseJSON.error_message;
            }
            //$("#registerResultMessage").text(response.responseJSON.responseText);
        })

        if(request.fail(function (jqXHR, textStatus, errorThrown) {
            document.getElementById('message').style.color = 'rgb(194, 0, 0)';
            document.getElementById('message').innerHTML = "Something failed. Please retry."
        })){
                 return false;
        }
    })
})
