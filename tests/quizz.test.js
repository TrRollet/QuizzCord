const Quizz = require('../src/functions/index.js');

describe('Quizz', () => {
	let quizz;

	beforeEach(async () => {
		quizz = new Quizz();
		await quizz.init();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('constructor initializes with default values', () => {
		expect(quizz.questions).toEqual([]);
		expect(quizz.currentQuestionIndex).toEqual(0);
	});

	test('getAllQuestions returns all questions', async () => {
		await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
		await quizz.addQuestion('What is the capital of France?', ['Paris']);
		const questions = await quizz.getAllQuestions();
		expect(questions).toEqual([
			{ question: 'What is 2 + 2?', answers: ['4', 'four'] },
			{ question: 'What is the capital of France?', answers: ['Paris'] }
		]);
	});

	test('getQuestion returns the current question', async () => {
		await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
		expect(quizz.getQuestion()).toEqual('What is 2 + 2?');
	});

	test('removeQuestion removes a question', async () => {
		await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
		await quizz.removeQuestion(0);
		expect(quizz.questions).toEqual([]);
	});

	test('addAnswerToQuestion adds an answer to a question', async () => {
		await quizz.addQuestion('What is 2 + 2?', ['4']);
		await quizz.addAnswerToQuestion(0, 'four');
		expect(quizz.questions[0].answers).toContain('four');
	});

	test('saveState returns the current state of the quizz', async () => {
		await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
		const state = quizz.saveState();
		expect(state).toEqual({
			questions: [{ question: 'What is 2 + 2?', answers: ['4', 'four'] }],
			currentQuestionIndex: 0,
			score: {}
		});
  	});

	test('removeQuestion throws an error when the question does not exist', async () => {
		await expect(quizz.removeQuestion(0)).rejects.toThrow();
	});
	
	test('addAnswerToQuestion throws an error when the question does not exist', async () => {
		await expect(quizz.addAnswerToQuestion(0, 'four')).rejects.toThrow();
	});
	
	test('getQuestion returns null when there are no questions', () => {
		expect(quizz.getQuestion()).toBeNull();
	});
	
	test('saveState returns an empty state when the quizz is empty', () => {
		const state = quizz.saveState();
		expect(state).toEqual({
			questions: [],
			currentQuestionIndex: 0,
			score: {}
		});
	});

	test('addQuestion throws an error when the question already exists', async () => {
		await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
		await expect(quizz.addQuestion('What is 2 + 2?', ['4', 'four'])).rejects.toThrow();
	});
	
	test('addAnswerToQuestion throws an error when the answer already exists', async () => {
		await quizz.addQuestion('What is 2 + 2?', ['4']);
		await quizz.addAnswerToQuestion(0, 'four');
		await expect(quizz.addAnswerToQuestion(0, 'four')).rejects.toThrow();
	});

	test('loadState loads a state', async () => {
		const state = {
			questions: [{ question: 'What is 2 + 2?', answers: ['4', 'four'] }],
			currentQuestionIndex: 0,
			score: {}
		};
		const quizz2 = new Quizz();
		await quizz2.init(state);
		expect(quizz2.questions).toEqual(state.questions);
		expect(quizz2.currentQuestionIndex).toEqual(state.currentQuestionIndex);
	});

	test('getLeaderboard returns the leaderboard', async () => {
		// Add some questions and simulate some answers
		await quizz.addQuestion('What is 2 + 2?', ['4', 'four']);
		await quizz.addQuestion('What is the capital of France?', ['Paris']);
		await quizz.addQuestion('What is the capital of Spain?', ['Madrid']);
		await quizz.checkAnswer('user1', '4');
		await quizz.nextQuestion();
		await quizz.checkAnswer('user2', 'Paris');
		await quizz.nextQuestion();
		await quizz.checkAnswer('user1', 'Madrid');

		// Get the leaderboard
		quizz.getLeaderboard((leaderboard) => {
			expect(leaderboard).toEqual([
				{ player_id: 'user1', score: 2 },
				{ player_id: 'user2', score: 1 }
			]);
		});
	});
});