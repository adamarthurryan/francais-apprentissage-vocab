//constants et genres des données

listes = [];

filtre = { liste: "all"};

////////////////////

$(document).ready(function() {

 $('#bouton-filtre-changes').click(function() {
   changesFiltre();
 });

 ouvresListe();

});


function ouvresListe() {
	lisDuboisBuyse(function(l) {
		listes=l;
		misVueAuCourant();
	});
}

function changesFiltre () {
	filtre["liste"] = $("#filtre-liste")[0].value;
	misVueAuCourant();
}

function misVueAuCourant() {
	$("#liste .col").html("");
	
	var filtreListeAll = filtre["liste"] == "all";
	var filtreListe = -1;
	if (!filtreListeAll)
		filtreListe = parseInt(filtre["liste"]);
	
	var num=0;
	
	var colString = ["", "", ""];
	

	for (i=0; i<listes.length; i++) {
		if (filtreListeAll || i==filtreListe) {
			for (j=0; j<listes[i].length; j++) {
				col = num % 3;
				num++;
				colString[col] = colString[col] + '<div class="entree"><div class="mot">'+listes[i][j].mot+'</div><div class="traduction"></div></div>';
			}
		}
	}

	for (i=0; i<3; i++)
		$("#liste .col"+(i+1)).html(colString[i]);
		
	$(".entree").click(function () {
		cliquesEntree(this);
	});
}

function cliquesEntree(e) {
	var mot = $(".mot", e).text();
	$(".traduction", e).toggle(false);
	
	lisTraduction(mot, function (trad) {
		$(".traduction", e).html(trad.aCourtHTML());
		$(".traduction", e).fadeTo('slow', 1);
	});
}

/////////////////

function rand(from, to){
       return Math.floor(Math.random() * (to - from) + from);
}

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
