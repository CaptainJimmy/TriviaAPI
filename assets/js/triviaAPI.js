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
var correctAnswerIdx=0;
// vars used in the modal
var modalMessage;
var numCorrect;
var numWrong;
var numTimedOut;
var tokenURL = "https://opentdb.com/api_token.php?command=request";
var token;
//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;

// functions
function getQuestions(){
		
        var queryURL = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple&token=" + token;
        // Creates AJAX call to retrieve a new token

        // Creates AJAX call for the specific movie button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
        	triviaObject=response.results;
        	questionsLeft=triviaObject.length;
        	updateScore();
        });
	}
//start the starting Modal
function startModal(){
	$("#startModal").modal();
	$(".startModalClass").on("click",function(){
			startGame();
	});
};
// start the game 
function startGame(){
$("#jumbotronMessage").text("Good Luck, Friend");
numWrong=0;
numCorrect=0;
numTimedOut=0;
	clearInterval(intervalId);
	clockRunning=false;
getQuestions();
}

//update the score/questions left
function updateScore(){

	$("#questionsLeft").text(questionsLeft);

	if (questionsLeft === 0) {
		endingScore();
	}
	else if (questionsLeft <= triviaObject.length ) {
		nextQuestion();
		}
	else {
		$("#message").text("ERROR IN updateScore!");
	}
}

function nextQuestion(){
			questionArrayLoc=triviaObject[questionsLeft-1];
			questionOutput=triviaObject[questionsLeft-1].question;

			// Grab A question From The List
			$("#question").html(questionOutput);
			// zero out the answers
			$('#answers').empty();
			//	create the questions into an array dynamically. Correct answer is always [0]
			answersArray=[];
			answersArray.push(questionArrayLoc.correct_answer);
			//console.log("questionArrayLoc.correct_answer " + questionArrayLoc.correct_answer);
        	 for (var i=0; i<questionArrayLoc.incorrect_answers.length;i++){
        	 	//console.log("questionArrayLoc.incorrect_answers["+ i+"] " + questionArrayLoc.incorrect_answers[i]);
        	 	answersArray.push(questionArrayLoc.incorrect_answers[i]);
        	}
     
	// display the question and the answers as buttons, the zero index is moved to a random location, and that location is moved to zero
			//correctAnswerIdx = Math.round(Math.random() % (answersArray.length-1)) + 1;
			correctAnswerIdx = Math.round(Math.random() % (answersArray.length-1));

			var correctAnswer = answersArray[0];
			var randomIncorrectAnswer = answersArray[correctAnswerIdx];
			answersArray[0] = randomIncorrectAnswer;
			answersArray[correctAnswerIdx] = correctAnswer;
	
			for (var j=0; j < answersArray.length; j++){
				  var a = $("<button>"); 
          		 // Added a data-attribute
         		 	a.attr("data-name", answersArray[j]);
          			a.attr("class", "button btn btn-default btn-lg normal-button answer-button")
          			// Provided the initial button text
          			a.html(answersArray[j]);
          			// remove that answer from the array
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
	$("#jumbotronMessage").text("You LOSE. Good DAY sir.");
	numWrong++;
	questionsLeft--;
	clearInterval(intervalId);
	clockRunning=false;
	updateScore();
}

	//if the answer times out, timedOut++, questionsLeft--, clear the timer, then display the next question if applicable
function timeRanOut(){
	$("#jumbotronMessage").text("Work Faster, Time's Up");
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
	var correctAnswer=answersArray[correctAnswerIdx];

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
 	var imageClasses="img-responsive img-rounded";
 	if (percentCorrect >=75) {
 		$("#finalGrade").text("You Passed, Sucka");
 		var winImage=$("<img>");
 		winImage.attr("src","assets/images/mistertwin.jpg");
 		winImage.attr("alt","You Won, Sucka!");
 		winImage.attr("class", imageClasses);
 		$("#modalImageDiv").html(winImage);
 		}
 	else {
 		$("#finalGrade").text("You Failed, Fool.");
 		 var loseImage=$("<img>");
 		loseImage.attr("src","assets/images/mistertlose.jpg");
 		loseImage.attr("alt","You Lose, Fool!");
 		loseImage.attr("class", imageClasses);
 		$("#modalImageDiv").html(loseImage);
 	}
}
// retrieve a new token for the trivia DB on initial load.  Will reuse that token unless the page is refreshed.
        $.ajax({
          url: tokenURL,
          method: "GET"
        }).done(function(response) {
        	token=response.token;
        });

// Start the game with startModal
startModal();
//the on click for the answer buttons
$("body").on("click", ".answer-button", function(){
	 event.preventDefault();
	var clickedButton=$(this).attr("data-name");
	verifyAnswer(clickedButton);
	});

});
