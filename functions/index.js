const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
admin.initializeApp();
const db = getFirestore();

const { Configuration, OpenAIApi } = require("openai");
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


                // const response = await openai.createChatCompletion({
                //     model: "gpt-3.5-turbo-0301",

                //     messages: [
                //         {
                //             "content": "Human: Hello, how are you?",
                //             "created": 1614691200,
                //             "id": "01F1ZQXQXZJYQXZJYQXZJYQXZJ",
                //             "personality": [],
                //             "recipient_id": "openai",
                //             "sender_id": "human"
                //         },
                //         {
                //             "content": "AI: I am doing well, how about you?",
                //             "created": 1614691200,
                //             "id": "01F1ZQXQXZJYQXZJYQXZJYQXZJ",
                //             "personality": [],
                //             "recipient_id": "human",
                //             "sender_id": "openai"
                //         }],
                //     prompt: questionInput,
                //     temperature: 0.9,
                //     max_tokens: 1500,
                //     top_p: 1,
                //     frequency_penalty: 0.0,
                //     presence_penalty: 0.6,
                //     stop: [" Human:", " AI:"],
                // });

                // res.status(200).json({ result: response.data.choices[0].message.content });
                // res.end();

                const completion = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: generatePrompt(questionInput), 
                    temperature: 0.9,
                    max_tokens: 1500,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.6,
                    stop: [" Human:", " AI:"],
                  });
    
                // saving in firebase
                const questionsRef = db.collection('questions');
                await questionsRef.doc(questionKey).set({
                    question: questionInput, answer: completion.data.choices[0].text
                });
    
                res.status(200).json({ result: completion.data.choices[0].text });
                res.end();
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
      res.status(200).json({ result: doc.data().answer });
      res.end();
    }
});

function generatePrompt(question) {
    return `The following is a question made to an AI assistant. The answers should concern Hawaii islands, so ideally the answers will be made for tourists, visitors, and people willing to know more about Hawaii islands. The assistant is friendly, very informative. The assistant answers are written at a 14 years old level.
    
    Human: ${question}
    AI:`;
}