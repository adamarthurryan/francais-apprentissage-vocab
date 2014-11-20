//////////////////////////////////////////////////////
//utils du traduction

function Traduction(tradPaires, raw) {
	this.tradPaires = tradPaires;
	this.raw = raw;
	
	this.aHTML = function() {
		var string = "";
		
		string += "<div>";
		for (i in tradPaires) {
			string += tradPaires[i].aHTML() + "\n";
		}
		string += "</div>";
		
		return string;
	}
	
	this.aCourtHTML = function() {
		var string = "";
		
		string += "<div>";
		for (i in tradPaires) {
			string += "<div>" + tradPaires[i].trad.aHTML() + "</div>\n";
		}
		string += "</div>";
		
		return string;
	}
	
}

function TraductionPaire(origTerme, tradTerme) {
	this.orig = origTerme;
	this.trad = tradTerme
	
	this.aHTML = function() {
		return "<div>" + this.orig.aHTML() + "<span>: </span>" + this.trad.aHTML() +"</div>"; 
	}
}
function TraductionTerme(mot, sens) {
	this.mot = mot;
	this.sens = sens;
	
	this.aHTML = function () {
		return "<span>" + this.mot + (this.sens != "" ? " ("+this.sens+")" : "") + "</span>";	
	};
}



//utilizes le wordreference API pour trover une traduction du mot
function lisTraduction(mot, callback) {
//ce function doit operer par callback et le Traduction objet - pas par html modification direct

	$.get("ba-simple-proxy-wordreference.php?url=http://api.wordreference.com/0.8/4026a/json/fren/"+escape(mot),
		function(jsonTrad) {
	
		//console.log("------------------------");
		//console.log(jsonTrad);

		var tradPrin = jsonTrad.contents.term0.Entries;

		if (tradPrin==undefined)
				var tradPrin = jsonTrad.contents.term0.PrincipalTranslations;
				
		var paires = [];

		for (var i in tradPrin) {
			var ot = tradPrin[i]["OriginalTerm"];
			var ft = tradPrin[i]["FirstTranslation"];
		
			var oTerme = new TraductionTerme(ot['term'], ot['sense']);
			var tTerme = new TraductionTerme(ft['term'], ft['sense']);
			var paire = new TraductionPaire(oTerme, tTerme);
			paires.push(paire);
		}

		callback(new Traduction(paires, jsonTrad));
	});
}