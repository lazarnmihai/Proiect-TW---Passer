$(document).ready(function() {
    $("#registerSubmitButton").click(function() {
        var serializedData = $("#registerForm").serialize();

        var request = $.ajax({
            url: "register",
            type: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: serializedData
        });

        request.done(function(jqXHR, textStatus, response) {
            $("#registerResultMessage").text(response.responseText);
        })

        request.fail(function(jqXHR, textStatus, errorThrown){
            $("#registerFail").text(errorThrown);
        })
        return false;
    })
})

function validateUsername(){
    if(document.getElementById('usernameid').value == ""){
    document.getElementById('message').style.color = 'rgb(194, 0, 0)';
    document.getElementById('message').innerHTML = 'Enter an username!';
    }
}

function validateEmail(){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(document.getElementById('emailid').value.match(mailformat)){
        document.getElementById('message').style.color = 'rgb(41, 167, 41)';
        document.getElementById('message').innerHTML = 'You have a valid email.';
        return true;
    }else{
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'You have entered an invalid email address!';
        return false;
    }
}

function validatePassword(){

    if(document.getElementById('passwordid').value==document.getElementById('confirmPasswordid').value){
        document.getElementById('message').style.color = 'rgb(41, 167, 41)';
        document.getElementById('message').innerHTML = 'Password match.';
    } else {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Passwords do not match!';
    }
};
