
function validateUsername() {
    var valid = false;
    if (document.getElementById('usernameid').value == "") {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Enter an username!';    
        valid = true; 
    }else{
        document.getElementById('message').innerHTML = '';
    }
}

function validateEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var valid = false;
    if (document.getElementById('emailid').value.match(mailformat)) {
        document.getElementById('message').style.color = 'rgb(41, 167, 41)';
        document.getElementById('message').innerHTML = 'You have a valid email.';
        valid = true;
        //return true;
    } else {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'You don&#39;t have a valid email.';
        //return false;
    }
}

function validatePassword() {
    var valid = false;
    if(document.getElementById('passwordid').value.length<6){
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Password should have at least 6 characters!';
    }else{
        if (document.getElementById('passwordid').value == document.getElementById('confirmPasswordid').value) {
            document.getElementById('message').style.color = 'rgb(41, 167, 41)';
            document.getElementById('message').innerHTML = 'Password match.';
            valid = true;

        } else {
            document.getElementById('message').style.color = 'rgb(194, 0, 0)';
            document.getElementById('message').innerHTML = 'Passwords do not match!';
        }
        }

};

function validateLoginBtn(){
    var username = validateUsername.valid;
    var email = validateEmail.valid;
    var password = validateEmail.valid;

    if (username && email &&password){
        return true;
    }
}

function validateTitle() {
    var valid = false;
    if (document.getElementById('titleid').value == "") {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Enter an title!';    
        valid = true; 
    }else{
        document.getElementById('message').innerHTML = '';
    }
}

function validateCategory(){
    var valid = false;

    if (document.getElementById('category').value == "") {
        document.getElementById('message').style.color = 'rgb(194, 0, 0)';
        document.getElementById('message').innerHTML = 'Enter an category!';    
        valid = true; 
    }else{
        document.getElementById('message').innerHTML = '';
    }

}

