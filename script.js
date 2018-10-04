/* notes for improvement: 
-eliminate redundancies in drawClocks()
-create a more elegant way of setting/checking the state of the stopwatch
-change name of button functions to match what they actually do (change start, pause, and stop to start/pause, stop, and clear)
*/

$(document).ready(function () {

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
let minutes = 0;
let seconds = 0;
let miliseconds = 0;
let dateTime = 0;
let pauseDate = 0;
let elapsedPauseTime = 0;
let circleColor = "#D199D1";
let radius = 50;
let littleRadius = 15;
let lineWidth = 100;
let littleLineWidth = 30;
let circle = "fill"

function drawClocks(m,s,ms) {
	ctx.lineWidth = lineWidth;
	ctx.beginPath()
	//circle drawn for hours
	ctx.arc(canvas.width/4-45,canvas.height/2+8,radius,Math.PI*1.5,(Math.PI*2*(m+((s+ms/100)/60))/60)+Math.PI*1.5)
	ctx.strokeStyle = circleColor;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath()
	//circle drawn for minutes
	ctx.arc(canvas.width/2,canvas.height/2+8,radius,Math.PI*1.5,(Math.PI*2*(s+(ms/100))/60)+Math.PI*1.5)
	ctx.strokeStyle = circleColor;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	//circle drawn for seconds
	ctx.arc(canvas.width*3/4+45,canvas.height/2+8,radius,Math.PI*1.5,(Math.PI*2*ms/98)+Math.PI*1.5)
	ctx.strokeStyle = circleColor;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	//circle drawn for milliseconds
	ctx.lineWidth = littleLineWidth;
	ctx.arc(canvas.width-60,(canvas.height/2)+110,littleRadius,0,Math.PI*2)
	ctx.strokeStyle = circleColor;
	ctx.stroke();
	ctx.closePath();
}

/*
//outdated timer using setInterval() as opposed to the more accurate Date.now();

function timing() {
	ctx.beginPath();
	ctx.clearRect(0,0,600,200);
	ctx.closePath();
	$("#minutes").html(minutes);
	$("#seconds").html(seconds);
	$("#miliseconds").html(miliseconds);
	if (miliseconds < 99) {
		miliseconds += 1;}
	if (miliseconds === 99 && seconds < 59) {
		miliseconds = 0;
		seconds ++;
	}
	if (miliseconds === 99 && s === 59) {
		miliseconds = 0;
		seconds = 0;
		minutes ++;
	}
	drawClocks(minutes,seconds,miliseconds);
}
*/

//function for starting the stopwatch	
function timing2() {
	ctx.beginPath();
	ctx.clearRect(0,0,1000,400);
	ctx.closePath();
	if (dateTime === 0) {
	dateTime = Date.now();
}
	let timeElapsed = Date.now()-dateTime-elapsedPauseTime;
	function factorOut(raw,denominator) {
		//function for converting raw time units to multiples of 60 (24 for hours and 100 for miliseconds)
		return Math.floor(((raw/denominator)-(Math.floor(raw/denominator)))*denominator);
	}
	let milis = Math.floor(factorOut(timeElapsed,1000)/10);
	//variables with 'raw' in the name are in different multiples and get converted using factorOut
	let rawSecs = timeElapsed/1000;
	let secs = factorOut(rawSecs,60);
	let rawMins = timeElapsed/60000;
	let mins = factorOut(rawMins,60);
	let rawHours = timeElapsed/3600000;
	let hours = factorOut(rawHours,24);
	//updating the index.html with the time values
	$("#seconds").html(secs);
	$("#minutes").html(mins);
	$("#miliseconds").html(milis);
	$("#hours").html(hours);
	if (hours === 0) {
	//displays the time in the title of the page
	document.title = mins + "m" + secs + "s";
	}else if (hours > 0) {
		//how to show the display once the time gets into hours as the title can only fit two numeric values comfortably
		document.title = hours + "h" + mins + "m";
	}
	drawClocks(mins,secs,milis);
}

//rudimentary way to set the state of the stopwatch
let start = 1;
let stop;
$("#start").on('click', function () {
	//starting the stopwatch
	if (start !== true && start !== false) {
		stop = setInterval(timing2,10)
		start = true;
	}else if (start === true) {
		clearInterval(stop);
		start = false;
		pauseDate = Date.now();
	}else if (start === false) {
		elapsedPauseTime += Date.now() - pauseDate;
		stop = setInterval(timing2,10)
		start = true;
	}
});
$("#pause").on('click', function () {
	//stopping the stopwatch (also clears it)
	clearInterval(stop)
	pauseDate = 0;
	elapsedPauseTime = 0;
	dateTime = 0;
	start = 0;
	$("#hours").html(0);
	$("#seconds").html(0);
	$("#minutes").html(0);
	$("#miliseconds").html(0);
	document.title = 0 + "m" + 0 + "s";
	ctx.beginPath();
	ctx.clearRect(0,0,1000,400);
	ctx.closePath();
});
$("#stop").on('click', function () {
	//clears stopwatch
	pauseDate = 0;
	elapsedPauseTime = 0;
	dateTime = 0;
	if (start == false) {start = 0}
	$("#hours").html(0);
	$("#seconds").html(0);
	$("#minutes").html(0);
	$("#miliseconds").html(0);
	document.title = 0 + "m" + 0 + "s";
	ctx.beginPath();
	ctx.clearRect(0,0,1000,400);
	ctx.closePath();

})

$("#menu").on('click', function () {
	//display the different themes in the themebar
	$("#themeBar").slideToggle();
})

function makeTheme(themeArr) {
	//take an array of 6 colors to make a new theme
	$("#backgroundA").css("background-color", themeArr[0]);
	$("#backgroundC").css( "background-color", themeArr[1]);
	$(".bton").css("background-color", themeArr[2]);
	$("#buttons").css("background-color", themeArr[3]);
	$(".time").css("color", themeArr[4]);
	$("#themeBar").css("background-color", themeArr[5]);
	circleColor=themeArr[6];
	$("#circle-button").css("background-color", themeArr[6]);
	$("#inner-circle").css("background-color", themeArr[5]);
}

//current color themes
const pinkTheme = ["#F9DCFE","#FCF0F4","#DDE5FE","#B8C8FD","#7993FC","#FEFEFE","#D199D1"]
const redTheme = ["#EB6140","#DEDAF9","#EF97A2","#9D94FA","#EE8C7C","#EF9889","#EB6140"]
const yellowTheme = ["#FDFBB0", "#6E79DC", "#F2B173", "#9695FC", "#CFEEFE", "#6E79DC", "#F5C294"]


function defaultTheme(themeArr) {
	//sets which theme will be the default theme when the page opens
	makeTheme(themeArr);
}

//current default theme
defaultTheme(yellowTheme);

$("#circle-button").on('click', function() {
	//changes whether or not the circles drawn are 'filled' or 'stroked'
	if (circle == "fill") {
		radius=100;
		littleRadius = 30;
		lineWidth=5;
		littleLineWidth = 2;
		circle = "stroke";
		$("#inner-circle").animate({width: '44px', height: '44px', right: '4px'}, 'fast')
	}else{
		radius=50;
		littleRadius = 15;
		lineWidth=100;
		littleLineWidth = 30;
		circle="fill";
		$("#inner-circle").animate({width: '0px', height: '0px', right: '-18.5px'}, 'fast')
	}
	
})

//alternate theme colors
$("#theme1").on('click', function () {
	makeTheme(pinkTheme);
})

$("#theme2").on('click', function () {
	makeTheme(redTheme);
	$(".bton").css({"border-color": "#F2B2BA"});
})

$("#theme3").on('click', function () {
	makeTheme(yellowTheme);
})
});
