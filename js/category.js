function groupBy(array, grouping) {
  var result = {};
  for (var i = 0; i < array.length; i++) {
    var currentElement = array[i];
    var currentGrouping = currentElement[grouping]
    if (!result[currentGrouping]) {
      result[currentGrouping] = [];
    }
    result[currentGrouping].push(currentElement);
  }
  return result;
}

function makeUL(array, shownFields) {
  // Create the list element:
  var ul = document.createElement('ul');

  for (var i = 0; i < array.length; i++) {
    // Create the list item:
    var item = document.createElement('li');
    item.setAttribute("class", "li")

    var txt = array[i][shownFields[0]];
    for (var j = 1; j < shownFields.length; j++) {
      txt += " " + array[i][shownFields[j]];
    }
    // Set its contents:
    item.appendChild(document.createTextNode(txt));

    var btnUpdateAccount = document.createElement("input");
    btnUpdateAccount.setAttribute("type", "submit");
    btnUpdateAccount.setAttribute("value", "Update Account")
    btnUpdateAccount.setAttribute("onclick", 'openUpdateAccountForm("' + array[i].category + '","' + array[i].title + '")');
    item.appendChild(btnUpdateAccount);

    var btnUpdatePassword = document.createElement("input");
    btnUpdatePassword.setAttribute("type", "submit");
    btnUpdatePassword.setAttribute("value", "Update Password")
    btnUpdatePassword.setAttribute("onclick", 'openUpdatePasswordForm("' + array[i].category + '","' + array[i].title + '")');
    item.appendChild(btnUpdatePassword);

    var btnShowPassword = document.createElement("input");
    btnShowPassword.setAttribute("type", "submit");
    btnShowPassword.setAttribute("value", "Show Password")
    btnShowPassword.setAttribute("onclick", 'showPassword("' + array[i].category + '","' + array[i].title + '")');
    item.appendChild(btnShowPassword);

    // Add it to the list:
    ul.appendChild(item);


  }

  // Finally, return the constructed list:
  return ul;
}

function makeOL(array, grouping, shownFields) {


  var grouped = groupBy(array, grouping);
  var keys = Object.keys(grouped);


  var ol = document.createElement("ol");
  ol.setAttribute("class", "ol");

  for (var i = 0; i < keys.length; i++) {
    var item = document.createElement('li');
    item.setAttribute("class", "li")

    // Set its contents:
    item.appendChild(document.createTextNode(keys[i]));


    // Add it to the list:
    ol.appendChild(item);

    var ul = makeUL(grouped[keys[i]], shownFields);
    item.appendChild(ul);
  }
  return ol;
}

function loadAccountsIntoPage(grouping) {
  var request = $.ajax({
    url: "getAccounts",
    type: "get",
  });

  request.done(function (jqXHR, textStatus, response) {
    if (!response.responseJSON.error_code) {

      var shownFields = []
      if (grouping != "category") {
        shownFields.push("category")
      }
      if (grouping != "title") {
        shownFields.push("title")
      }

      var ol = makeOL(response.responseJSON, grouping, ["title"])

      let olDiv = document.querySelector("#divAllAccounts");
      olDiv.innerHTML = '';
      olDiv.appendChild(ol)

    } else {
      console.log(response.responseJSON)
    }
  })

  request.fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })
}

function loadAccountsOnCategoryChange() {
  var select = document.getElementById("showAllCategory");
  var category = select.options[select.selectedIndex].value;
  loadAccountsIntoPage(category)
}



