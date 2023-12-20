# QuizzCord

## Description
A simple quizz package for discord.js

## Example
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

let question = quizz.getQuestion();
const answer = "Paris";
const result = await quizz.checkAnswer(answer);
if (result) {
	let score = quizz.getScore(user.id);
	quizz.nextQuestion();
	question = quizz.getQuestion();
	if (!question) {
		let leaderboard = await quizz.getLeaderboard();
		// Send the leaderboard to the channel
	}
	// ...
}

// ...
```

## Documentation
### Quizz
#### Methods
##### init()
Initialize the quizz. Must be called before any other method.
##### addQuestion(question, answers)
Add a question to the quizz. The question must be a string, and the answers an array of strings.
##### getQuestion()
Get the current question. Returns a string.
##### checkAnswer(answer)
Check if the answer is correct. Returns a boolean.
##### nextQuestion()
Go to the next question.
##### getScore(userId)
Get the score of a user. Returns an integer.
##### getLeaderboard()
Get the leaderboard. Returns an array of objects with the following structure:
```js
{
	user: Discord.User.id,
	score: integer
}
```
##### reset()
Reset the quizz.