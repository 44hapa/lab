
var activePerson = "man_0";
var countPerson = 2;
var haveGoldPersonId;
var dragonSteps;
var showNumber = false;

var CountSquare = 20;
var SmalSide = 50;
var SmalBorder = 2;
var BigSize = CountSquare*SmalSide + CountSquare * SmalBorder;

function start(){
	$("div#world").css("width", BigSize + "px");
	$("div#world").css("height", BigSize + "px");
	var squareNumber = "";
	for (var i = 0; i <= CountSquare - 1; i++) {
		for (var j = 0; j <= CountSquare - 1; j++) {
			smallClass = "woll2";
			IdSmalSquare = i +"_" + j;
			if (showNumber == true) {
				squareNumber = IdSmalSquare; 
			}
			$("div#world").append("<div id='"+IdSmalSquare+"' style='width:"+SmalSide+"px; height:"+SmalSide+"px;'>"+squareNumber+"</div>")
			$("div#"+IdSmalSquare).click(function(){
				movePerson(this.id);
			});
			
			if ((i != 0 && j != CountSquare - 1) && (i != CountSquare - 1 && j != 0) ) {
				smallClass = "road";
			} else {
				outerWoll.push(IdSmalSquare);
			}
			$("div#"+IdSmalSquare).addClass(smallClass);

		};
	};
}

function colorize(position, color){
	for (var i = position.length - 1; i >= 0; i--) {
		$("#"+position[i]).removeClass().addClass(color);
	}
}

function movePerson(squareId) {
	tooFar = isTooFar(squareId);
	if (tooFar == true) {
		return false;
	}
	result = move(squareId);
	dragonMove();
	selectNextMan(activePerson);
	return result;
}

function sendMessage(message) {
	$("#textComment").html(message);
	$("#comment").show().hide(2000);
	return;
}

function isTooFar(squareId) {
	var nextCoordinat = $("#"+squareId).offset();
	var currentCoordinat = $("#"+activePerson).offset();

	stepTop = Math.max(nextCoordinat.top, currentCoordinat.top) - Math.min(nextCoordinat.top, currentCoordinat.top);
	stepLeft = Math.max(nextCoordinat.left, currentCoordinat.left) - Math.min(nextCoordinat.left, currentCoordinat.left);

	if (stepTop / SmalSide >= 2 || stepLeft / SmalSide >= 2 || (stepTop / SmalSide > 0 && stepLeft / SmalSide > 0)) {
		sendMessage("Слишком далеко!");
		return true;
	}

	return false;
}

function move(squareId) {
	var nextCoordinat = $("#"+squareId).offset();
	var currentCoordinat = $("#"+activePerson).offset();

	if ($.inArray(squareId, woll) > -1) {
		sendMessage("Стена!");
		return false;
	}

	if ($.inArray(squareId, dor) > -1) {
		if (haveGoldPersonId == activePerson) {
			alert("ПОБЕДА!!!")
			return true;	
		}
		sendMessage("Выход из лабиринта!");
		return false;
	}
	if ($.inArray(squareId, outerWoll) > -1) {
		sendMessage("Внешняя стена!");
		return false;
	}

	$("#"+activePerson).css("top", nextCoordinat.top);
	$("#"+activePerson).css("left", nextCoordinat.left);

	//Вступили в реку
	if ($.inArray(squareId, river) > -1) {
		var countSwim = 2;
		var nextSwemCoordinat;
		for (var i = 0; i < river.length && countSwim > 0; i++) {
			nextSwemCoordinat = $("#"+river[i]).offset();
			swemTop = (nextSwemCoordinat.top - nextCoordinat.top) / SmalSide;
			swemLeft = (nextSwemCoordinat.left - nextCoordinat.left) / SmalSide;
			if (swemTop < 2 && swemTop != 1 && swemTop > 0) {
				$("#"+activePerson).css("top", nextSwemCoordinat.top);
				nextCoordinat.top = nextSwemCoordinat.top;
				countSwim--;
				continue;
			}
			if (swemLeft < 2 && swemLeft != 1 && swemLeft > 0) {
				$("#"+activePerson).css("left", nextSwemCoordinat.left);
				nextCoordinat.left = nextSwemCoordinat.left;
				countSwim--;
				continue;
			} 
		}
	}

	return true;
}

