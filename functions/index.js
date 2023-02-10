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

// const cityRef = db.collection('questions').doc('SF');
// const doc = await cityRef.get();
// if (!doc.exists) {
//   console.log('No such document!');
// } else {
//   console.log('Document data:', doc.data());
// }


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
    }
});

function generatePrompt(question) {
    return `The following is a question made to an AI assistant. The assistant is friendly, concise, informative. The assistant answers are written at a 14 years old level.
    
    Human: ${question}
    AI:`;
}