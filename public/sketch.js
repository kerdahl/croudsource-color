let redValue, greenValue, blueValue, db, currentUser, bodyElement, rgbDiv;

// eslint-disable-next-line no-unused-vars
function setup() {
  // eslint-disable-next-line no-undef
  db = firebase.firestore();

  firebase.auth().onAuthStateChanged(function (user) {
    currentUser = user;

    if (user) {
      document.getElementById('greeting').textContent = `Hello, ${currentUser.displayName}. Please select a description for the color.`;
      document.getElementById('firebaseui-auth-container').style = "display:none";
      document.getElementById('signoutButton').style = "display:block";
      document.getElementById('root').style = "display:block";
    } else {
      document.getElementById('greeting').textContent = "Please log in to submit color data.";
      document.getElementById('firebaseui-auth-container').style = "display:block";
      document.getElementById('signoutButton').style = "display:none";
      document.getElementById('root').style = "display:none";
    }
  });

  createCanvas(400, 400).parent('displayColor');
  bodyElement = document.body;
  pickColor();

  let buttons = [];
  buttons.push(createButton('red-ish').parent('submitButtons').class('red-ish'));
  buttons.push(createButton('blue-ish').parent('submitButtons').class('blue-ish'));
  buttons.push(createButton('green-ish').parent('submitButtons').class('green-ish'));
  buttons.push(createButton('orange-ish').parent('submitButtons').class('orange-ish'));
  buttons.push(createButton('yellow-ish').parent('submitButtons').class('yellow-ish'));
  buttons.push(createButton('pink-ish').parent('submitButtons').class('pink-ish'));
  buttons.push(createButton('purple-ish').parent('submitButtons').class('purple-ish'));
  buttons.push(createButton('brown-ish').parent('submitButtons').class('brown-ish'));
  buttons.push(createButton('grey-ish').parent('submitButtons').class('grey-ish'));

  buttons.forEach(button => {
    button.mousePressed(sendData);
  });

  configureFirebaseUI();
}

function sendData() {
  //send data to firebase
  if (firebase.auth().currentUser) {
    let colors = db.collection("colors");

    let color = {
      "r": redValue,
      "g": greenValue,
      "b": blueValue,
      "label": this.html(),
      "uid": currentUser.uid
    };

    colors.add(color)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        pickColor();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  } else {
    alert("Please sign in to the application to submit color data.");
  }
}

function pickColor() {
  redValue = floor(random(256));
  greenValue = floor(random(256));
  blueValue = floor(random(256));

  background(redValue, greenValue, blueValue);

  bodyElement.style.backgroundColor = `rgba(${redValue}, ${greenValue}, ${blueValue}, 1.0)`;
  document.getElementById('rgbDiv').textContent = `R:${redValue} G:${greenValue} B:${blueValue}`;
}

function configureFirebaseUI() {
  //FirebaseUI config
  let uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        console.log(authResult);
        console.log(redirectUrl);
        document.getElementById('greeting').textContent = `Hello, ${authResult.user.displayName}. Please select a description for the color.`;
        return false;
      },
      signInFailure: function (err) {
        console.error(err);
        document.getElementById('greeting').textContent = "Log-in failed. You will be unable to submit color data. Please refresh and try again.";
        return false;
      }
    }
  }

  let ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.disableAutoSignIn();
  ui.start('#firebaseui-auth-container', uiConfig);
}

function signOut() {
  firebase.auth().signOut();
}