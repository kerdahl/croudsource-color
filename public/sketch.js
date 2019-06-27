let redValue, greenValue, blueValue, db;

// eslint-disable-next-line no-unused-vars
function setup() {
  // eslint-disable-next-line no-undef
  db = firebase.firestore();

  createCanvas(400, 400).parent('displayColor');
  pickColor();

  let buttons = [];
  buttons.push(createButton('red-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('blue-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('green-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('orange-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('yellow-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('pink-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('purple-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('brown-ish').parent('submitButtons').style('margin', '2px'));
  buttons.push(createButton('grey-ish').parent('submitButtons').style('margin', '2px'));

  buttons.forEach(button => {
    button.mousePressed(sendData);
  });

  document.getElementById('greeting').textContent = "Please log in to submit color data.";

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
      "uid": firebase.auth().currentUser.uid
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
  ui.start('#firebaseui-auth-container', uiConfig);
}