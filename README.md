# 🤖 Multi-Tool AI Agent using JavaScript & Gemini

My first hands-on project exploring **AI Agents, Function Calling, and API Integration** using JavaScript and Google's Gemini API.

This project helped me understand how an AI model can interact with external tools, execute functions, retrieve real-world information, and combine multiple tool results to answer a user's query.

## 🚀 What Can It Do?

The agent currently supports six tools:

| Tool | Functionality |
|---|---|
| 🧮 Sum | Performs addition of two numbers |
| 🔢 Prime Checker | Checks whether a number is prime |
| 🌦️ Weather | Fetches current weather information for a city |
| 🕒 Current Time | Gets the current date and time for a given timezone |
| 💱 Currency Converter | Converts currencies such as USD to INR |
| ₿ Crypto Price | Fetches cryptocurrency prices in USD |

## 🧠 How Does It Work?

The project uses **Gemini Function Calling** to decide which tools should be executed based on the user's prompt.

Here's the basic workflow:

1. The user sends a prompt to the AI Agent.
2. The prompt and conversation history are sent to Gemini.
3. Gemini decides whether a tool is required.
4. If a tool is needed, Gemini returns the function name and its arguments.
5. JavaScript executes the corresponding function.
6. The tool results are sent back to Gemini.
7. Gemini generates the final response for the user.

The agent also uses `Promise.all()` to execute multiple requested tool calls concurrently.

## 🛠️ Technologies & Concepts Used

**Technologies**
- JavaScript (Node.js)
- Google Gemini API (`@google/genai`)
- REST APIs
- `fetch()` for API requests
- `readline-sync` for terminal-based user interaction

**Fundamental Concepts Explored**
- AI Agent Workflow
- Function Calling
- Tool Declarations
- Asynchronous JavaScript (`async/await`)
- Concurrent Execution using `Promise.all()`
- API Requests and Responses
- JSON Data Handling
- Conversation History Management

## 🌐 External APIs Used

| API / Service | Purpose |
|---|---|
| [Open-Meteo](https://open-meteo.com/) | Weather information |
| [Frankfurter](https://www.frankfurter.dev/) | Currency exchange rates |
| [CoinGecko](https://www.coingecko.com/) | Cryptocurrency prices |

The current time tool uses JavaScript's built-in `Intl.DateTimeFormat`, so it doesn't require an external API.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

### 2. Install dependencies

```bash
npm install
```

Make sure your project includes the required packages:

```bash
npm install @google/genai readline-sync dotenv
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

**Important:** Never upload your `.env` file or expose your API key on GitHub. Add `.env` to your `.gitignore` file.

### 4. Run the project

```bash
node index.js
```

Replace `index.js` with your actual entry-point filename if it's different.

## 🎯 What I Learned

Building this project was more than just connecting an AI model to some APIs.

I got hands-on experience with how function calling works, how an AI model interacts with JavaScript functions, how external APIs provide real-world data, and how multiple tools can work together within a single agent workflow.

I'm still learning and exploring the world of AI Agents, and this project is one of my steps towards understanding it better.

## 🙏 Acknowledgement

A special thanks to **Rohit Negi Sir**. I'm currently learning AI Agents through his playlist, and this project is part of my hands-on learning journey.

His explanations helped me understand the fundamental concepts and encouraged me to learn by building.

---

⭐ If you find this project interesting, feel free to explore the code!
