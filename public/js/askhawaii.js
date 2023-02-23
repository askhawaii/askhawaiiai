const askhawaiiText = document.getElementById('askhawaii-text');
const askhawaiiQuestion = document.getElementById('askhawaii-question');
const answerQuestion = document.getElementById('question');

var planAccordion = document.getElementById("planAccordion");
var suggestionsAccordion = document.getElementById("suggestionsAccordion");
var questionsAccordion = document.getElementById("questionsAccordion");
var prepositionsAccordion = document.getElementById("prepositionsAccordion");
var relatedAccordion = document.getElementById("relatedAccordion");
planAccordion.hidden = true;
suggestionsAccordion.hidden = true;
questionsAccordion.hidden = true;
prepositionsAccordion.hidden = true;
relatedAccordion.hidden = true;

window.addEventListener("load", () => {

  // show plan accordion
  showPlan();

  function showPlan() {

    const planXHR = new XMLHttpRequest();

    // Define what happens on successful data submission
    planXHR.addEventListener("load", (event) => {
      const responseText = event.target.responseText;
      const json = JSON.parse(responseText);
      console.log(json);

      const jsonResult = json.result;
      
      jsonResult.forEach(element => {
        console.log(element.question);
      });

      // removing plan accordion if it's not empty
      if (planAccordion.childElementCount > 0) {
        while (planAccordion.firstChild) {
          planAccordion.removeChild(planAccordion.firstChild);
        }
      }

      jsonResult.forEach(element => {

        const question = element.question;
        const answer = element.answer;
        const questionKey = question.replace(/ /g,"_").toLowerCase();
        const answerKey = answer.replace(/ /g,"_").toLowerCase();

        var accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");

        var accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionHeader.id = "heading-" + questionKey;

        var accordionLink = document.createElement("a");
        accordionLink.classList.add("accordion-button");
        accordionLink.classList.add("collapsed");
        accordionLink.id = questionKey;
        accordionLink.innerHTML = question;

        accordionHeader.appendChild(accordionLink);

        var accordionCollapse = document.createElement("div");
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        accordionCollapse.id = "collapse-" + questionKey;
        accordionCollapse.setAttribute("aria-labelledby", "heading-" + questionKey);
        accordionCollapse.setAttribute("data-bs-parent", "#planAccordion");

        var accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionBody.id = "response-" + questionKey;
        accordionBody.innerHTML = answer;

        accordionCollapse.appendChild(accordionBody);
        
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        planAccordion.appendChild(accordionItem);
      
      });
      
      hideAllAcordions();
      planAccordion.hidden = false;
    });
      
    // Define what happens in case of error
    planXHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });

    // Set up our request
    planXHR.open("GET", "/readPlans");
    planXHR.send();
  }

  function sendData(manually, identifier) {

    const XHR = new XMLHttpRequest();
    const FD = new FormData(form);

    // Define what happens on successful data submission
    XHR.addEventListener("load", (event) => {
      console.log(event.target);
      // question customly written
      if (manually == true) {
        handleResponse(event.target.responseText);
        hideSpinner();
      } 
      // question suggested
      else {
        console.log("not manually: " + event.target.responseText);
        console.log("identifier: " + identifier);
        const json = JSON.parse(event.target.responseText);
        const htmlContent = json.result.replace(/\n/g,"<br>");
    
        var responseDiv = document.getElementById("response-" + identifier);
        responseDiv.innerHTML = htmlContent;
      }      
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
  const suggestionsAccordion = document.getElementById("suggestionsAccordion");
  const menuButtons = document.getElementById("menu-buttons");

  // Menu buttons methods handlers
  menuButtons.addEventListener("click", (event) => {
    event.preventDefault();

    if (event.target.id != "") {
      console.log("menuButtons clicked");
      console.log(event.target.id);
  
      // toogling inactive all links
      var planButton = document.getElementById("plan-button");
      planButton.classList.remove("active");
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
    }
    else {
      console.log("menuButtons clicked but NULL");
    }
  });

  //--------------------------------------------------------------------------------
  // accordions methods handlers
  //--------------------------------------------------------------------------------
  planAccordion.addEventListener("click", (event) => {
    tooglingCollapsedDiv(event);    
  });

  questionsAccordion.addEventListener("click", (event) => {
    tooglingCollapsedDiv(event);
  });
  
  suggestionsAccordion.addEventListener("click", (event) => {
    tooglingCollapsedDiv(event);
  });

  relatedAccordion.addEventListener("click", (event) => {
    tooglingCollapsedDiv(event);
  });

  prepositionsAccordion.addEventListener("click", (event) => {
    tooglingCollapsedDiv(event);
  });

  function tooglingCollapsedDiv(event) {
    event.preventDefault();
    var collapseDiv = document.getElementById("collapse-" + event.target.id);
    collapseDiv.classList.toggle("show");
  }

  //--------------------------------------------------------------------------------
  // Add 'submit' event handler
  //--------------------------------------------------------------------------------
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(askhawaiiQuestion.value);
    showSpinner();
    sendData(true, null);
  });

  menuButtons.addEventListener("click", (event) => {  
    event.preventDefault();
    switch (event.target.id) {
      case "plan-button":
        showPlan();
        break;
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

  /*
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
  */

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
  // menu buttons actions
  //---------------------------------------
  function hideAllAcordions() {
    var planAccordion = document.getElementById("planAccordion");
    planAccordion.hidden = true;
    var suggestionsAccordion = document.getElementById("suggestionsAccordion");
    suggestionsAccordion.hidden = true;
    var questionsAccordion = document.getElementById("questionsAccordion");
    questionsAccordion.hidden = true;
    var prepositionsAccordion = document.getElementById("prepositionsAccordion");
    prepositionsAccordion.hidden = true;
    var relatedAccordion = document.getElementById("relatedAccordion");
    relatedAccordion.hidden = true;
  }  

  function showSuggestions() {  
    hideAllAcordions();
    var suggestionsAccordion = document.getElementById("suggestionsAccordion");
    suggestionsAccordion.hidden = false;
  }

  function showQuestions() {  
    hideAllAcordions();
    var questionsAccordion = document.getElementById("questionsAccordion");
    questionsAccordion.hidden = false;
  }

  function showPrepositions() {  
    hideAllAcordions();
    var prepositionsAccordion = document.getElementById("prepositionsAccordion");
    prepositionsAccordion.hidden = false;
  }

  function showRelated() {  
    hideAllAcordions();
    var relatedAccordion = document.getElementById("relatedAccordion");
    relatedAccordion.hidden = false;
  }
});















