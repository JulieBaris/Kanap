//________________________________________PAGE PRODUCTS______________________________________//

//ETAPE 1 : récupérer l'id du produit pour l'intégrer à l'URL et gérer l'affichage des informations qui y sont relatives.

// Récupération de l'url et paramètrage avec UrlSearchParams
const recuperationUrl = window.location.search
const urlSearchParams = new URLSearchParams(recuperationUrl)
// Extraction de l'Id
const produitId = urlSearchParams.get("id")

/** Grâce à fetch et à l'intégration de l'id du produit dans l'url, on récupère les informations du produit
* puis on insère la réponse dans le HTML */

fetch(`http://localhost:3000/api/products/${produitId}`)
    .then(response => response.json())
    .then(product => {
        document.querySelector(".item__img").innerHTML =
            `<img src="${product.imageUrl}" alt="${product.altTxt}">`
        // utilisation de la function insertionTxt (l83)
        insertionTxt("title", product.name)
        insertionTxt("price", product.price)
        insertionTxt("description", product.description)

        // création d'une boucle pour que chaque option de couleur soit affichée
        let option = product.colors
        for (let i = 0; i < option.length; i++) {
            insertionTxt("colors", `<option value="${option[i]}">${option[i]}</option>`)
        }
    });

//Etape 2 : le produit sélectionné doit être enregistré dans le localStorage lors du click sur "Ajouter au panier"//

// Ecoute des événements lors du click grâce à la sélection du bouton et à addEventListener
document.getElementById("addToCart").addEventListener("click", (event) => {
    // suppression des paramètres par défaut      
    event.preventDefault()

    //Sélection des quantités et des couleurs choisies en utilisant la function "selectValue" (l90)
    const { choixCouleur, choixQuantite } = selectValue()

    // Déclaration d'un objet qui contient les informations utiles sur le produit sélectionné
    let product = { id: produitId, couleur: choixCouleur, quantite: choixQuantite }

    //Si le localStorage est vide (pas de produit, pas de keyProducts) et que la quantité choisie par l'utilisateur est inférieure ou égale à 100
    if (stockProducts == null && product.quantite > 0 && product.quantite <= 100 && product.couleur != 0) {
        //stockProducts est un tableau vide dans lequel on push les informations du produit 
        stockProducts = []
        stockProducts.push(product)
        alert(`${product.quantite} Kanap ${product.id} ${product.couleur} ont été enregistrés dans le panier`)
        //puis on enregistre les produits dans le localStorage
        localStorage.setItem("keyProducts", JSON.stringify(stockProducts))
    }
    // // //Autrement si le localStorage n'est pas vide et qu'il y des produits enregistrés
    else if (stockProducts != null && product.quantite > 0 && product.quantite <= 100 && product.couleur != 0) {
        // les boucles for permettent de répéter les étapes jusqu'à ce que le localStorage soit définitivement mis à jour
        for (let j = 0; j < stockProducts.length; j++) {

            if (quantityAdded(j, product) > 0 && quantityAdded(j, product) <= 100 && stockProducts[j].id == product.id && stockProducts[j].couleur == product.couleur)
            // si le produit sélectionné a une quantité supérieure à 0 et inférieure ou égale à 100 ET qu'il a une couleur définie ET que l'id et la couleur correspondent à un produit déjà enregistré dans le localstorage
            // retourner un localStorage dont la quantité de produit est mise à jour
            {
                return (
                    stockProducts[j].quantite = quantityAdded(j, product),
                    localStorage.setItem("keyProducts", JSON.stringify(stockProducts)),
                    alert(`Dans le panier, il y a ${stockProducts[j].quantite} Kanap ${product.id} ${product.couleur} actuellement enregistré(s).`)
                )
            }
            else if (quantityAdded(j, product) == 0 && quantityAdded(j, product) > 100 && stockProducts[j].id == product.id && stockProducts[j].couleur == product.couleur) {
                alert(`Dans le panier, il y a ${stockProducts[j].quantite} Kanap ${product.id} ${product.couleur} enregistré(s) or la quantité maximum est limitée à 100. Vous pouvez en ajouter ${100 - stockProducts[j].quantite} au panier.`)
                return false
            }
        }
        for (let k = 0; k < stockProducts.length; k++) {

            if ( parseInt(product.quantite) > 0 && parseInt(product.quantite) <= 100 && stockProducts[k].id == product.id && stockProducts[k].couleur != product.couleur || stockProducts[k].id != product.id)
            //si le produit sélectionné a le même id Et n'a pas la même couleur OU si l'id n'est pas le même
            // pusher le nouveau produit dans le tableau et l'envoyer dans le localStorage
            {
                return (
                    stockProducts.push(product),
                    alert(`Dans le panier, il y a ${parseInt(product.quantite)} Kanap ${product.id} ${product.couleur} actuellement enregistré(s).`),
                    localStorage.setItem("keyProducts", JSON.stringify(stockProducts))
                )
            }
            else if (quantityAdded(k, product) = 0 && quantityAdded(k, product) > 100 && stockProducts[k].id == product.id && stockProducts[k].couleur != product.couleur || stockProducts[k].id != product.id) {
                alert(`Dans le panier, il y a ${stockProducts[j].quantite} Kanap ${product.id} ${product.couleur} enregistré(s) or la quantité maximum est limitée à 100. Vous pouvez en ajouter ${100 - stockProducts[j].quantite} au panier.`)
                return false
            }
        }
    }
})
//----------------------------------------------Utils------------------------------------------------//
// function "insertionTxt" pour optimiser le code lors de l'insertion du html
function insertionTxt(element, content) {
    document.getElementById(element).innerHTML += content
}
//Déclaration d'un variable pour obtenir les informations des produits enregistrés dans le localStorage
let stockProducts = JSON.parse(localStorage.getItem("keyProducts"))
// Function "selectValue" permet d'obtenir les valeurs de la couleur et de la quantité sélectionnées par l'utilisateur
function selectValue() {
    const choixCouleur = document.querySelector("select").value
    if (choixCouleur == 0) document.querySelector("select").value = alert('une couleur doit être choisie')
    let choixQuantite = parseInt(document.getElementById("quantity").value)
    if (choixQuantite < 1) document.getElementById("quantity").value = 0, alert("la quantité doit être définie")
    if (choixQuantite > 100) document.getElementById("quantity").value = 100, alert("la quantité de produit sélectionnée doit être égale ou inférieure à 100")
    return { choixCouleur, choixQuantite }
}
// Function "quantityAdded" est utilisée à plusieurs reprises pour alléger le code
function quantityAdded(let, product) {
    return parseInt(stockProducts[let].quantite) + parseInt(product.quantite)
}
//----------------------------------------------Utils------------------------------------------------//