function selectNextMan(currentManId){
	splitCurrentManId = currentManId.split("_");
	var nextPerson;
	if (splitCurrentManId[1] >= countPerson -1) {
		nextPerson = "man_0";
	} else {
		nextPerson =  "man_" + (splitCurrentManId[1]*1 + 1);
	}

	$("#"+activePerson).css("opacity", "0.5");
	activePerson = nextPerson;
	$("#"+activePerson).css("opacity", "1");
}

function determineСountPerson(){
  $("#playersCount").change(function(){
	countPerson=$(this).val();
    $("#slidernumber").text("Будет играть " + countPerson + " чел.");
  });
}


function getClearSector() {
	while (true) {
		sector = Math.floor(Math.random() * (CountSquare + 1)) + "_" + Math.floor(Math.random() * (CountSquare + 1));
		if ($("#"+sector).hasClass("road")) {
			break;
		}
	}

	return sector;
}

function createMeans() {
	//создать персонажей  заполнив массив
	$("#playersCountSubmit").click(function(){
		for (var i =0; i < countPerson; i++) {
			mans[i] = getClearSector();
			$("div#stats").after("<div class='mans' id='man_"+i+"' width="+SmalSide+"px height="+SmalSide+"px></div>");
			$("#man_"+i).css("background-image", "img/fea2.png)");

			startCoordinat = $("#"+mans[i]).offset();
			$("#man_"+i).css("top", startCoordinat.top);
			$("#man_"+i).css("left", startCoordinat.left);

			$("#man_"+i).click(function(){
				currentCoordinat = $("#"+this.id).offset();
				currentSector = getSquareByCoordinat(currentCoordinat.top, currentCoordinat.left); 
				result = movePerson(currentSector);
				if (result == true) {
					// alert("Встреча!")
					// $("#medic").css("top", 0);
					// $("#medic").removeAttr("style").css("right", 0).css("top", 0);
				}
			});

			$("#man_"+i).mouseover(function(){
				manId = (this.id).split("_"); 
				// manNumber = $(this).data("param"); 
				$("#" + this.id).html(manId[1] * 1 + 1);
			});
			$("#man_"+i).mouseout(function(){
				$("#" + this.id).html("");
			});
		}
		$("#"+activePerson).css("opacity", "1");
		$("#stats").hide();
	});
}

function createStuff() {
	var medicSector = getClearSector();
	$("#"+medicSector).removeClass("road").addClass("road2");

	$("div#stats").after("<div class='medic' id='medic' width="+SmalSide+"px height="+SmalSide+"px></div>");
	$("#medic").css("background-image", "img/medic.png)");	
	startCoordinat = $("#" + medicSector).offset();
	$("#medic").css("top", startCoordinat.top);
	$("#medic").css("left", startCoordinat.left);

	$("#medic").click(function(){
		result = movePerson(medicSector);
		if (result == true) {
			alert("Вылечился!")
			// $("#medic").css("top", 0);
			// $("#medic").removeAttr("style").css("right", 0).css("top", 0);
		}
	});


	var goldSector = getClearSector();
	$("#"+goldSector).removeClass("road").addClass("road3");

	$("div#stats").after("<div class='gold' id='gold' width="+SmalSide+"px height="+SmalSide+"px></div>");
	$("#gold").css("background-image", "img/gold1.png)");	
	startCoordinat = $("#" + goldSector).offset();
	$("#gold").css("top", startCoordinat.top);
	$("#gold").css("left", startCoordinat.left);

	$("#gold").click(function(){
		result = movePerson(goldSector);
		if (result == true) {
			$("#gold").css("top", 0);
			$("#gold").removeAttr("style").css("right", 0).css("top", 0);
			haveGoldPersonId = activePerson;
		}
	});
}

