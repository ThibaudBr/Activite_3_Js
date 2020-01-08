/* 
Activité 3
*/


//déclaration

//activation et désactivation du bouton "ajouter un lien"
var etatBouton = true;
var zoneBoutonElt = document.createElement("div");
var i = 0;


//initialisation de la page
recuperationLien();
afficherBouton();

function recuperationLien() {
//récupération des lien via l'api
    ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", function (reponse) {
        // Transforme la réponse en un tableau d'articles
        var listeLiens = JSON.parse(reponse);
        afficherListe(listeLiens);
    });
}
// mise en place du bouton
function afficherBouton( boutonElt){
    var boutonElt = document.createElement("button");
    zoneBoutonElt.innerHTML = "";
    zoneBoutonElt.id = "zoneForm";
    boutonElt.textContent = "Ajouter un Lien";
    zoneBoutonElt.appendChild(boutonElt);
    document.getElementById("contenu").before(zoneBoutonElt);
    boutonElt.addEventListener("click", function(){afficherForm(etatBouton); etatBouton = false;});
}

function afficherListe(listeLiens){
    var ulElt = document.createElement("ul"); // Création de la liste
    ulElt.id = "listeLiens";
    listeLiens.forEach(function (lien) {
        ulElt.appendChild(ajouterUnLien(lien));
    });
    document.getElementById("contenu").appendChild( ulElt); // Ajout de la liste à la page
}

    
function ajouterUnLien (lien){
    var liElt = document.createElement("li");
    liElt.className = "lien";

    //création du lien sur le titre
    var titreElt = document.createElement("h3");
    titreElt.id = "titre";
    titreElt.style.color = "#428bca";
    
    var lienElt = document.createElement("a");
    lienElt.textContent = lien.titre;
    lienElt.href = lien.url;
    lienElt.style.textDecoration = "none";

    var urlElt = document.createElement("p");
    urlElt.textContent = lien.url;

    var auteurElt = document.createElement("p");
    auteurElt.textContent = 'Ajouté par '+lien.auteur;
    titreElt.appendChild(lienElt);
    liElt.appendChild(titreElt);
    liElt.appendChild(urlElt);
    liElt.appendChild(auteurElt);
    return  liElt;
}
    

function ajouterLienListe(nTitre, nUrl, nAuteur){
    var regexUrl = new RegExp('http:\/\/');
    var regexUrls = new RegExp('https:\/\/');
    if (!regexUrl.test(nUrl) && !regexUrls.test(nUrl)){
        nUrl = "http:\/\/"+nUrl;
    }
    var lienTemp = {
        titre: nTitre,
        url: nUrl,
        auteur: nAuteur
    }
    console.log(lienTemp);

    document.querySelector("ul").appendChild(ajouterUnLien(lienTemp));
}

function afficherForm(pEtatbouton){
    if(pEtatbouton){
        var formElt = document.createElement("form");
        for(var i=0; i < 4; i++) {
            var labelElt = document.createElement("label");
            var inputElt = document.createElement("input");
            if (i===0){
                labelElt.textContent = "Inserer le titre";
                formElt.appendChild(labelElt);
                inputElt.type = "text";
                inputElt.id = "titre";
                inputElt.required = true;
                formElt.appendChild(inputElt);
            } else if(i === 1){
                labelElt.textContent = "Inserer l'url";
                formElt.appendChild(labelElt);
                inputElt.type = "text";
                inputElt.id = "url";
                inputElt.required = true;
                formElt.appendChild(inputElt);
            }else if(i === 2){
                labelElt.textContent = "Inserer l'auteur";
                formElt.appendChild(labelElt);
                inputElt.type = "text";
                inputElt.id = "auteur";
                inputElt.required = true;
                formElt.appendChild(inputElt);
            }else if(i === 3){
                inputElt.type = "submit";
                inputElt.value = "Envoyer";
                formElt.appendChild(inputElt);            
            }
        }
        document.getElementById("zoneForm").appendChild(formElt);

        formElt.addEventListener("submit", function(e){
            e.preventDefault();
            // Récupération des champs du formulaire dans l'objet FormData
            var data = {
                titre: formElt.elements.titre.value,
                url: formElt.elements.url.value,
                auteur: formElt.elements.auteur.value
            }
            var dataJson = JSON.stringify(data);
    
            var reussiteEnvoie = false;
            // Envoi des données du formulaire au serveur
             // La fonction callback est ici vide
            ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", dataJson, function () {
                reussiteEnvoie = true;
                zoneBoutonElt.innerHTML = "";
                zoneBoutonElt.appendChild(formElt);
                afficherMessageSucces();
                ajouterLienListe(formElt.elements.titre.value,formElt.elements.url.value,formElt.elements.auteur.value);
                setTimeout(function(){afficherBouton();},2000);
            });
            if (!reussiteEnvoie) {
                zoneBoutonElt.innerHTML = "";
                zoneBoutonElt.appendChild(formElt);
                afficherMessageLoose();
                setTimeout(function(){afficherBouton();},2000);
            }
            etatBouton = true;
        });
    }
}

function afficherMessageSucces(){
    var zoneMessage = document.getElementById("zoneForm");
    zoneMessage.textContent = "Le lien a été ajouter au serveur";
}
function afficherMessageLoose(){
    var zoneMessage = document.getElementById("zoneForm");
    zoneMessage.textContent = "Un problème est survenu lors de l'envoie du lien au serveur";
}