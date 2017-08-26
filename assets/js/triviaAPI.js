$(document).ready(function(){


// variables used in the HTML
var jumbotronMessage;
var questionOutput;
var answer;
var answerButtons;
var timer;
var questionsLeft;
var triviaObject;
var correctAnswer;
var questionArrayLoc;
var answersArray=[];
// vars used in the modal
var modalMessage;
var numCorrect;
var numWrong;
var numTimedOut;

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;

// questions and answers object

// functions
function getQuestions(){
		console.log("getQuestions");
		//var movie = $(this).attr("data-name");
        var queryURL = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple";

        // Creates AJAX call for the specific movie button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
        	triviaObject=response.results;
        	questionsLeft=triviaObject.length;
        	// console.log("response.results");
        	// console.log(response.results);
        	// console.log("questionsLeft " + questionsLeft)
        	// console.log("triviaObject ");
        	// console.log(triviaObject); 
        	updateScore();
        });
	}
// create the question  list from the object array
function startModal(){
	console.log("startModal");
	$("#startModal").modal();
	$(".startModalClass").on("click",function(){
			startGame();
	});
}

function startGame(){
	console.log("startGame");
$("#jumbotronMessage").text("Good Luck, Stupid");
numWrong=0;
numCorrect=0;
numTimedOut=0;
	clearInterval(intervalId);
	clockRunning=false;
getQuestions();
}

function updateScore(){
	console.log("updateScore");
	$("#questionsLeft").text(questionsLeft);
	//console.log("questions left " + questionsLeft);
	//console.log(triviaObject);

	if (questionsLeft === 0) {
		console.log("ENDING SCORE CALLED");
		endingScore();
	}
	else if (questionsLeft <= triviaObject.length ) {
		console.log("NEXT QUESTION CALLED");
		nextQuestion();
		}
	else {
		$("#message").text("ERROR IN updateScore!");
	}
}

function nextQuestion(){
		console.log("nextQuestion");
			questionArrayLoc=triviaObject[questionsLeft-1];
			questionOutput=triviaObject[questionsLeft-1].question;

			// Grab A question From The List
			console.log(questionOutput);
			$("#question").text(questionOutput);
			// zero out the answers
			$('#answers').empty();
			//	create the questions into an array dynamically. Correct answer is always [0]
			answersArray=[];
			answersArray.push(questionArrayLoc.correct_answer);
			//console.log("questionArrayLoc.correct_answer " + questionArrayLoc.correct_answer);
        	 for (var i=0; i<questionArrayLoc.incorrect_answers.length;i++){
        	 	//console.log("questionArrayLoc.incorrect_answers[i] " + questionArrayLoc.incorrect_answers[i]);
        	 	answersArray.push(questionArrayLoc.incorrect_answers[i]);
        	}
        	
        	console.log(answersArray);
      		 console.log(answersArray.length);
	// display the question and the answers as buttons
			var idx = Math.round(Math.random() % answersArray.length);
			var correctAnswer = answersArray[0];
			var randomIncorrectAnswer = answersArray[idx];
			answersArray[0] = randomIncorrectAnswer;
			answersArray[idx] = correctAnswer;
			console.log(answersArray);
			console.log(answersArray.length);
	///this isnt working below sherp
			for (var j=0; j < answersArray.length; j++){
				  var a = $("<button>"); 
          		 // Added a data-attribute
         		 	a.attr("data-name", answersArray[j]);
          			a.attr("class", "button btn btn-default btn-lg normal-button answer-button")
          			// Provided the initial button text
          			a.text(answersArray[j]);
          			// remove that answer from the array
          		
          			//console.log("a: " + a);
         			 // Added the button to the buttons-view div
         			 $("#answers").append(a);
				}
			//start the timer
			if (!clockRunning){
				timer=10;
				intervalId=setInterval(countDown, 1000);
				clockRunning=true;
			}		
}
function isCorrect(){
	//if the answer is correct, numCorrect++, questionsLeft--, then display the next question if applicable
	$("#jumbotronMessage").text("Well done, sir");
	numCorrect++;
	questionsLeft--;
	clearInterval(intervalId);
	clockRunning=false;
	updateScore();
}

function isWrong(){
	// if the answer is incorrect, numWrong++, questionsLeft--, then display the next quesion if applicable
	$("#jumbotronMessage").text("Good one, jackass. Try harder.");
	numWrong++;
	questionsLeft--;
	clearInterval(intervalId);
	clockRunning=false;
	updateScore();
}

	//if the answer times out, timedOut++, questionsLeft--, clear the timer, then display the next question if applicable
function timeRanOut(){
	$("#jumbotronMessage").text("Work Faster. Quit texting your mother.");
	numTimedOut++;
	questionsLeft--;
	clearInterval(intervalId);
	clockRunning=false;
	updateScore();
}

	// start the countdown. if timer runs out, timeRanOut();
function countDown(){
	$("#timer").text(timer);
	if (timer === 0){
		timeRanOut();

		}
	timer--;
}

function verifyAnswer(buttonClicked){
	var correctAnswer=answersArray[0];
	// console.log("verifyAnswer");
	// console.log("correctANswer " + correctAnswer);
	// console.log(buttonClicked + correctAnswer);
	// find out if the answer picked is correct
	if (buttonClicked === correctAnswer) {

		//if the answer is correct, numCorrect++, questionsLeft--, then display the next question if applicable
		isCorrect();
	}
	else {
		//the answer is incorrect, numWrong++, questionsLeft--, then display the next quesion if applicable

		isWrong();
	}
};


function endingScore(){
	//pop out the score board modal
	clearInterval(countDown);
	clockRunning=false;
 	$("#scoreModal").modal();
 	$("#numCorrect").text(numCorrect);
 	$("#numWrong").text(numWrong);
 	$("#numTimedOut").text(numTimedOut);
 	var totalQuestions=triviaObject.length
 	var percentIncorrect=((numWrong+numTimedOut)/totalQuestions)*100;
 	var percentCorrect=(numCorrect/totalQuestions)*100;
 	$("#percentCorrect").text(percentCorrect);
 	$("#percentIncorrect").text(percentIncorrect);
 	if (percentCorrect >=75) {
 		$("#finalGrade").text("You Passed, Sucka");
 		}
 	else {
 		$("#finalGrade").text("You Failed, Fool.");
 	}
}

// Start the game with startModal
startModal();
$("body").on("click", ".answer-button", function(){
	 event.preventDefault();
	var clickedButton=$(this).attr("data-name");
	verifyAnswer(clickedButton);
	});

});