function createDoar() {
	while (true) {
		wollArrayId = Math.floor(Math.random() * (outerWoll.length + 1));
		wolCoordinat = outerWoll[wollArrayId];

		//Нужно узнать, есть ли проход к двери
		dorCoordinat = wolCoordinat.split("_");

		if ((dorCoordinat[0] * 1 == 0) &&  $("#" + (dorCoordinat[0]*1 + 1) + "_" + dorCoordinat[1]).hasClass("road")) {
			break;
		}
		if ((dorCoordinat[0] * 1 == CountSquare - 1) &&  $("#" + (dorCoordinat[0]*1 - 1) + "_" + dorCoordinat[1]).hasClass("road")) {
			break;
		}

		if ((dorCoordinat[1] * 1 == 0) &&  $("#" + dorCoordinat[0] + "_" + (dorCoordinat[1]* 1 + 1)).hasClass("road")) {
			break;
		}
		if ((dorCoordinat[1] * 1 == CountSquare - 1) &&  $("#" + dorCoordinat[0] + "_" + (dorCoordinat[1]* 1 - 1)).hasClass("road")) {
			break;
		}

	}
	dor[0] = wolCoordinat;
	$("#"+wolCoordinat).removeClass("woll2").addClass("dor");

}

function createDragon() {
	var dragonSector = getClearSector();
	$("#"+dragonSector).removeClass("road").addClass("road2");

	$("div#stats").after("<div class='dragon' id='dragon' width="+SmalSide+"px height="+SmalSide+"px></div>");
	$("#dragon").css("background-image", "img/dragon2.png)");	
	startCoordinat = $("#" + dragonSector).offset();
	$("#dragon").css("top", startCoordinat.top);
	$("#dragon").css("left", startCoordinat.left);

	$("#dragon").click(function(){
		result = movePerson(dragonSector);
		if (result == true) {
			alert("Тебя укусил ДРАКОН!")
		}
	});
	dragon[0] = dragonSector;
}

function dragonMove() {
	var currentCoordinat = dragon[0].split("_");
	var nextSquare;

	cuurentMan = activePerson;
	activePerson = "dragon";

	var cources = [
		"top",
		"bottom",
		"left",
		"right"
	];
	while (true) {
		cource = Math.floor(Math.random() * 4);

		if (cources[cource] == "top") {
			nextSquare = (currentCoordinat[0] * 1 - 1) + "_" + currentCoordinat[1];
		}
		if (cources[cource] == "bottom") {
			nextSquare = (currentCoordinat[0] * 1 + 1) + "_" + currentCoordinat[1];
		}
		if (cources[cource] == "left") {
			nextSquare = currentCoordinat[0] + "_" + (currentCoordinat[1] * 1 - 1);
		}
		if (cources[cource] == "right") {
			nextSquare = currentCoordinat[0] + "_" + (currentCoordinat[1] * 1 + 1);
		}

		console.log(nextSquare);

	// $("#dragon").css("top", $("#" + nextSquare).top);
	// $("#dragon").css("left", $("#" + nextSquare).left);

		result = move(nextSquare);
		if (result == true){
			dragonCoordinat = $("#dragon").offset();
			dragon[0] = getSquareByCoordinat(dragonCoordinat.top, dragonCoordinat.left);
			break;
		}
	}
	activePerson = cuurentMan;
	return;
}

function getSquareByCoordinat(topCoordinat, leftCoordinat) {
	startCoordinat = $("#0_0").offset();
	topCoordinat = topCoordinat - startCoordinat.top;
	leftCoordinat = leftCoordinat - startCoordinat.left;
	topId = topCoordinat / (SmalSide + SmalBorder);
	leftId = leftCoordinat / (SmalSide + SmalBorder);

	return topId + "_" + leftId;
}