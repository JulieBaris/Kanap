"use strict";

//_______________Gestion de l'affichage des produits sur la page d'accueil________________//
var section = document.getElementById("items");
/** Gestion de l'affichage des fiches produits et des interactions :
 * 1) Requête permettant de récupérer les informations relatives aux produits via l'api grâce à fetch ;
 * 2) Insertion des éléments <a>, <article>, ... dans le DOM grâce à innerHTML ;
 * 3) Insertion des caractéristiques des produits grâce à ${products.__}
 * 4) Gestion de l'élément <a> et de son attribut href grâce à l'ajout de ?id=${products._id}&name=${products.name} dans l'url.
 **/

fetch("http://localhost:3000/api/products").then(function (reponse) {
  return reponse.json();
}).then(function (jsonListProducts) {
  console.log(jsonListProducts);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = jsonListProducts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var product = _step.value;
      section.innerHTML += "<a href=\"".concat("product.html?id=".concat(product._id, "&name=").concat(product.name), "\">\n         <article>\n         <img src=\"", product.imageUrl, "\" alt=\"").concat(product.altTxt, "\">\n         <h3 class=\"productName\">").concat(product.name, "</h3>\n         <p class=\"productDescription\">").concat(product.description, "</p>\n         </article>\n         </a>");
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
});
/** Récupération des résultats via l'identifiant du produit 
 * --> retourne les caractéristiques de chaque produit dans la console
 * fetch("http://localhost:3000/api/products/107fb5b75607497b96722bda5b504926") //requête : produit 0
 * fetch("http://localhost:3000/api/products/415b7cacb65d43b2b5c1ff70f3393ad1") //requête : produit 1
 * fetch("http://localhost:3000/api/products/055743915a544fde83cfdfc904935ee7") //requête : produit 2
 * fetch("http://localhost:3000/api/products/a557292fe5814ea2b15c6ef4bd73ed83") //requête : produit 3
 * fetch("http://localhost:3000/api/products/8906dfda133f4c20a9d0e34f18adcf06") //requête : produit 4
 * fetch("http://localhost:3000/api/products/77711f0e466b4ddf953f677d30b0efc9") //requête : produit 5
 * fetch("http://localhost:3000/api/products/034707184e8e4eefb46400b5a3774b5f") //requête : produit 6
 * fetch("http://localhost:3000/api/products/a6ec5b49bd164d7fbe10f37b6363f9fb") //requête : produit 7
    .then(function(res) 
    {
        if (res.ok) 
        {
        return res.json();
        }
    })
    .catch(function(_err) 
    {
        console.log("une erreur est survenue !")
    });
**/