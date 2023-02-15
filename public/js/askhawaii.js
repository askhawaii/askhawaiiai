const askhawaiiText = document.getElementById('askhawaii-text');
const askhawaiiQuestion = document.getElementById('askhawaii-question');
const answerQuestion = document.getElementById('question');

window.addEventListener("load", () => {

  //---------------------------------------
  // suggestions
  //---------------------------------------
  // A function to show a console message sayiyng "suggestions clicked"
  function showSuggestions() {
    console.log("suggestions clicked");
  }
  

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
  const accordion = document.getElementById("accordionExample");
  const menuButtons = document.getElementById("menu-buttons");

  // Menu buttons methods handlers
  menuButtons.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("menuButtons clicked");
    console.log(event.target.id);

    // toogling inactive all links
    var suggestionsButton = document.getElementById("suggestions-button");
    suggestionsButton.classList.remove("active");
    var questionsButton = document.getElementById("questions-button");
    questionsButton.classList.remove("active");
    var prepositionsButton = document.getElementById("prepositions-button");
    prepositionsButton.classList.remove("active");
    var relatedButton = document.getElementById("related-button");
    relatedButton.classList.remove("active");
    
    var button = document.getElementById(event.target.id);
    button.classList.toggle("active");
  });

  // Acordion methods handlers
  accordion.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("accordion clicked");
    console.log(event.target.id);

    var collapseDiv = document.getElementById("collapse-" + event.target.id);
    collapseDiv.classList.toggle("show");
  });

  // Add 'submit' event handler
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(askhawaiiQuestion.value);
    showSpinner();
    sendData();
  });

  form.addEventListener("click", (event) => {  
    event.preventDefault();
    switch (event.target.id) {
      case "suggestions-button":
        showSuggestions();
        break;
      case "questions-button":      
        showQuestions();
        break;
      case "prepositions-button":
        showPrepositions();
        break;
      case "related-button":
        showRelated();
        break;
      default:
        console.log("no action");
    }
  });

  // Get the form-feedback element in a constant
  const formFeedback = document.getElementById("form-feedback");
  // add 'click' event handler to formFeedback
  formFeedback.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("formFeedback clicked");

    const formFeedbackSource = document.getElementById("form-feedback-source").value;
    const formFeedbackExpo = document.getElementById("form-feedback-expo").value;
    const formFeedbackDesire = document.getElementById("form-feedback-desire").value;
  });

  //---------------------------------------
  // handling response
  //---------------------------------------
  function handleResponse(responseText) {
    const json = JSON.parse(responseText);
    console.log(json);
    const htmlContent = json.result.replace(/\n/g,"<br>");
    askhawaiiText.innerHTML = htmlContent;
    answerQuestion.textContent = askhawaiiQuestion.value;
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

  //---------------------------------------
  // buttons actions
  //---------------------------------------
  function showSuggestions() {  
    console.log("> showing suggestions");
  }

  function showQuestions() {  
    console.log("> showing questions");
  }

  function showPrepositions() {  
    console.log("> showing prepositions");
  }

  function showRelated() {  
    console.log("> showing related");
  }

  function showAccordion() {  
    console.log("> showing accordion");
  }
});















