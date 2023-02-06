const functions = require('firebase-functions');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.askHawaiiAI = functions.https.onRequest(async (req, res) => {
    const questionInput = req.query.text;
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
            // const completion = await openai.createCompletion({
            //     model: "text-davinci-003",
            //     prompt: generatePrompt(questionInput),
            //     temperature: 0,                
            //     max_tokens: 1500,
            //     top_p: 1,
            //     frequency_penalty: 0.0,
            //     presence_penalty: 0.0,
            //     stop: ["\n"],
            // });

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



            // res.status(200).json({ result: completion.data.choices[0].text });
            res.status(200).json({ result: completion.data.choices[0].text });
            // res.status(200).text({ result: completion.data.choices[0].text });

            // res.status(200).send(`<div>
            // ${completion.data.choices[0].text})
            // </div>`);


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
});

// function generatePrompt(question) {
//     // const capitalizedAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//     return `Answer questions related with any topic.
  
//   Question: ${question}
//   Content:`;
// }

function generatePrompt(question) {
    return `The following is a question made to an AI assistant. The assistant is friendly, concise, informative. The assistant answers are written at a 14 years old level.
    
    Human: ${question}
    AI:`;
}