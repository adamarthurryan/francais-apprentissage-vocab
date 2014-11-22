m = 0;
f = 1;

genres = [m,f];

s = 1;
pl = 2;

nombres = [s, pl];

function Nom (mot, genre, nombre) {
	//Par défault, le mot est singulier.
	nombre = typeof(nombre) != 'undefined' ? nombre : s;

	this.mot = mot;
	this.genre = genre;
	this.nombre = nombre;
}

noms = [];

voyelles = [
	"a",	"e",	"i",	"o",	"u",
	"à",	"è",	"é",	"ù",
	"ä",	"ë",	"ï",	"ö",	"ü",
	"â",	"ê",	"î",	"ô",	"û"
];

nomActuel = null;

mots = null;

filtre = { niveau: "all"};

////////////////////

$(document).ready(function() {


 $('#bouton-prochain').click(function() {
   prochainQuestion();
 });
 $('#bouton-reponse').click(function() {
   montresReponse();
 });
 $('#bouton-traduction').click(function() {
   montresTraduction();
 });
 $('#bouton-filtre-changes').click(function() {
   changesFiltre();
   misFiltreAuCourant();
   prochainQuestion()
 });

 ouvresListe();

});



function ouvresListe() {
	$.get("dubois buyse.xml", {}, function(xml) {
		
		noms = [];
		
		var items = $("item", xml);
		mots = $('item[function^="nom"]', xml);
		
		misFiltreAuCourant();
		
		
		prochainQuestion()
	});
}

function changesFiltre () {
	filtre["niveau"] = $("#filtre-niveau")[0].value;
}

function misFiltreAuCourant() {
	noms = [];
	
	var filtreNiveauAll = filtre["niveau"] == "all";
	var filtreNiveau = -1;
	if (!filtreNiveauAll)
		filtreNiveau = parseInt(filtre["niveau"]);
	
	mots.each(function () {
		var mot = $(this).attr("mot");
		var niveau = $(this).attr("niveau");
		var motFunct = $(this).attr("function");
		
		//On suppose que le mot est vraiment un nom et que c'est soit masculin ou féminin.
		//On suppose aussi que c'est singular.
		var genre = (motFunct.indexOf("masculin") != -1) ? m : f;
			
		//Adjuter le nom à la liste, si le filtre soit satisfé
		if (filtreNiveauAll==true || niveau == filtreNiveau)
			noms.push(new Nom(mot, genre, s));
	});
}

//utilizes le wordreference API pour trover une traduction du mot
function lisTraduction(mot) {
	$("#traduction .inner").html("");

	$.get("externals/php-simple-proxy/ba-simple-proxy.php?url=http://api.wordreference.com/0.8/"+WR_API_KEY+"/json/fren/"+escape(mot),  function(jsonTrad) {
	
		//console.log("------------------------");
		console.log(jsonTrad);

		var tradPrin = jsonTrad.contents.term0.Entries;

		if (tradPrin==undefined)
				var tradPrin = jsonTrad.contents.term0.PrincipalTranslations;

		var string = "";
		for (var i in tradPrin) {
			var ot = tradPrin[i]["OriginalTerm"];
			var ft = tradPrin[i]["FirstTranslation"];

			string += "<div>";
			//string += ot['term'] + (ot['sense'] != "" ? " ("+ot['sense']+")" : "");
			//string += ": ";
			string += ft['term'] + (ft['sense'] != "" ? " ("+ft['sense']+")" : "");
			string += "</div>\n";
		}
		
		$("#traduction .inner").html(string);
		$("#traduction").fadeTo('slow', 1);
	});

}

///////////////////

//montre le prochain question
function prochainQuestion() {
	//choisit un nom
	var nom = noms[rand(0,noms.length)];
	var article = obtiensArticle(nom);

	//lis la traduction pour ce nouveau mot
	//lisTraduction(nom);
	
	nomActuel = nom;
	
	
	//cache l'article, la definition et la genre
	$("#question .article").toggle(false);
	$("#question .genre").toggle(false);
	$("#traduction").toggle(false);

	//mis le mot, genre et article strings
	$("#question .mot").text(nom.mot);
	$("#question .genre").text(genreAmbigue(article) ? obtiensGenreString(nom) : "");
	$("#question .article").text(article);
}

//montre la bonne reponse au question
function montresReponse() {
	$("#question .article").fadeTo('slow', 1);
	$("#question .genre").fadeTo('slow', 1);
}

//montre la definition du mot
function montresTraduction() {
	//lis la traduction pour ce nouveau mot
	lisTraduction(nomActuel.mot);


}

//est-ce que le genre est ambigu, cette article soit donnée?
function genreAmbigue(article) {
	if (article == "l'" || article == "les" || article == "des")
		return true;
}

//obtiens un article pour ce nom
function obtiensArticle(nom) {
	var voyelle = commenceAvecVoyelle(nom.mot);
	
	if (nom.nombre == pl)
		return "les";
	else if (voyelle)
		return "l'";
	else if (nom.genre == f)
		return "la";
	else
		return "le";
}

//obtiens un string qui montre le genre pour ce nom
function obtiensGenreString(nom) {
	return nom.genre == m ? "(masc)" : "(fem)";
}

//est-ce que ce nom commence avec une voyelle?
function commenceAvecVoyelle(nom) {
	var premiereLettre = nom.toLowerCase().charAt(0);
	for (i=0; i<voyelles.length; i++) {
		if (premiereLettre == voyelles[i].charAt(0))
			return true;
	}
	
	return false;
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
