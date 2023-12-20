/**
 * Class representing a quizz.
 * 
 * A `Quizz` represents a quizz game. It contains a series of questions, each with a correct answer. 
 * The quizz keeps track of which question is currently being asked and provides methods to add questions, 
 * check answers, and get the score of a player.
 * 
 * Here is an example of how to use the `Quizz` class:
 * 
 * ```javascript
 * const quizz = new Quizz();
 * await quizz.init();
 * quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
 * quizz.addQuestion('What is the capital of France?', ['Paris']);
 * 
 * const question = quizz.getQuestion();
 * console.log(question);  // 'What is 2 + 2?'
 * 
 * const isCorrect = await quizz.checkAnswer('4');
 * console.log(isCorrect);  // true
 * 
 * quizz.nextQuestion();
 * ```
 * 
 * In this example, a new quizz is created, two questions are added, and then the first question is asked. 
 * The answer '4' is checked for the first question, and then the quizz moves on to the next question. 
 * Finally, the score is retrieved, which is 1 because the first question was answered correctly.
 */
class Quizz {
	/**
	 * Create a new quizz.
	 * 
	 * This constructor creates a new quizz. The quizz is ready to have questions added and to be played.
	 * 
	 * If a state object is provided, the quizz is initialized with the state from the object.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * const state = quizz.saveState();
	 * // ... later ...
	 * const quizz2 = new Quizz();
	 * await quizz2.init(state);
	 * ```
	 * 
	 * In this example, a new quizz is created and two questions are added. The state of the quizz is saved and then later used to create a new quizz with the same state.
	 */
	constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
		this.score = {};
    }

	/**
	 * Create a new quizz.
	 * 
	 * This constructor creates a new quizz. The quizz is ready to have questions added and to be played.
	 * 
	 * If a state object is provided, the quizz is initialized with the state from the object.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * const state = quizz.saveState();
	 * // ... later ...
	 * const quizz2 = new Quizz();
	 * await quizz2.init(state);
	 * ```
	 * 
	 * In this example, a new quizz is created and two questions are added. The state of the quizz is saved and then later used to create a new quizz with the same state.
	 * 
	 * @param {Object} state - The state of the quizz to initialize with.
	 * @return {Promise<void>} A promise that resolves when the quizz has been initialized.
	 * @throws {Error} If the state is invalid.
	 */
    async init(state) {
        if (state) {
            if (typeof state !== 'object' || state === null) {
                throw new Error('State must be a non-null object.');
            }
        
            if (!Array.isArray(state.questions)) {
                throw new Error('State must have an array of questions.');
            }
        
            if (typeof state.currentQuestionIndex !== 'number') {
                throw new Error('State must have a numeric currentQuestionIndex.');
            }
        
            this.questions = state.questions;
            this.currentQuestionIndex = state.currentQuestionIndex;
			this.score = state.score;
        }
    }
	
	/**
	 * Delete the quizz.
	 * 
	 * This method deletes the quizz and resets it to its initial state. It removes all questions and clears the scores of all participants.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * await quizz.delete();  // The quizz is now deleted
	 * ```
	 * 
	 * After calling this method, the quizz will be as if it was just created. All questions will be removed and the scores of all participants will be cleared.
	 * 
	 * @return {Promise<boolean>} A promise that resolves with true if the quizz was successfully deleted, false otherwise.
	 * @throws {Error} If an error occurs while deleting the quizz.
	 */
	async delete() {
		try {
			if (this.questions == []) {
				return false;
			}
			this.questions = [];
			this.currentQuestionIndex = 0;
			return true;
		} catch (err) {
			throw new Error('An error occurred while deleting the quizz: ' + err.message);
		}
	}

	/**
	 * Add a question to the quizz.
	 * 
	 * This method adds a new question to the quizz. The question is represented by a string and an array of possible answers. The answers array is used to handle cases where a correct answer can be written in different ways.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * ```
	 * 
	 * In this example, the first question has two correct answers: '4' and 'four'. The second question has one correct answer: 'Paris', but it can be written in different ways like 'paris'.
	 * 
	 * After calling this method, the question will be added to the end of the list of questions in the quizz. The order in which questions are added is the order in which they will be asked when the quizz is played.
	 * 
	 * @param {string} question - The question text.
	 * @param {Array<string>} answers - The possible answers.
	 * @return {Promise<void>} A promise that resolves when the question has been added to the quizz.
	 * @throws {Error} If an error occurs while inserting the question or answers to the quizz.
	 */
	async addQuestion(question, answers) {
		// Validate inputs
		if (typeof question !== 'string' || question.trim() === '') {
			throw new Error('Question must be a non-empty string.');
		}
		if (!Array.isArray(answers) || answers.some(answer => typeof answer !== 'string')) {
			throw new Error('Answers must be an array of strings.');
		}

		const exists = this.questions.some(q => q.question === question);
		if (exists) {
			throw new Error('Question already exists.');
		}

		try {
			this.questions.push({ question, answers });
		} catch (err) {
			throw new Error('An error occurred while adding the question: ' + err.message);
		}
	}

	/**
	 * Get the current question.
	 * 
	 * This method returns the current question that is being asked in the quizz. The current question is determined by the order in which questions were added to the quizz and the number of times `nextQuestion` has been called.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * const question = quizz.getQuestion();
	 * console.log(question);  // 'What is 2 + 2?'
	 * 
	 * quizz.nextQuestion();
	 * const nextQuestion = quizz.getQuestion();
	 * console.log(nextQuestion);  // 'What is the capital of France?'
	 * ```
	 * 
	 * In this example, two questions are added to the quizz. The `getQuestion` method is then called to get the first question. After calling `nextQuestion`, `getQuestion` is called again to get the second question.
	 * 
	 * @return {string|null} The current question, or null if there are no more questions.
	 */
	getQuestion() {
		if (this.questions.length === 0 || this.currentQuestionIndex >= this.questions.length) {
			return null;
		}
		return this.questions[this.currentQuestionIndex].question;
	}

	/**
	 * Get all questions in the quizz.
	 * 
	 * This method returns all the questions that have been added to the quizz. Each question is represented as an object with properties 'question' and 'answers'.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * const questions = quizz.getAllQuestions();
	 * console.log(questions);  // [{ question: 'What is 2 + 2?', answers: ['4', 'four'] }, { question: 'What is the capital of France?', answers: ['Paris'] }]
	 * ```
	 * 
	 * @return {Array<Object>} The questions, each represented as an object with properties 'question' and 'answers'.
	 */
	getAllQuestions() {
		return this.questions;
	}

	/**
	 * Get all answers for the current question.
	 * 
	 * This method returns all the correct answers for the current question. The current question is determined by the order in which questions were added to the quizz and the number of times `nextQuestion` has been called.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * const answers = quizz.getAllAnswers();
	 * console.log(answers);  // ['4', 'four']
	 * ```
	 * 
	 * @return {Array<string>} The answers for the current question.
	 */
	getAllAnswers() {
		return this.questions[this.currentQuestionIndex].answers;
	}

	/**
	 * Move to the next question.
	 * 
	 * This method moves the quizz to the next question. If there are no more questions, it returns false.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * quizz.nextQuestion();  // Moves to the second question
	 * const question = quizz.getQuestion();
	 * console.log(question);  // 'What is the capital of France?'
	 * ```
	 * 
	 * @return {boolean|number} Returns true if successfully moved to the next question, false if there are no more questions.
	 */
	nextQuestion() {
		if (this.currentQuestionIndex < this.questions.length - 1) {
			this.currentQuestionIndex++;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Get the score for a specific player.
	 * 
	 * This method retrieves the score for a specific player from the quizz. The score is the number of questions the player has answered correctly.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * try {
	 *   const score = await quizz.getScore(1);
	 *   console.log(score);  // Logs the score of the player with ID 1
	 * } catch (err) {
	 *   console.error(err);  // Logs any error that occurred
	 * }
	 * ```
	 * 
	 * @param {number} player_id - The ID of the player.
	 * @return {Promise<number|undefined>} A promise that resolves with the score, or undefined if the user does not exist.
	 * @throws {Error} If an error occurs while retrieving the score from the quizz.
	 */
	async getScore(player_id) {
		const exists = this.score.hasOwnProperty(player_id);
		if (!exists) {
			return undefined;
		}

		try {
			const score = this.score[player_id];
			return score;
		} catch (err) {
			throw new Error('An error occurred while retrieving the score: ' + err.message);
		}
	}

	/**
	 * Check an answer.
	 * 
	 * This method checks a player's answer against the correct answer for the current question. If the answer is correct, the player's score is updated. If the answer is incorrect, the player's score is not updated.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
	 * const isCorrect = await quizz.checkAnswer(1, '4');
	 * console.log(isCorrect);  // true
	 * 
	 * isCorrect = await quizz.checkAnswer(2, 'five');
	 * console.log(isCorrect);  // false
	 * ```
	 * 
	 * @param {number} player_id - The ID of the player.
	 * @param {string} answer - The player's answer.
	 * @return {Promise<boolean>} A promise that resolves with true if the answer is correct, false otherwise.
	 * @throws {Error} If an error occurs while updating the points or adding the participant.
	 */
	async checkAnswer(player_id, answer) {
		try {
			if (!this.score.hasOwnProperty(player_id)) {
				this.score[player_id] = 0;
			}

			// Compare the answer to the correct answer in a case-insensitive manner
			const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;
			if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
				// If the answer is correct, update the points
				this.score[player_id]+=1;
				return true;
			} else {
				return false;
			}
		} catch (err) {
			throw new Error('An error occurred while checking the answer: ' + err.message);
		}
	}

	/**
	 * Get the leaderboard.
	 * 
	 * This method retrieves the leaderboard from the quizz. The leaderboard is an array of objects, each representing a player. Each object has properties 'player_id' and 'points'.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.getLeaderboard((leaderboard) => {
	 *  console.log(leaderboard);  // Logs the leaderboard
	 * });
	 * ```
	 * 
	 * @param {function} callback - A callback function to be called with the leaderboard.
	 * @return {Promise<void>} A promise that resolves when the leaderboard has been retrieved.
	 * @throws {Error} If an error occurs while retrieving the leaderboard from the quizz.
	 */
	async getLeaderboard(callback) {
		try {
			const leaderboard = this.score.sort((a, b) => b.points - a.points);
			callback(leaderboard);
		} catch (err) {
			throw new Error('An error occurred while retrieving the leaderboard: ' + err.message);
		}
	}

	/**
	 * Reset the quizz.
	 * 
	 * This method resets the quizz to its initial state. It sets the current question index back to 0 and clears the scores of all participants.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['2']);
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * 
	 * // ... user answers some questions ...
	 * 
	 * await quizz.reset();  // The quizz is now back to its initial state
	 * ```
	 * 
	 * After calling this method, the quizz will be as if no questions were ever answered. The questions remain in the quizz, but the current question index is reset and the scores of all participants are cleared.
	 * 
	 * @return {Promise<void>} A promise that resolves when the quizz has been reset.
	 * @throws {Error} If an error occurs while resetting the quizz.
	 */
	async reset() {
		try {
			this.currentQuestionIndex = 0;
			this.score = {};
		} catch (err) {
			throw new Error('An error occurred while resetting the scores: ' + err.message);
		}
	}

	/**
	 * Remove a question from the quizz.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * await quizz.removeQuestion(0);  // Removes the question at index 0
	 * ```
	 * 
	 * @param {number} index - The index of the question to remove.
	 * @return {Promise<void>} A promise that resolves when the question has been removed from the quizz.
	 * @throws {Error} If the index is out of bounds or if an error occurs while removing the question from the quizz.
	 */
	async removeQuestion(index) {
		if (index < 0 || index >= this.questions.length) {
			throw new Error('Index out of bounds.');
		}
	
		// Remove the question from the local array
		this.questions.splice(index, 1);
	
		// Adjust the current question index if necessary
		if (this.currentQuestionIndex > index) {
			this.currentQuestionIndex--;
		}
	}
	
	/**
	 * Add an answer to a question.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is 2 + 2?', ['4']);
	 * await quizz.addAnswerToQuestion(0, 'four');  // Adds the answer 'four' to the question at index 0
	 * ```
	 * 
	 * @param {number} index - The index of the question to add an answer to.
	 * @param {string} answer - The answer to add.
	 * @return {Promise<void>} A promise that resolves when the answer has been added to the question.
	 * @throws {Error} If the index is out of bounds or if an error occurs while adding the answer to the question.
	 * 
	 */
	async addAnswerToQuestion(index, answer) {
		if (index < 0 || index >= this.questions.length) {
			throw new Error('Index out of bounds.');
		}
		
		// Check if the answer already exists in the question
		const exists = this.questions[index].answers.some(a => a === answer);
		if (exists) {
			throw new Error('Answer already exists.');
		}
		
		// Add the answer to the local array
		this.questions[index].answers.push(answer);
	}
	
	/**
	 * Save the current state of the quizz.
	 * 
	 * Example usage:
	 * 
	 * ```javascript
	 * const quizz = new Quizz();
	 * await quizz.init();
	 * await quizz.addQuestion('What is the capital of France?', ['Paris']);
	 * const state = quizz.saveState();  // Saves the current state of the quizz
	 * console.log(state);  // { id: 1, questions: [{ question: 'What is the capital of France?', answers: ['Paris'] }], currentQuestionIndex: 0 }
	 * ```
	 * 
	 * @return {Object} The current state of the quizz, including the quizz ID, the questions, and the current question index.
	 */
	saveState() {
		return {
			id: this.id,
			questions: this.questions,
			currentQuestionIndex: this.currentQuestionIndex
		};
	}
}

module.exports = Quizz;