
m = 0;
f = 1;
genres = [m,f];
/////////////////////////////////////
//constants et genres des données


s = 1;
pl = 2;
nombres = [s, pl];

voyelles = [
	"a",	"e",	"i",	"o",	"u",
	"à",	"è",	"é",	"ù",
	"ä",	"ë",	"ï",	"ö",	"ü",
	"â",	"ê",	"î",	"ô",	"û"
];


function Mot (mot, niveau, funct) {
	this.mot = mot;
	this.niveau = niveau;
	this.funct = funct;
}


/////////////////////////////////////////
//utils des mots et la langue en général

//est-ce que le genre est ambigu, cette article soit donnée?
function genreAmbigue(article) {
	if (article == "l'" || article == "les" || article == "des")
		return true;
}

//obtiens un article pour ce nom
function obtiensArticle(mot) {
	var voyelle = commenceAvecVoyelle(mot);
	var genre = obtiensGenre(mot);
	var nombre = obtiensNombre(mot);
	
	console.log(genre);
	
	if (nombre == pl)
		return "les";
	else if (voyelle)
		return "l'";
	else if (genre == f)
		return "la";
	else
		return "le";
}

//obtiens un string qui montre le genre pour ce nom
function obtiensGenreString(genre) {
	return genre == m ? "(m)" : "(f)";
}

//est-ce que ce nom commence avec une voyelle?
function commenceAvecVoyelle(mot) {
	var premiereLettre = mot.mot.toLowerCase().charAt(0);
	for (i=0; i<voyelles.length; i++) {
		if (premiereLettre == voyelles[i].charAt(0))
			return true;
	}
	
	return false;
}

//retourns le gendre de ce nom
//jetes un exception si le mot ne soit pas un nom
function obtiensGenre(mot) {
	if (!estNom(mot))
		throw "Ne peut pas obtenir un genre sauf pour les noms";
		
	return (mot.funct.indexOf("masculin") != -1) ? m : f;
}

//ce n'est pas établi - retourns toujours singulaire
function obtiensNombre(mot) {
	return s;
}

//retournes vrai si le mot est un nom
function estNom(mot) {
	return mot.funct.indexOf("nom ")==0;
}



/////////////////////////////////////////////
//utils de liste des mots

var tailleDesListes = 30;

//ouvres et lis le dubois buyse liste des mots
function lisDuboisBuyse(callback) {
	$.get("dubois buyse.xml", {}, function(xml) {
		
		var listes = [];
		var mots = [];
		var items = $("item", xml);
		
		items.each(function () {
			var mot = $(this).attr("mot");
			var ordre = parseInt($(this).attr("ordre"));
			var motFunct = $(this).attr("function");

			var listeNum = Math.floor(ordre / tailleDesListes);
			
			
			if (listes[listeNum] == null)
				listes[listeNum] = [];		
			
			listes[listeNum].push(new Mot(mot, listeNum, motFunct));
		});
		
		callback(listes);
	});
}
