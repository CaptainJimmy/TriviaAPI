$(document).ready(function(){


// variables used in the HTML
var jumbotronMessage;
var questionOutput;
var answer;
var answerButtons;
var timer;
var questionsLeft;
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
var triviaQuestion = [
	{
	question: "What is the punishment for deserting the Night's Watch?",
	answers: [
		{answer:"Exile",isCorrect:false},
	 	{answer:"Beheading", isCorrect:true},
 		{answer:"Joining the Septans",isCorrect:false},
 		{answer:"Stoneskin",isCorrect:false}
 		]
 	},
 	{
	question: "What is Ser Loras Tyrell's nickname",
	answers: [	
	 	{answer: "The Knight of Roses",isCorrect:false},
	 	{answer:"The Arbor Knight", isCorrect:false},
 		{answer:"The Knight of Plenty",isCorrect:false},
 		{answer:"The Knight of Flowers",isCorrect:true}
 		]
 	},
 	{
 	question: "What is Arya Stark's name for her sword?",
 	answers: [
	 	{answer: "Ice",isCorrect:false},
	 	{answer:"Sting", isCorrect:false},
 		{answer:"Needle",isCorrect:true},
 		{answer:"Longclaw",isCorrect:false}
 		]
 	},
 	{
 	question: "Who is Gendry REALLY?",
 	answers: [
	 	{answer: "Ned Stark's Nephew",isCorrect:false},
	 	{answer:"Robert Baratheon's Bastard", isCorrect:false},
 		{answer:"Jon Arryn's Assistant",isCorrect:false},
 		]
 	},
 	{
 	question: "What is Sansa Stark's Direwolf's Name?",
 	answers: [
	 	{answer: "Grey Wind",isCorrect:false},
	 	{answer:"Nymeria", isCorrect:false},
 		{answer:"Lady",isCorrect:true},
 		{answer:"Summer",isCorrect:false},
 		{answer:"Ghost",isCorrect:false},
 		]
 	},
	{
 	question: "Who does the Red Priestess kill first?",
 	answers: [
	 	{answer: "Selyse Baratheon",isCorrect:false},
	 	{answer:"Rob Stark", isCorrect:false},
 		{answer:"Renly Baratheon",isCorrect:true},
 		{answer:"Loras Tyrell",isCorrect:false},
 		{answer:"Gendry Baratheon",isCorrect:false},
 		]
 	},
 	{
 	question: "True or False: George R R Martin wrote A Song of Ice and Fire too impossibly big and complex to ever be filmed in a movie or a TV show.",
 	answers: [
	 	{answer: "False",isCorrect:false},
 		{answer:"True",isCorrect:true},
 		]
 	},
 	{
 	question: "Who actually killed Joffrey Baratheon?",
 	answers: [
	 	{answer: "Sansa Stark",isCorrect:false},
	 	{answer:"The Red Priestess", isCorrect:false},
 		{answer:"The Queen of Thorns",isCorrect:true},
 		{answer:"Tyrion Lannister",isCorrect:false},
 		{answer:"Rob Stark",isCorrect:false},
 		]
 	}
];

// functions

// create the question  list from the object array
function startModal(){
	$("#startModal").modal();
	$(".startModalClass").on("click",function(){
			startGame();
	});
}

function startGame(){
	console.log("startGame");
$("#jumbotronMessage").text("Good Luck, Stupid");
questionsLeft=triviaQuestion.length;
numWrong=0;
numCorrect=0;
numTimedOut=0;
	clearInterval(intervalId);
	clockRunning=false;
updateScore();
}

function updateScore(){
	$("#questionsLeft").text(questionsLeft);
	if (questionsLeft === 0) {
		endingScore();
	}
	else if (questionsLeft <= triviaQuestion.length ) {
		nextQuestion();
		}
	else {
		$("#message").text("ERROR IN updateScore!");
	}

}

function nextQuestion(){
//console.log("nextQuestion");
		
			questionOutput=triviaQuestion[questionsLeft-1];
			// Grab A question From The List
			$("#question").text(questionOutput.question);
			// display the question and the answers as buttons
			$('#answers').text("");
			for (var i=0; i < questionOutput.answers.length; i++){
				$("#answers").append('<button class="btn btn-default btn-lg normal-button answer-button" id="' + i + '">' + questionOutput.answers[i].answer + ' </button>');
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

	// find out if the answer picked is correct
	if (questionOutput.answers[buttonClicked].isCorrect) {
		//if the answer is correct, numCorrect++, questionsLeft--, then display the next question if applicable

		isCorrect();
	}
	else if (!questionOutput.answers[buttonClicked].isCorrect){
		// if the answer is incorrect, numWrong++, questionsLeft--, then display the next quesion if applicable

		isWrong();
	}
	
	else {
		$("#jumbotronMessage").text("Error in verifyAnswer");

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
 	var totalQuestions=triviaQuestion.length
 	var percentIncorrect=((numWrong+numTimedOut)/totalQuestions)*100;
 	var percentCorrect=(numCorrect/totalQuestions)*100;
 	$("#percentCorrect").text(percentCorrect);
 	$("#percentIncorrect").text(percentIncorrect);
 	if (percentCorrect >=80) {
 		$("#finalGrade").text("You Passed, Sucka");
 		}
 	else {
 		$("#finalGrade").text("You Failed, Fool.");
 	}
}

// Start the game with startModal
startModal();
$("body").on("click", ".answer-button", function(){
	var id=this.id;
	verifyAnswer(id);
	});

});
