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

// When the user scrolls the page, execute myFunction 
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

//-----------------//


window.addEventListener("load", () => {

  // show plan accordion
  showPlan();

  // function to load and show the plan accordion
  function showPlan() {
    const planXHR = new XMLHttpRequest();
    // Define what happens on successful data submission
    planXHR.addEventListener("load", (event) => {
      const responseText = event.target.responseText;
      const json = JSON.parse(responseText);
      console.log(json);
      const jsonResult = json.result;
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
        // accordion item
        var accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");

        // accordion header
        var accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionHeader.id = "heading-" + questionKey;
        
        // accordion link
        var accordionLink = document.createElement("a");
        accordionLink.classList.add("accordion-button");
        accordionLink.classList.add("collapsed");
        accordionLink.id = questionKey;
        accordionLink.innerHTML = question;
        accordionLink.setAttribute("display", "inline-block");
        accordionHeader.appendChild(accordionLink);
        
        // accordion collapse
        var accordionCollapse = document.createElement("div");
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        accordionCollapse.id = "collapse-" + questionKey;
        accordionCollapse.setAttribute("aria-labelledby", "heading-" + questionKey);
        accordionCollapse.setAttribute("data-bs-parent", "#planAccordion");
        // accordion body
        var accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionBody.id = "response-" + questionKey;

        var accordionAnswer = document.createElement("div");
        accordionAnswer.innerHTML = answer;
        accordionBody.appendChild(accordionAnswer);

        // share button
        var shareDiv = document.createElement("div");
        shareDiv.classList.add("shareDiv");
        shareDiv.classList.add("d-flex");
        shareDiv.classList.add("justify-content-end");
        var shareButton = document.createElement("button");
        shareButton.classList.add("shareButton");
        shareButton.classList.add("btn");
        shareButton.classList.add("btn-primary");
        shareButton.id = "share-" + questionKey;
        shareButton.setAttribute("data-toggle", "modal");
        shareButton.setAttribute("data-target", "#exampleModal");
        shareButton.innerHTML = "Share";

        // share image
        var shareImage = document.createElement("img");
        shareImage.classList.add("shareImage");
        shareImage.src = "/images/share.png";
        shareImage.alt = "share";
        shareButton.appendChild(shareImage);

        shareDiv.appendChild(shareButton);
        
        // appending
        accordionBody.appendChild(shareDiv);
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

  // function to load and show the suggestions accordion
  function showSuggestions() {
    console.log("showing suggestions");
    const suggestionsXHR = new XMLHttpRequest();
    // Define what happens on successful data submission
    suggestionsXHR.addEventListener("load", (event) => {
      const responseText = event.target.responseText;
      const json = JSON.parse(responseText);
      console.log(json);
      const jsonResult = json.result;
      // removing suggestions accordion if it's not empty
      if (suggestionsAccordion.childElementCount > 0) {
        while (suggestionsAccordion.firstChild) {
          suggestionsAccordion.removeChild(suggestionsAccordion.firstChild);
        }
      }
      jsonResult.forEach(element => {
        const question = element.question;
        const answer = element.answer;
        const questionKey = question.replace(/ /g,"_").toLowerCase();
        const answerKey = answer.replace(/ /g,"_").toLowerCase();
        // accordion item
        var accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        // accordion header
        var accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionHeader.id = "heading-" + questionKey;
        // accordion link
        var accordionLink = document.createElement("a");
        accordionLink.classList.add("accordion-button");
        accordionLink.classList.add("collapsed");
        accordionLink.id = questionKey;
        accordionLink.innerHTML = question;
        accordionHeader.appendChild(accordionLink);
        // accordion collapse
        var accordionCollapse = document.createElement("div");
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        accordionCollapse.id = "collapse-" + questionKey;
        accordionCollapse.setAttribute("aria-labelledby", "heading-" + questionKey);
        accordionCollapse.setAttribute("data-bs-parent", "#suggestionsAccordion");
        // accordion body
        var accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionBody.id = "response-" + questionKey;
        accordionBody.innerHTML = answer;
        // appending
        accordionCollapse.appendChild(accordionBody);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        suggestionsAccordion.appendChild(accordionItem);
      });
      hideAllAcordions();
      suggestionsAccordion.hidden = false;
    });
    // Define what happens in case of error
    suggestionsXHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });
    // Set up our request
    suggestionsXHR.open("GET", "/readSuggestions");
    suggestionsXHR.send();
  }

  // function to load and show the questions accordion
  function showQuestions() {
    console.log("showing questions");
    const questionsXHR = new XMLHttpRequest();
    // Define what happens on successful data submission
    questionsXHR.addEventListener("load", (event) => {
      const responseText = event.target.responseText;
      const json = JSON.parse(responseText);
      console.log(json);
      const jsonResult = json.result;
      // removing questions accordion if it's not empty
      if (questionsAccordion.childElementCount > 0) {
        while (questionsAccordion.firstChild) {
          questionsAccordion.removeChild(questionsAccordion.firstChild);
        }
      }
      jsonResult.forEach(element => {
        const question = element.question;
        const answer = element.answer;
        const questionKey = question.replace(/ /g,"_").toLowerCase();
        const answerKey = answer.replace(/ /g,"_").toLowerCase();
        // accordion item
        var accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        // accordion header
        var accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionHeader.id = "heading-" + questionKey;
        // accordion link
        var accordionLink = document.createElement("a");
        accordionLink.classList.add("accordion-button");
        accordionLink.classList.add("collapsed");
        accordionLink.id = questionKey;
        accordionLink.innerHTML = question;
        accordionHeader.appendChild(accordionLink);
        // accordion collapse
        var accordionCollapse = document.createElement("div");
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        accordionCollapse.id = "collapse-" + questionKey;
        accordionCollapse.setAttribute("aria-labelledby", "heading-" + questionKey);
        accordionCollapse.setAttribute("data-bs-parent", "#questionsAccordion");
        // accordion body
        var accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionBody.id = "response-" + questionKey;
        accordionBody.innerHTML = answer;
        // appending
        accordionCollapse.appendChild(accordionBody);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        questionsAccordion.appendChild(accordionItem);
      });
      hideAllAcordions();
      questionsAccordion.hidden = false;
    });
    // Define what happens in case of error
    questionsXHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });
    // Set up our request
    questionsXHR.open("GET", "/readQuestions");
    questionsXHR.send();
  }

  // function to load and show the prepositions accordion
  function showPrepositions() {
    console.log("showing prepositions");
    const prepositionsXHR = new XMLHttpRequest();
    // Define what happens on successful data submission
    prepositionsXHR.addEventListener("load", (event) => {
      const responseText = event.target.responseText;
      const json = JSON.parse(responseText);
      console.log(json);
      const jsonResult = json.result;
      // removing questions accordion if it's not empty
      if (prepositionsAccordion.childElementCount > 0) {
        while (prepositionsAccordion.firstChild) {
          prepositionsAccordion.removeChild(prepositionsAccordion.firstChild);
        }
      }
      jsonResult.forEach(element => {
        const question = element.question;
        const answer = element.answer;
        const questionKey = question.replace(/ /g,"_").toLowerCase();
        const answerKey = answer.replace(/ /g,"_").toLowerCase();
        // accordion item
        var accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        // accordion header
        var accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionHeader.id = "heading-" + questionKey;
        // accordion link
        var accordionLink = document.createElement("a");
        accordionLink.classList.add("accordion-button");
        accordionLink.classList.add("collapsed");
        accordionLink.id = questionKey;
        accordionLink.innerHTML = question;
        accordionHeader.appendChild(accordionLink);
        // accordion collapse
        var accordionCollapse = document.createElement("div");
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        accordionCollapse.id = "collapse-" + questionKey;
        accordionCollapse.setAttribute("aria-labelledby", "heading-" + questionKey);
        accordionCollapse.setAttribute("data-bs-parent", "#prepositionsAccordion");
        // accordion body
        var accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionBody.id = "response-" + questionKey;
        accordionBody.innerHTML = answer;
        // appending
        accordionCollapse.appendChild(accordionBody);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        prepositionsAccordion.appendChild(accordionItem);
      });
      hideAllAcordions();
      prepositionsAccordion.hidden = false;
    });
    // Define what happens in case of error
    prepositionsXHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });
    // Set up our request
    prepositionsXHR.open("GET", "/readPrepositions");
    prepositionsXHR.send();
  }

  // function to load and show the related accordion
  function showRelated() {
    console.log("showing related");
    const relatedXHR = new XMLHttpRequest();
    // Define what happens on successful data submission
    relatedXHR.addEventListener("load", (event) => {
      const responseText = event.target.responseText;
      const json = JSON.parse(responseText);
      console.log(json);
      const jsonResult = json.result;
      // removing questions accordion if it's not empty
      if (relatedAccordion.childElementCount > 0) {
        while (relatedAccordion.firstChild) {
          relatedAccordion.removeChild(relatedAccordion.firstChild);
        }
      }
      jsonResult.forEach(element => {
        const question = element.question;
        const answer = element.answer;
        const questionKey = question.replace(/ /g,"_").toLowerCase();
        const answerKey = answer.replace(/ /g,"_").toLowerCase();
        // accordion item
        var accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        // accordion header
        var accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");
        accordionHeader.id = "heading-" + questionKey;
        // accordion link
        var accordionLink = document.createElement("a");
        accordionLink.classList.add("accordion-button");
        accordionLink.classList.add("collapsed");
        accordionLink.id = questionKey;
        accordionLink.innerHTML = question;
        accordionHeader.appendChild(accordionLink);
        // accordion collapse
        var accordionCollapse = document.createElement("div");
        accordionCollapse.classList.add("accordion-collapse");
        accordionCollapse.classList.add("collapse");
        accordionCollapse.id = "collapse-" + questionKey;
        accordionCollapse.setAttribute("aria-labelledby", "heading-" + questionKey);
        accordionCollapse.setAttribute("data-bs-parent", "#relatedAccordion");
        // accordion body
        var accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");
        accordionBody.id = "response-" + questionKey;
        accordionBody.innerHTML = answer;
        // appending
        accordionCollapse.appendChild(accordionBody);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        relatedAccordion.appendChild(accordionItem);
      });
      hideAllAcordions();
      relatedAccordion.hidden = false;
    });
    // Define what happens in case of error
    relatedXHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });
    // Set up our request
    relatedXHR.open("GET", "/readRelated");
    relatedXHR.send();
  }

//================================================================================
  

  // send data on custom question
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
    if(event.target.classList.contains("accordion-button")) {
      var collapseDiv = document.getElementById("collapse-" + event.target.id);
      collapseDiv.classList.toggle("show");
    } else {
      var exampleModal = document.getElementById("exampleModal");
      exampleModal.classList.toggle("show");
    }    
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
    console.log("lo del click");
    switch (event.target.id) {
      case "plan-button":
        showPlan();
        break;
      case "suggestions-button":
        console.log("suggestions-button clicked");
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
});