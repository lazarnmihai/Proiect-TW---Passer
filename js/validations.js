
function validateUsername() {
    if (document.getElementById('usernameid').value == "") {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Enter an username!';
        return false;
    } else {
        document.getElementById('message').innerHTML = '';
    }
    return true;
}

function validateEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (document.getElementById('emailid').value.match(mailformat)) {
        document.getElementById('message').style.color = 'rgb(41, 167, 41)';
        document.getElementById('message').innerHTML = 'You have a valid email.';
        return true;
    } else {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'You don&#39;t have a valid email.';
    }
    return false;
}

function validatePassword() {
    if (document.getElementById('passwordid').value.length < 6) {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Password should have at least 6 characters!';
    } else {
        if (document.getElementById('passwordid').value == document.getElementById('confirmPasswordid').value) {
            document.getElementById('message').style.color = 'rgb(41, 167, 41)';
            document.getElementById('message').innerHTML = 'Password match.';
            return true;

        } else {
            document.getElementById('message').style.color = 'rgb(194, 0, 0)';
            document.getElementById('message').innerHTML = 'Passwords do not match!';
        }
    }

    return false;

};

function validateLoginBtn() {
    return validateUsername() && validateEmail() && validatePassword();
}

function validateTitle() {
    if (document.getElementById('titleid').value == "") {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Enter an title!';
        return false;
    } else {
        document.getElementById('message').innerHTML = '';
        return true
    }
}

function validateCategory() {
    if (document.getElementById('category').value == "") {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Enter an category!';
        return false;
    } else {
        document.getElementById('message').innerHTML = '';
        return true;
    }
}

