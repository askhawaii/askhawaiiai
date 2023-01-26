const askhawaiiText = document.getElementById('askhawaii-text');
const askhawaiiQuestion = document.getElementById('askhawaii-question');

window.addEventListener("load", () => {
  function sendData() {
    const XHR = new XMLHttpRequest();

    // Bind the FormData object and the form element
    const FD = new FormData(form);

    // Define what happens on successful data submission
    XHR.addEventListener("load", (event) => {
      // alert(event.target.responseText);
      askhawaiiText.textContent = event.target.responseText;
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

    console.log(askhawaiiQuestion.value)

    // var textarea = document.getElementById("askhawaii-text");
    // if (textarea.style.display === "none") {
    //   textarea.style.display = "block";
    // } else {
    //   textarea.style.display = "none";
    // }

    sendData();
  });
});















