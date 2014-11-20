//constants et genres des données

listes = [];

filtre = { liste: "1"};

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
	
	var i;
	var j;
	for (i=0; i<listes.length; i++) {
		if (filtreListeAll || i==filtreListe) {
			for (j=0; j<listes[i].length; j++) {
				if (estNom(listes[i][j])) {
					var col = num % 3;
					num++;
					
					var article = obtiensArticle(listes[i][j]);
					var genreString = obtiensGenreString(obtiensGenre(listes[i][j]))
					
					colString[col] +=
						'<div class="entree">'
						+ '<span class="article">' + article + ' </span>'
						+ '<span class="mot">' + listes[i][j].mot + '</span>';
						
					if (genreAmbigue(article)) 
						colString[col] +=
							'<span class="genre"> ' + genreString + '</span>';
					
					colString[col] +=
						"</div>";			

					
				}
			}
		}
	}
	
	for (i=0; i<3; i++)
		$("#liste .col"+(i+1)).html(colString[i]);

	$("#liste .article").toggle(false);
	$("#liste .genre").toggle(false);
	$("#liste .entree").click(function() {
		cliquesEntree(this);
	});
}

function cliquesEntree(jqEntree) {
	$('.article, .genre', jqEntree).fadeTo('slow', 1);
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