function openUpdateAccountForm(category, title) {
  document.querySelector("#divCategories").setAttribute("class", "ghost")
  document.querySelector("#divUpdateForm").setAttribute("class", "")
  document.querySelector("#divChangePassword").setAttribute("class", "ghost")

  document.getElementById("titleid").value = "";
  document.getElementById("usernameid").value = "";
  document.getElementById("emailid").value = "";
  document.getElementById("categoryid").value = "";
  document.getElementById("commentid").value = "";

  var request = $.ajax({
    url: "getAccount",
    type: "post",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: 'category=' + category + '&title=' + title
  });

  request.done(function (jqXHR, textStatus, response) {
    if (!response.responseJSON.error_code) {

      document.getElementById("titleid").value = response.responseJSON.title;
      document.getElementById("usernameid").value = response.responseJSON.username;
      document.getElementById("emailid").value = response.responseJSON.email;
      document.getElementById("categoryid").value = response.responseJSON.category;
      document.getElementById("commentid").value = response.responseJSON.comment;

    } else {
      console.log(response.responseJSON)
    }
  })

  request.fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })

}

function showAllCategories() {
  document.querySelector("#divCategories").setAttribute("class", "")
  document.querySelector("#divUpdateForm").setAttribute("class", "ghost")
  document.querySelector("#divChangePassword").setAttribute("class", "ghost")
}

function openUpdatePasswordForm(category, title) {
  document.querySelector("#divCategories").setAttribute("class", "ghost")
  document.querySelector("#divUpdateForm").setAttribute("class", "ghost")
  document.querySelector("#divChangePassword").setAttribute("class", "")

  document.getElementById("passwordid").value = "";
  document.getElementById("confirmPasswordid").value = "";

  var request = $.ajax({
    url: "getPassword",
    type: "post",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: 'category=' + category + '&title=' + title
  });

  request.done(function (jqXHR, textStatus, response) {
    if (!response.responseJSON.error_code) {

      document.getElementById("passwordid").value = response.responseJSON.password;
      document.getElementById("confirmPasswordid").value = response.responseJSON.confirmPassword;

    } else {
      console.log(response.responseJSON)
    }
  })

  request.fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown)
  })


}



$(document).ready(function () {

  loadAccountsIntoPage("category");

  $("#changePassowordButton").click(function () {
    var serializedData = $("#changePasswordForm").serialize();

    var request = $.ajax({
      url: "updatePassword",
      type: "post",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: serializedData
    });

    request.done(function (jqXHR, textStatus, response) {
      if (!response.responseJSON.error_code) {
        showAllCategories();
        document.getElementById('messageAddNewAcc').innerHTML = 'rgb(41, 167, 41)';
        document.getElementById('messageAddNewAcc').innerHTML = 'Successful registration with: ' + "<br>"
          + response.responseJSON.title;
      } else {
        document.getElementById('messageAddNewAcc').style.color = 'rgb(194, 0, 0)';
        document.getElementById('messageAddNewAcc').innerHTML = response.responseJSON.error_message;
        console.log(response.responseJSON)
      }
    })

    if (request.fail(function (jqXHR, textStatus, errorThrown) {
      document.getElementById('message').style.color = 'rgb(194, 0, 0)';
      document.getElementById('message').innerHTML = "Something failed. Please retry."
      console.log(errorThrown)
    })) {
      return false;
    }
  })
})

$(document).ready(function () {

  loadAccountsIntoPage("category");

  $("#updateAccountButton").click(function () {
    var serializedData = $("#updateAccForm").serialize();

    var request = $.ajax({
      url: "updateAccount",
      type: "post",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: serializedData
    });

    request.done(function (jqXHR, textStatus, response) {
      if (!response.responseJSON.error_code) {
        showAllCategories();
        document.getElementById('messageAddNewAcc').innerHTML = 'rgb(41, 167, 41)';
        document.getElementById('messageAddNewAcc').innerHTML = 'Successful registration with: ' + "<br>"
          + response.responseJSON.title;
      } else {
        document.getElementById('messageAddNewAcc').style.color = 'rgb(194, 0, 0)';
        document.getElementById('messageAddNewAcc').innerHTML = response.responseJSON.error_message;
        console.log(response.responseJSON)
      }
    })

    if (request.fail(function (jqXHR, textStatus, errorThrown) {
      document.getElementById('message').style.color = 'rgb(194, 0, 0)';
      document.getElementById('message').innerHTML = "Something failed. Please retry."
      console.log(errorThrown)
    })) {
      return false;
    }
  })
})



