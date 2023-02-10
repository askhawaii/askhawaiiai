const askhawaiiText = document.getElementById('askhawaii-text');
const askhawaiiQuestion = document.getElementById('askhawaii-question');
const answerQuestion = document.getElementById('question');

window.addEventListener("load", () => {
  
  function sendData() {

    const XHR = new XMLHttpRequest();
    const FD = new FormData(form);

    // Define what happens on successful data submission
    XHR.addEventListener("load", (event) => {
      console.log(event.target);
      handleResponse(event.target.responseText);
      hideSpinner();
    });

    // Define what happens in case of error
    XHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });

    // Set up our request
    XHR.open("POST", "/askHawaiiAI?text='" + askhawaiiQuestion.value +"'");

    // The data sent is what the user provided in the form
    XHR.send(FD);
  }

  // Get the form element
  const form = document.getElementById("askHawaiiForm");

  // Add 'submit' event handler
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(askhawaiiQuestion.value);
    showSpinner();
    sendData();
  });

  function handleResponse(responseText) {

    const json = JSON.parse(responseText);
    askhawaiiText.textContent = json.result;
    answerQuestion.textContent = askhawaiiQuestion.value;
    
    // call to store in firestore
    saveInFirestore(askhawaiiQuestion.value, json.result);  
  }

  function sendData() {
    const XHR = new XMLHttpRequest();

    // Bind the FormData object and the form element
    const FD = new FormData(form);

    // Define what happens on successful data submission
    XHR.addEventListener("load", (event) => {
      // alert(event.target.responseText);
      console.log(event.target);
      // askhawaiiText.textContent = event.target.result;
      handleResponse(event.target.responseText);
      hideSpinner();
    });

    // Define what happens in case of error
    XHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });

    // Set up our request
    XHR.open("POST", "/askHawaiiAI?text='" + askhawaiiQuestion.value +"'");

    // The data sent is what the user provided in the form
    XHR.send(FD);
  }

  //---------------------------------------
  // saving in firestore
  //---------------------------------------
  function saveInFirestore(question, answer) {
    console.log(">saving in firestore");
    console.log(question);
    console.log(answer);
    console.log("-----------");

    // const XHRnew = new XMLHttpRequest();
    // XHRnew.open("POST", "/saveInFirestore?question='" + question +"'&answer='" + answer + "'");
    // XHRnew.send();
  }  

  //---------------------------------------
  // showing / hiding spinner
  //---------------------------------------
  function showSpinner() {
    console.log("> showing spinner");
    var spinner = document.getElementById("spinner");
    spinner.hidden = false;
    var formResponse = document.getElementById("form-response");
    formResponse.hidden = true;
  }

  function hideSpinner() {
    console.log("> hidding spinner");
    var spinner = document.getElementById("spinner");
    spinner.hidden = true;
    var formResponse = document.getElementById("form-response");
    formResponse.hidden = false;
  } 
});















