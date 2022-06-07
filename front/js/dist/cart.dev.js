"use strict";

//___________________Affichage des éléments sur la page panier_________________//
// Variable pour récupérer les données du local storage
var produitsEnregistres = JSON.parse(localStorage.getItem("produits"));
console.log(produitsEnregistres); // Variable pour récupérer les données de l'API

fetch("http://localhost:3000/api/products").then(function (data) {
  return data.json();
}).then(function (jsonListProducts) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = jsonListProducts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var products = _step.value;

      if (produitsEnregistres != null) {
        var _produitsEnregistres = [];
        document.getElementById('cart__items').innerHTML += "<article class=\"cart__item\" data-id=\"".concat(_produitsEnregistres._id, "\" data-color=\"").concat(_produitsEnregistres.choixCouleur, "\">\n            <div class=\"cart__item__img\">\n                <img src=\"").concat(products.imageUrl, "\" alt=\"").concat(products.altTxt, "\">\n            </div>\n            <div class=\"cart__item__content\">\n                <div class=\"cart__item__content__description\">\n                    <h2>").concat(products.name, "</h2>\n                    <p>").concat(products.choixCouleur, "</p>\n                    <p>").concat(products.price, "</p>\n                </div>\n                <div class=\"cart__item__content__settings\">\n                    <div class=\"cart__item__content__settings__quantity\">\n                        <p>Qt\xE9 :").concat(products.choixQuantite, " </p>\n                        <input type=\"number\" class=\"itemQuantity\" name=\"itemQuantity\" min=\"1\" max=\"100\" value=\"").concat(products.choixQuantite, "\">\n                    </div>\n                    <div class=\"cart__item__content__settings__delete\">\n                        <p class=\"deleteItem\">Supprimer</p>\n                    </div>\n                </div>\n            </div>\n        </article>");
      } else produitsEnregistres == null;
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

  {
    document.getElementById('cart__items').innerHTML += "<article class=\"cart__item\" data-id=\"{product-ID}\" data-color=\"{product-color}\">\n            <div class=\"cart__item__img\">\n                <img src=\"../images/logo.png\" alt=\"logo de Kanap\">\n            </div>\n            <div class=\"cart__item__content\">\n                <div class=\"cart__item__content__description\">\n                    <h2>Le panier est vide !</h2>\n                </div>\n            </div>\n        </article>";
    document.getElementById('totalQuantity').innerHTML += "0";
  }
}); // Si le panier est vide, on affiche un petit texte pour l'indiquer.
// Si le panier n'est pas vide, les éléments doivent s'afficher + les produits peuvent être ajoutés ou supprimés