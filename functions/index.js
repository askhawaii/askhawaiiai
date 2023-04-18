const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
admin.initializeApp();
const db = getFirestore();

const { Configuration, OpenAIApi } = require("openai");
// require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//-----------------------
// readPlans method
//-----------------------
exports.readPlans = functions.https.onRequest(async (req, res) => {
    console.log("Reading plans from firestore");
    var planRef = db.collection('plan');
    var plans = [];
    planRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            plans.push(doc.data());
        });
        res.status(200).json({ result: plans });
        res.end();    
    });
});

//-----------------------
// readQuestions method
//-----------------------
exports.readQuestions = functions.https.onRequest(async (req, res) => {
    console.log("Reading questions from firestore");
    var questionRef = db.collection('question');
    var questions = [];
    questionRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            questions.push(doc.data());
        });
        res.status(200).json({ result: questions });
        res.end();
    });
});

//-------------------------
// readSuggestions method
//-------------------------
exports.readSuggestions = functions.https.onRequest(async (req, res) => {
    console.log("Reading suggestions from firestore");
    var suggestionRef = db.collection('suggestion');
    var suggestions = [];
    suggestionRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            suggestions.push(doc.data());
        });
        res.status(200).json({ result: suggestions });
        res.end();
    });
});

//---------------------------
// readPrepositions method
//---------------------------
exports.readPrepositions = functions.https.onRequest(async (req, res) => {
    console.log("Reading prepositions from firestore");
    var prepositionRef = db.collection('preposition');
    var prepositions = [];
    prepositionRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            prepositions.push(doc.data());
        });
        res.status(200).json({ result: prepositions });
        res.end();
    });
});

//---------------------------
// readRelated method
//---------------------------
exports.readRelated = functions.https.onRequest(async (req, res) => {
    console.log("Reading related from firestore");
    var relatedRef = db.collection('related');
    var related = [];
    relatedRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            related.push(doc.data());
        });
        res.status(200).json({ result: related });
        res.end();
    });
});

//-----------------------
// askhawaiiAI method
//-----------------------
exports.askHawaiiAI = functions.https.onRequest(async (req, res) => {

    const questionInput = req.query.text;
    const questionKey = questionInput.replace(/ /g,"_").toLowerCase();

    // checking in firestore if question exists
    const docRef = db.collection('questions').doc(questionKey);
    const doc = await docRef.get();
    // question doesn't exist previously. Querying openai.
    if (!doc.exists) {
        console.log('No such document! Making petition to OpenAI');
        try {
            if (!configuration.apiKey) {
              res.status(500).json({
                    error: {
                    message: "OpenAI API key not configured, please follow instructions in README.md",
                    }
                });
                return;
            }
    
            if (questionInput.trim().length === 0) {
                res.status(400).json({
                    error: {
                        message: "Please enter a valid question",
                    }
                });
                return;
            }
    
            try {
                
                // calling openai
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: generatePrompt(questionInput) }],
                    temperature: 0.7,
                    stream: true
                }, { responseType: 'stream' });

                var answer = "";
                var completedAnswer = "";

                completion.data.on('data', data => {
                    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        const message = line.replace(/^data: /, '');
                        if (message == '[DONE]') {
                            answer = '';
                            completedAnswer += answer;
                            res.write(answer);

                            res.end(async () => {
                                console.log(">END (GPT-4)");
                                console.log(">>>completedAnswer: " + completedAnswer);
                                
                                //saving in firestore
                                const questionsRef = db.collection('questions');
                                questionsRef.doc(questionKey).set({
                                    question: questionInput, answer: completedAnswer
                                });
                            });
                        }
                        else {
                            try {
                                const parsed = JSON.parse(message);

                                const delta = parsed.choices[0].delta.content;
                                if (typeof delta === 'string') {
                                    // if (typeof delta === 'string' || delta instanceof String) {
                                    answer = delta;
                                    completedAnswer += answer;                                                                      
                                    res.write(answer);
                                }
                                else {
                                    console.log(">>>AVOID WRITING: " + delta);
                                }
                                console.log(">>>answer: " + answer);
                                // send answer to client in chunks  
                                
                            } catch (error) {
                                console.error('>Error: Could not JSON parse stream message', message, error);
                            }
                        }                        
                    }
                });
            } catch(error) {
                if (error.response) {
                    console.error(error.response.status, error.response.data);
                    res.status(error.response.status).json(error.response.data);                    
                } else {
                    console.error(`Error with OpenAI API request: ${error.message}`);
                    res.status(500).json({
                        error: {
                            message: 'An error occurred during your request.',
                        }
                    });
                }
                res.end();
            }
        } catch(error) {
            console.error(error);
        }
    } 
    // question have been made before: showing the stored answer
    else {
      console.log('Document data:', doc.data());
      console.log('Document answer:', doc.data().answer);
      res.write(doc.data().answer);
      res.end();
    }
});

function generatePrompt(question) {
    return `The following is a question made to an AI assistant.
    The answers should concern Hawaii islands, so ideally the answers will be made for tourists, visitors, and people willing to know more about Hawaii islands. 
    The assistant is friendly, very informative. The assistant talk in a motivational, warm, casual, friendly, everyday close-friend tone. The assistant answers are written at a 14 years old level.
    Answers should be directed to "you" (the user). 
    The assistant should keep in context for the next question. Example:
        - If a user asks for a list of beaches, the assistant should answer with a list of beaches.
        - If then the user asks for more information about the first item of the list, the assistant should answer with more information about the first item of the list.
        - That is, the assistant should keep the context of the previous question.    
    Please avoid double punctuation (ex: "!!").
    About the list titles:
        - The list titles will be followed by a point (.) not a colon (:).
        - The list titles must include an emoji related to the topic.
        - The list titles must be written in title case (ex: "Best Places To Visit In Hawaii").
        - The list titles must be written in a way that makes sense when followed by a point (ex: "Best Places To Visit In Hawaii.").
        - The item titles from a list must be bold with HTML tags (<b>). Please do not use markdown tags (**). Example:
            <b>1. Waikiki Beach.</b> Waikiki Beach is a beachfront neighborhood of Honolulu, on the south shore of the island of Oahu, Hawaii. It is the most populated neighborhood in the state of Hawaii and the United States. Waikiki Beach is a popular tourist destination, and is known for its white sand beach, shopping, and nightlife.
            <b>2. Oahu Beach.</b> Oahu Beach is a beachfront neighborhood of Honolulu, on the south shore of the island of Oahu, Hawaii. It is the most populated neighborhood in the state of Hawaii and the United States. Oahu Beach is a popular tourist destination, and is known for its white sand beach, shopping, and nightlife.
    Human: ${question}
    AI:`;
} 