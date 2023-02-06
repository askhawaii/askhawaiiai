const askhawaiiText = document.getElementById('askhawaii-text');
const askhawaiiQuestion = document.getElementById('askhawaii-question');
const answerQuestion = document.getElementById('question');

window.addEventListener("load", () => {
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

  // Get the form element
  const form = document.getElementById("askHawaiiForm");

  // Add 'submit' event handler
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(askhawaiiQuestion.value);
    showSpinner();
    sendData();
  });

  function showSpinner() {
    console.log("> showing spinner");
    var spinner = document.getElementById("spinner");
    spinner.hidden = false;
    var formResponse = document.getElementById("form-response");
    formResponse.hidden = true;
  }

  function hideSpinner() {
    console.log("> hidding spinner 7");
    var spinner = document.getElementById("spinner");
    spinner.hidden = true;
    var formResponse = document.getElementById("form-response");
    formResponse.hidden = false;
  }

  function handleResponse(responseText) {
    const json = JSON.parse(responseText);
    // console.log(">json: " + json);
    // console.log(">respuesta: " + json.result);
    askhawaiiText.textContent = json.result;
    answerQuestion.textContent = askhawaiiQuestion.value;
    //rafa: these two values must be stored into firebase 
  }
});















