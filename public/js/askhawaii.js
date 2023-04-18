const askhawaiiText = document.getElementById('askhawaii-text');
const askhawaiiQuestion = document.getElementById('askhawaii-question');
const answerQuestion = document.getElementById('question');
const askhawaiiQuestionURL = document.getElementById('askhawaii-question-url');

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
window.onscroll = function () { myFunction() };

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

  // function to check url for query "question"
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }

  // showPlan();

  function showPlan() {
    const planXHR = new XMLHttpRequest();
    planXHR.addEventListener("load", (event) => {
      const responseText = event.target.responseText;
      const json = JSON.parse(responseText);
      console.log(json);
      const jsonResult = json.result;

      if (planAccordion.childElementCount > 0) {
        while (planAccordion.firstChild) {
          planAccordion.removeChild(planAccordion.firstChild);
        }
      }
      jsonResult.forEach(element => {
        const question = element.question;
        const answer = element.answer;
        const questionKey = question.replace(/ /g, "_").toLowerCase();
        const answerKey = answer.replace(/ /g, "_").toLowerCase();
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

        // share image
        var shareImage = document.createElement("img");
        shareImage.classList.add("shareImage");
        shareImage.src = "/img/forward.png";
        shareImage.alt = "share";

        // book image
        var bookImage = document.createElement("img");
        bookImage.classList.add("bookImage");
        bookImage.src = "/img/bookHBLT.png";
        bookImage.alt = "book";

        // book link
        var bookLink = document.createElement("a");
        bookLink.classList.add("book-link");
        bookLink.href = "https://hawaiiblt.com";
        bookLink.target = "_blank";
        bookLink.id = "book-" + questionKey;
        bookLink.appendChild(bookImage);

        // book button
        var bookDiv = document.createElement("div");
        bookDiv.classList.add("bookDiv");
        bookDiv.classList.add("d-flex");
        bookDiv.classList.add("justify-content-end");
        bookDiv.appendChild(bookLink);

        // share button
        var shareDiv = document.createElement("div");
        shareDiv.classList.add("shareDiv");
        shareDiv.classList.add("d-flex");
        shareDiv.classList.add("justify-content-end");
        shareDiv.appendChild(shareImage);

        var shareButton = document.createElement("button");
        shareButton.type = "button";
        shareButton.classList.add("shareButton");
        shareButton.id = "share-" + questionKey;
        shareButton.setAttribute("data-bs-toggle", "modal");
        shareButton.setAttribute("data-bs-target", "#exampleModal");
        shareButton.innerHTML = "Share";
        shareDiv.appendChild(shareButton);

        // appending
        // accordionBody.appendChild(shareDiv);
        // accordionBody.appendChild(bookDiv);
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
        const questionKey = question.replace(/ /g, "_").toLowerCase();
        const answerKey = answer.replace(/ /g, "_").toLowerCase();
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
        const questionKey = question.replace(/ /g, "_").toLowerCase();
        const answerKey = answer.replace(/ /g, "_").toLowerCase();
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
        const questionKey = question.replace(/ /g, "_").toLowerCase();
        const answerKey = answer.replace(/ /g, "_").toLowerCase();
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
        const questionKey = question.replace(/ /g, "_").toLowerCase();
        const answerKey = answer.replace(/ /g, "_").toLowerCase();
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
  
  // function to clear the tail spaces of a string, and to convert double spaces to single spaces
  function clearSpaces(string) {
    // removing tail spaces
    while (string[string.length - 1] == " ") {
      string = string.substring(0, string.length - 1);
    }
    // removing double spaces
    while (string.includes("  ")) {
      string = string.replace("  ", " ");
    }
    return string;
  }

  // send data on custom question
  function sendData(manually, identifier) {

    let trimmedQuestion = clearSpaces(askhawaiiQuestion.value);

    const XHR = new XMLHttpRequest();
    const FD = new FormData(form);

    // Define what happens on successful data submission
    console.log("-> SEND DATA");

    XHR.addEventListener("load", (event) => {
      console.log("**RAFA**");
      console.log(event.target);

      // question customly written
      if (manually == true) {
        // handleResponse(event.target.responseText);
        // hideSpinner();
        console.log("manually: " + event.target.responseText);
      }
      // question suggested
      else {
        console.log("not manually: " + event.target.responseText);
        console.log("identifier: " + identifier);
        const json = JSON.parse(event.target.responseText);
        const htmlContent = json.result.replace(/\n/g, "<br>");

        var responseDiv = document.getElementById("response-" + identifier);
        responseDiv.innerHTML = htmlContent;
      }
    });

    // add event listener for progress
    // XHR.addEventListener("progress", (event) => {
    //   console.log("->PRO: " + event.target.responseText);
    //   hideSpinner();
    //   const text = event.target.responseText.replace(/\n/g, "<br>");
    //   var questionTitle = askhawaiiQuestion.value;
    //   // questionTitle to be sentence capitalized
    //   questionTitle = questionTitle.charAt(0).toUpperCase() + questionTitle.slice(1);
    //   askhawaiiText.innerHTML = "<div>" + text + "</div>";
    //   answerQuestion.textContent = questionTitle;
    // });

    // Define what happens in case of error
    XHR.addEventListener("error", (event) => {
      alert('Oops! Something went wrong.');
    });

    // Open our request
    XHR.open("POST", "/askHawaiiAI?text='" + trimmedQuestion + "'");

    XHR.addEventListener("progress", updateProgress, false);

    // The data sent is what the user provided in the form
    XHR.send(FD);
  }

  // function to convert a string in a url parameter value
  function convertToURLParam(string) {
    string = string.replace(/ /g, "_");
    string = string.replace(/'/g, "%27");
    string = string.replace(/"/g, "%22");
    string = string.replace(/:/g, "%3A");
    string = string.replace(/;/g, "%3B");
    string = string.replace(/,/g, "%2C");
    string = string.replace(/\?/g, "%3F");
    string = string.replace(/!/g, "%21");
    string = string.replace(/\(/g, "%28");
    string = string.replace(/\)/g, "%29");
    string = string.replace(/\[/g, "%5B");
    string = string.replace(/\]/g, "%5D");
    string = string.replace(/&/g, "%26");
    string = string.replace(/=/g, "%3D");
    string = string.replace(/\+/g, "%2B");
    string = string.replace(/\$/g, "%24");
    string = string.replace(/#/g, "%23");
    string = string.replace(/@/g, "%40");
    string = string.replace(/%/g, "%25");
    string = string.replace(/</g, "%3C");
    string = string.replace(/>/g, "%3E");
    string = string.replace(/\//g, "%2F");
    string = string.replace(/\\/g, "%5C");
    string = string.replace(/\|/g, "%7C");
    string = string.replace(/`/g, "%60");
    string = string.replace(/~/g, "%7E");
    string = string.replace(/{/g, "%7B");
    string = string.replace(/}/g, "%7D");
    string = string.replace(/\^/g, "%5E");
    string = string.replace(/_/g, "%5F");
    string = string.replace(/-/g, "%2D");
    string = string.replace(/\./g, "%2E");
    string = string.replace(/\*/g, "%2A");
    return string;
  }

  // function inverse to convertToURLParam
  function convertFromURLParam(string) {
    string = string.replace(/%27/g, "'");
    string = string.replace(/%22/g, '"');
    string = string.replace(/%3A/g, ":");
    string = string.replace(/%3B/g, ";");
    string = string.replace(/%2C/g, ",");
    string = string.replace(/%3F/g, "?");
    string = string.replace(/%21/g, "!");
    string = string.replace(/%28/g, "(");
    string = string.replace(/%29/g, ")");
    string = string.replace(/%5B/g, "[");
    string = string.replace(/%5D/g, "]");
    string = string.replace(/%26/g, "&");
    string = string.replace(/%3D/g, "=");
    string = string.replace(/%2B/g, "+");
    string = string.replace(/%24/g, "$");
    string = string.replace(/%23/g, "#");
    string = string.replace(/%40/g, "@");
    string = string.replace(/%25/g, "%");
    string = string.replace(/%3C/g, "<");
    string = string.replace(/%3E/g, ">");
    string = string.replace(/%2F/g, "/");
    string = string.replace(/%5C/g, "\\");
    string = string.replace(/%7C/g, "|");
    string = string.replace(/%60/g, "`");
    string = string.replace(/%7E/g, "~");
    string = string.replace(/%7B/g, "{");
    string = string.replace(/%7D/g, "}");
    string = string.replace(/%5E/g, "^");
    string = string.replace(/%5F/g, "_");
    string = string.replace(/%2D/g, "-");
    string = string.replace(/%2E/g, ".");
    string = string.replace(/%2A/g, "*");
    string = string.replace(/_/g, " ");
    return string;
  }


  function updateProgress(event) {

    hideSpinner();

    const text = event.target.responseText.replace(/\n/g, "<br>");

    var questionTitle = clearSpaces(askhawaiiQuestion.value);

    // questionTitle to be sentence capitalized
    questionTitle = questionTitle.charAt(0).toUpperCase() + questionTitle.slice(1);

    askhawaiiText.innerHTML = "<div>" + text + "</div>";
    answerQuestion.textContent = questionTitle;

    const questionParameter = convertToURLParam(clearSpaces(askhawaiiQuestion.value));
    const urlParameter = "https://askhawaii.com/index.html?question=" + questionParameter;
    askhawaiiQuestionURL.innerHTML = '<a href="' + urlParameter + '" target="_blank">Link to be shared</a>';
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
    console.log("> step1: tooglingCollapsedDiv")
    if (event.target.classList.contains("accordion-button")) {
      console.log("> step2: accordion-button clicked");
      var collapseDiv = document.getElementById("collapse-" + event.target.id);
      collapseDiv.classList.toggle("show");
    }
    else if (event.target.classList.contains("bookImage")) {
      console.log("> link - deberia funcionar");
      var href = "https://hawaiiblt.com";
      window.open(href, '_blank');
    }
    else {
      console.log(event.target.classList);
      console.log("> step3. not accordion-button - deberia funcionar");
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
    // const json = JSON.parse(responseText);
    console.log(json);
    // const htmlContent = json.result.replace(/\n/g,"<br>");
    askhawaiiText.innerHTML = responseText;
    // askhawaiiText.innerHTML = htmlContent;
    answerQuestion.textContent = clearSpaces(askhawaiiQuestion.value);
    askhawaiiQuestionURL.innerHTML = "https://askhawaii.com/index.html?question=" + clearSpaces(askhawaiiQuestion.value);
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

  // handling queries via url

  const queryValue = getQueryVariable("question");
  if (queryValue) {
    console.log(">queryValue: " + queryValue);

    askhawaiiQuestion.value = convertFromURLParam(queryValue);
    console.log(">askHawaiiQuestion: " + askhawaiiQuestion.value);
    showSpinner();
    sendData(true, null);

  } else {
    console.log("no queryValue");
  }
});