
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });

// DECLARE A VARIABLE TO STORE CURRENT USER'S ID
var currentUID = "";

// listen for auth status changes
auth.onAuthStateChanged(user => {
    
    // WHEN USER IS LOGGED IN, WILL RETURN TRUE
    // ELSE user WILL EQUAL NULL, AND THE STATEMENT WILL RETURN FALSE
    if (user) {
        console.log('user logged in: ', user);
        $(".logged-in").show()
        $(".logged-out").hide()

        currentUID = user.uid;
        // WE CAN NOW RUN CODE THAT WE ONLY WANT TO RUN ONCE A USER IS LOGGED IN
        database.ref("secrets").on("value", function (snapshot) {
            $("#secret-list").empty()

            let count = 0;
            snapshot.forEach(function (childSnapshot) {
                
                if (childSnapshot.val().uid === currentUID) {
                    count++;
                    
                    let headingDiv = $("<div>");
                    headingDiv.attr("class","collapsible-header grey lighten-4");
                    headingDiv.text("Secret #" + count);

                    let detailDiv = $("<div>");
                    detailDiv.attr("class","collapsible-body white");
                    detailDiv.text(childSnapshot.val().secret);

                    let newItem = $("<li>");
                    newItem.append(headingDiv);
                    newItem.append(detailDiv);
                    
                    $("#secret-list").prepend(newItem);
                }

            })

            // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
            // Again we could have named errorObject anything we wanted.
        }, function (errorObject) {

            // In case of error this will print the error
            console.log("The read failed: " + errorObject.code);
        });

    } else {
        console.log('user logged out');

        $(".logged-in").hide()
        $(".logged-out").show()
    }
})


$('#secret-form').on('submit', function (event) {
    database.ref("secrets").push({
        secret: $("#secret").val(),
        uid: currentUID
    });
});

// signup
$('#signup-form').on('submit', function (event) {
    event.preventDefault();

    // get user info
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(function (cred) {

        // close the signup modal & reset form
        const modal = $('#modal-signup');
        M.Modal.getInstance(modal).close();
        $(this).reset();
    });
});

// logout
$('#logout').on('click', function (event) {
    event.preventDefault();
    auth.signOut();
    $("#secret-list").empty()
});

// login
$('#login-form').on('submit', function (event) {
    event.preventDefault();

    // get user info
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then(function (cred) {
        // close the signup modal & reset form

        const modal = $('#modal-login');
        M.Modal.getInstance(modal).close();
        $(this).reset();
    });

});