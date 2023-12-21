# Quizzcord
<img src="https://raw.githubusercontent.com/TrRollet/QuizzCord/main/assets/logo.jpg" width="200" height="200">

[![npm](https://img.shields.io/npm/v/quizzcord.svg)](https://www.npmjs.com/package/quizzcord)
[![npm](https://img.shields.io/npm/dt/quizzcord.svg)](https://www.npmjs.com/package/quizzcord)
[![Support Server](https://img.shields.io/discord/565838133447710978.svg?color=7289da&label=Support%20Server&logo=discord&style=flat-square)](https://discord.gg/fqHd6GBraG)
[![GitHub](https://img.shields.io/github/license/TrRollet/QuizzCord.svg)](https://github.com/TrRollet/QuizzCord/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/TrRollet/QuizzCord.svg?style=social&label=Stars)](https://github.com/TrRollet/QuizzCord/stargazers)
[![Version](https://img.shields.io/badge/Version-1.0.1-blue)](https://npmjs.com/package/quizzcord)

## 📖 Description
A simple quizz module for Discord.js bots. It allows you to create a quizz with questions and answers, and to check if the answers are correct. It also allows you to get the score of a user and the leaderboard.

## ✅ Examples
```js
const Discord = require('discord.js');
const client = new Discord.Client();
const { Quizz } = require('quizzcord');

createQuizz = async () {
	const quizz = new Quizz();
	await quizz.init();

	await quizz.addQuestion('What is the capital of France?', ['Paris']);
	await quizz.addQuestion('What is 2+2?', ['4', 'four']);

	return quizz;
}

// ... 

// async function
let question = quizz.getQuestion();
const answer = "Paris";
const correct = await quizz.checkAnswer(answer); // If the answer is correct, the score of the user is incremented (custom points in future versions)
if (correct) {
	let score = quizz.getScore(user.id);
	quizz.nextQuestion();
	message.channel.send(`Correct! Your score is now ${score}`);

	question = quizz.getQuestion();
	if (!question) {
		quizz.getLeaderboard((leaderboard) => {
			// [{ userId: '123456789', score: 2 }, { userId: '987654321', score: 1 }}]
		});
	}
	// Send the question to the channel
}

// ...
```

## 📚 Documentation
### ❓ Quizz
#### 🛠️ Methods
##### `init(state)`
Initialize the quizz. The state is optional and can be used to restore a quizz. Returns a promise.

##### `addQuestion(question, answers)`
Add a question to the quizz. The question must be a string, and the answers an array of strings.

##### `getQuestion()`
Get the current question. Returns a string.

##### `checkAnswer(player_id, answer)`
Check if the answer is correct. Returns a promise that resolves to a boolean.

##### `nextQuestion()`
Go to the next question.

##### `getScore(userId)`
Get the score of a user. Returns a promise that resolves to an integer.

##### `getLeaderboard()`
Get the leaderboard. Returns an array of objects sorted by score with this structure:
```js
[{ userId: '123456789', score: 2 }, { userId: '987654321', score: 1 }]
```
##### `reset()`
Reset the quizz by removing scores but keeping questions and answers.

##### `delete()`
Delete the quizz by removing all questions, answers and scores.

##### `saveState()`
Save the state of the quizz. Returns an Object that can be used to restore the quizz with the `init` method.

## 📜License
This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details
