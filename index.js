import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const History = [];

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


async function getWeather({city}) {

    const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        return "City not found";
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    return {
        city: name,
        country: country,
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        feelsLike: weatherData.current.apparent_temperature,
        weatherCode: weatherData.current.weather_code,
        windSpeed: weatherData.current.wind_speed_10m
    };
}

function getCurrentTime({ timezone }) {
    try {
        const now = new Date();

        const currentTime = new Intl.DateTimeFormat("en-IN", {
            timeZone: timezone,
            dateStyle: "full",
            timeStyle: "long"
        }).format(now);

        return {
            timezone: timezone,
            currentTime: currentTime
        };

    } catch (error) {
        return "Invalid timezone provided.";
    }
}

async function convertCurrency({ amount, from, to }) {
    if (amount < 0) {
        return "Amount cannot be negative.";
    }

    if (from.toUpperCase() === to.toUpperCase()) {
        return {
            amount,
            from: from.toUpperCase(),
            to: to.toUpperCase(),
            convertedAmount: amount
        };
    }

    const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(from.toUpperCase())}&symbols=${encodeURIComponent(to.toUpperCase())}`
    );

    if (!response.ok) {
        return "Currency conversion failed. Check the currency codes.";
    }

    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];

    if (rate === undefined) {
        return "Exchange rate not available for these currencies.";
    }

    return {
        amount,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        exchangeRate: rate,
        convertedAmount: Number((amount * rate).toFixed(2)),
        date: data.date
    };
}

function sum({num1, num2}){
    return num1+num2;
}

function prime({num}){
    if(num<2)
        return false;

    for(let i=2;i<=Math.sqrt(num);i++){
        if(num%i==0) return false;
    }

    return true;
}

async function getCryptoPrice({coin}){
    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
    )
    const data = await response.json();

    return data;
}

const weatherDeclaration = {
    name: 'getWeather',
    description: "Get the current weather of any city given as the input like Kolkata or Mumbai or Delhi",
    parameters:{
        type: 'OBJECT',
        properties:{
            city:{
                type:'STRING',
                description:"It will be the name of the city, like Kolkata"
            }
        },
        required: ['city']
    }
}

const timeDeclaration = {
    name: 'getCurrentTime',
    description: "Get the current date and time using a timezone identifier like Asia/Kolkata or Asia/Tokyo.",
    parameters:{
        type: 'OBJECT',
        properties:{
            timezone:{
                type:'STRING',
                description:"Timezone identifier, such as Asia/Kolkata or Europe/London."
            }
        },
        required: ['timezone']
    }
}

const currencyDeclaration = {
    name: "convertCurrency",
    description: "Convert an amount from one currency to another using the latest available exchange rate.",
    parameters: {
        type: "OBJECT",
        properties: {
            amount: {
                type: "NUMBER",
                description: "Amount to convert."
            },
            from: {
                type: "STRING",
                description: "Source currency code, such as USD."
            },
            to: {
                type: "STRING",
                description: "Target currency code, such as INR."
            }
        },
        required: ["amount", "from", "to"]
    }
}

const sumDeclaration = {
    name: 'sum',
    description: "Get the sum of 2 numbers",
    parameters:{
        type: 'OBJECT',
        properties:{
            num1:{
                type:'NUMBER',
                description:"It will be the first number for addition ex: 10"
            },
            num2:{
                type:'NUMBER',
                description:"It will be the first number for addition ex: 15"
            }
        },
        required: ['num1', 'num2']
    }
}

const primeDeclaration = {
    name: 'prime',
    description: "Get if number is prime or not",
    parameters:{
        type: 'OBJECT',
        properties:{
            num:{
                type:'NUMBER',
                description:"It will be the number to find if it is prime or not ex:13"
            }
        },
        required: ['num']
    }
}

const cryptoDeclaration = {
    name: 'getCryptoPrice',
    description: "Get the current price of any crypto Currency like bitcoin",
    parameters:{
        type: 'OBJECT',
        properties:{
            coin:{
                type:'STRING',
                description:"It will be the crypto currency name, like bitcoin"
            }
        },
        required: ['coin']
    }
}

const availableTools = {
    getWeather: getWeather,
    getCurrentTime: getCurrentTime,
    convertCurrency: convertCurrency,
    sum: sum,
    prime: prime,
    getCryptoPrice: getCryptoPrice
}

async function runAgent(userProblem) {
    History.push({
        role: 'user',
        parts:[{text: userProblem}]
    });

    while(true){

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: History,
            config: {
                tools: [{
                    functionDeclarations: [
                        sumDeclaration, primeDeclaration, cryptoDeclaration, weatherDeclaration, timeDeclaration, currencyDeclaration
                    ]
                }]
            }
        });

        if(response.functionCalls && response.functionCalls.length>0){

            History.push(response.candidates[0].content);

            const functionResponses = await Promise.all(
                response.functionCalls.map(async (call) => {

                    const { name, args } = call;

                    const funCall = availableTools[name];

                    const result = await funCall(args);

                    return {
                        name: name,
                        response: {
                            result: result
                        }
                    };
                })
            );

            History.push({
                role: 'user',
                parts: functionResponses.map((functionResponse) => ({
                    functionResponse: functionResponse
                }))
            });
        }
        
        else{
            History.push({
                role:'model',
                parts: [{text: response.text}]
            })
            console.log(response.text);
            break;
        }
    }
}

async function main() {
    const userProblem = readlineSync.question("Ask me anything--> ");
    await runAgent(userProblem)
    main()
}


main()

