function validateUsername() {
    if (document.getElementById('usernameid').value == "") {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Enter an username!';
    }
}

function validateEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (document.getElementById('emailid').value.match(mailformat)) {
        document.getElementById('message').style.color = 'rgb(41, 167, 41)';
        document.getElementById('message').innerHTML = 'You have a valid email.';
        return true;
    } else {
        document.getElementById('message').style.color = 'rgb(41, 167, 41)';
        document.getElementById('message').innerHTML = 'You have a valid email.';
        return false;
    }
}

function validatePassword() {
    if (document.getElementById('passwordid').value == document.getElementById('confirmPasswordid').value) {
        document.getElementById('message').style.color = 'rgb(41, 167, 41)';
        document.getElementById('message').innerHTML = 'Password match.';
    } else {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Passwords do not match!';
    }
};