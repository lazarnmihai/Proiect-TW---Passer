function randomPassword() {
	var characters = "abcdefghijklmnopqrstuvwxyz@#$%&*ABCDEFGHIJKLMNOP1234567890";
	var length = 8;
	var password = '';
	for (var i=0; i<length; i++) {
		var rnum = Math.floor(Math.random() * characters.length);
		password += characters.charAt(rnum)
	}
	document.randform.randomfield.value = password;
}