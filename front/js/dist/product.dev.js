"use strict";

//_____________________________Gestion de l'affichage du produit______________________________//
// Récupération de l'url avec la méthode SearchParams
var queryString_url_id = window.location.search; //console.log(queryString_url_id);    

var urlSearchParams = new URLSearchParams(queryString_url_id); //console.log(urlSearchParams);
// Extraction de l'Id

var produitId = urlSearchParams.get("id"); // console.log(produitId);
// déclaration d'une constante et d'une fonction pour optimiser le code lors de l'insertion du html

var elementSelect = document.querySelector("select");

function insertionTxt(element, content) {
  document.getElementById(element).innerHTML += content;
}
/** récupération des informations relatives à chaque produit grâce à fetch 
 * puis insertion de la réponse dans le HTML */


fetch("http://localhost:3000/api/products/".concat(produitId)).then(function (requete) {
  return requete.json();
}).then(function (reponse) {
  document.querySelector(".item__img").innerHTML += "<img src=\"".concat(reponse.imageUrl, "\" alt=\"").concat(reponse.altTxt, "\">"); // utilisation de la function insertionTxt

  insertionTxt("title", reponse.name);
  insertionTxt("price", reponse.price);
  insertionTxt("description", reponse.description); // boucle pour l'affichage des options de couleurs

  for (var _i = 0, option = reponse.colors.length; _i < option; _i++) {
    elementSelect.innerHTML += "<option value=\"".concat(reponse.colors[_i], "\">").concat(reponse.colors[_i], "</option>");
  }
}); //________________Gestion de la sélection et du stockage des options du produit_______________//
// ___Enregistrement des données sélectionnées lors du click sur "Ajouter au panier".___//

/* 1) Sélection du bouton "Ajouter au panier".
** 2) Ecouter le bouton et vérifier que les données sont sélectionnées et visibles dans la console lors du click.
** 3) Sélection des éléments contenant les choix de couleur et de quantité.
** 4) Sélection des données et enregistrement dans la console.
*/

var boutonPanier = document.getElementById("addToCart");
boutonPanier.addEventListener("click", function (event) {
  event.preventDefault();
  var optionColors = document.querySelector("select");
  var choixCouleur = optionColors.value;
  var quantite = document.getElementById("quantity");
  var choixQuantite = quantite.value;
  console.log("".concat(choixQuantite, "  avec la couleur : ").concat(choixCouleur)); // Déclaration d'un variable pour afficher les détails des produits dans un tableau

  var detailsProduit = {
    id: produitId,
    couleur: choixCouleur,
    quantite: choixQuantite
  }; //Déclaration d'un variable pour sauvegarder les produits dans le local storage avec pour clé "Kanap"

  var produitSaved = JSON.parse(localStorage.getItem("kanap")); //s'il n'y a pas de kanap enregistré dans le localstorage

  if (produitSaved == null) {
    produitSaved = [];
    produitSaved.push(detailsProduit);
    localStorage.setItem("kanap", JSON.stringify(produitSaved));
  } //autrement si il y a déjà des kanap enregistrés
  else if (produitSaved != null) {
      for (i = 0; i < produitSaved.length; i++) {
        if ( // si l'id et la couleur correspond à un kanap déjà enregistré dans le localstorage
        produitSaved[i].id == produitId && produitSaved[i].couleur == choixCouleur) {
          return (// retourner un kanap qui a une quantité mise à jour
            produitSaved[i].quantite++, localStorage.setItem("kanap", JSON.stringify(produitSaved)), produitSaved = JSON.parse(localStorage.getItem("kanap"))
          );
        }
      }

      for (i = 0; i < produitSaved.length;) {
        if ( //si le produit sélectionné a le même id Et n'a pas la même couleur OU si l'id n'est pas le même
        produitSaved[i].id == produitId && produitSaved[i].couleur != choixCouleur || produitSaved[i].id != produitId) {
          return (// pusher le nouveau kanap dans le local storage et le récupérer dans le panier
            produitSaved.push(detailsProduit), localStorage.setItem("kanap", JSON.stringify(produitSaved)), produitSaved = JSON.parse(localStorage.getItem("kanap"))
          );
        }
      }
    }

  return produitSaved = JSON.parse(localStorage.getItem("kanap"));
});