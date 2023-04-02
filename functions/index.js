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
                // const completion = await openai.createChatCompletion(
                //     model = "gpt-3.5-turbo",
                //     messages = [
                //         { "role": "user", "content": "Hello Hawaiian assistant, how are you?" }
                //     ]
                // );
                // const completion = await openai.createChatCompletion({
                //     model: "gpt-4",
                //     messages: [{ role: "user", content: "Hello world" }],
                // });
                
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: generatePrompt(questionInput) }],
                    temperature: 0.7,
                    stream: true
                }, { responseType: 'stream' });

                // for (const chunk of completion) {
                //     console.log(">>>entra: " + chunk);
                // }

                // completion.data.on('data', data => console.log(data.toString()))

                var answer = "";

                completion.data.on('data', data => {
                    const lines = data.toString().split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        const message = line.replace(/^data: /, '');
                        if (message === '[DONE]') {
                            console.log(">>>> LLEGA A DONE")
                            // res.status(200).json({ result: answer });
                            return; // Stream finished
                        }
                        try {
                            const parsed = JSON.parse(message);
                            answer += parsed.choices[0].delta.content;
                            // console.log(parsed.choices[0].delta.content);
                            console.log(">>>answer: " + answer);
                            // res.status(200).json({ result: "hola" });


                        } catch (error) {
                            console.error('Could not JSON parse stream message', message, error);
                        }
                    }
                });

                console.log("=====================================");

                // for(const chunk in completion.data) {
                //     console.log(">>>entra: " + chunk);
                //     if (chunk == "data") {
                //         const datos = completion[chunk];
                //         const arrayDatos = datos.split("\n");
                        
                        
                //         console.log(">>>DATOS: " + datos);
                //         console.log(">>>ARRAY_DATOS: " + arrayDatos + " - " + arrayDatos.length);

                //         var message = "";

                //         for(var i = 0; i < arrayDatos.length; i++) {
                //             console.log(">>>ARRAY_DATOS[" + i + "]: " + arrayDatos[i]);
                //             const arrayDatos2 = arrayDatos[i].split(" ");
                //             message = message + " hola";
                //             console.log("->message: " + message);

                //             res.write(message);
                //             // res.status(200).json({ result: message });

                //         }

                //         // console.log(">>>ARRAY_DATOS[0]: " + arrayDatos[0]);
                //         // console.log(">>>ARRAY_DATOS[1]: " + arrayDatos[1]);
                //         // console.log(">>>ARRAY_DATOS[2]: " + arrayDatos[2]);
                //         // console.log(">>>ARRAY_DATOS[3]: " + arrayDatos[3]); 
                //         // console.log(">>>ARRAY_DATOS[4]: " + arrayDatos[4]); 
                //         // // console.log(">>>DELTA: " + arrayDatos[2].

                //         // console.log(">>>ARRAY_DATOS[0]: " + arrayDatos[0]);
                //         // const chunk_data = chunk["data"];
                //         // console.log("olrait: " + chunk_data);
                //         // console.log(">>>entra2: " + chunk.message);
                //         // console.log(">>>entra3: " + chunk.message.content);
                //     }
                //     // const chunk_message = chunk["choices"][0]["delta"];
                //     // console.log("chunk_message: " + chunk_message);
                // }



                // console.log(completion.data.choices[0);

                // var collected_messages = []
                // for(var chunk in completion) {

                //     var chunk_message = chunk['choices'][0]['delta']
                //     collected_messages.append(chunk_message)
                    
                //     console.log(chunk_message)
                // }


                // console.log(completion.data.choices[0].message.content);

                // const completion = await openai.createCompletion({
                //     model: "text-davinci-003",
                //     prompt: generatePrompt(questionInput), 
                //     temperature: 0.9,
                //     max_tokens: 1500,
                //     top_p: 1,
                //     frequency_penalty: 0.0,
                //     presence_penalty: 0.6,
                //     stop: [" Human:", " AI:"],
                //   });
    
                // saving in firebase
                // const questionsRef = db.collection('questions');
                // await questionsRef.doc(questionKey).set({
                //     // question: questionInput, answer: completion.data.choices[0].message.content
                //     question: questionInput, answer: "test"
                // });
    
                // res.status(200).json({ result: answer });
                
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