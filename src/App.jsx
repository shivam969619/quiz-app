import React, { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=19&type=multiple")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data.results);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  if (!showQuiz) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
        <div
          className="font-bold text-3xl h-12 w-64 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md flex items-center justify-center transition duration-300 transform hover:from-blue-600 hover:to-purple-600 hover:scale-105 cursor-pointer"
          onClick={handleStartQuiz}
        >
          Take a Quiz
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">
            Your score: {score} / {questions.length}
          </p>
          <button
            className="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4">
      {currentQuestion && (
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {currentQuestion.question}
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {[
              ...currentQuestion.incorrect_answers,
              currentQuestion.correct_answer,
            ]
              .sort(() => Math.random() - 0.5)
              .map((answer, index) => (
                <button
                  key={index}
                  className="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600"
                  onClick={() =>
                    handleAnswerClick(answer === currentQuestion.correct_answer)
                  }
                >
                  {answer}
                </button>
              ))}
          </div>
          <div className="flex justify-between">
            <button
              className="py-2 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-md hover:from-gray-600 hover:to-gray-700"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous Question
            </button>
            <button
              className="py-2 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-md hover:from-gray-600 hover:to-gray-700"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
