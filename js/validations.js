
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

function validatePasswordStrength() {
				
	password = document.getElementById('passwordid').value;
	// Do not show anything when the length of password is zero.
	if (password.length === 0) {
		document.getElementById("messagePassword").innerHTML = "";
		return;
	}
	// Create an array and push all possible values that you want in password
	var matchedCase = new Array();
	matchedCase.push("[@#$%&*]"); // Special Charector
	matchedCase.push("[A-Z]");      // Uppercase Alpabates
	matchedCase.push("[0-9]");      // Numbers
	matchedCase.push("[a-z]");     // Lowercase Alphabates

	// Check the conditions
	var ctr = 0;
	for (var i = 0; i < matchedCase.length; i++) {
		if (new RegExp(matchedCase[i]).test(password)) {
			ctr++;
		}
	}
	// Display it
	var color = "";
	var strength = "";
	switch (ctr) {
		case 0:
		case 1:
		case 2:
			strength = "Very Weak";
			color = "red";
			break;
		case 3:
			strength = "Medium";
			color = "orange";
			break;
		case 4:
			strength = "Strong";
			color = "green";
			break;
	}
	document.getElementById("messagePassword").innerHTML = strength;
	document.getElementById("messagePassword").style.color = color;
}

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

