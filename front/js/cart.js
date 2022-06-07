//______________________________________GESTION DE LA PAGE PANIER__________________________________________//

//------------------------------------UTILS : function, const, let-----------------------------------//
// les fonctions, variables et constantes utilisées à plusieurs reprises sont déclarées ici :

//-------------------Utils pour différentes étapes-----------------//
// Variable pour récupérer les données des produits enregistrés dans le local local storage
let stockProducts = JSON.parse(localStorage.getItem("keyProducts"));
// Function pour envoyer les données au localStorage
function setPanier(key, content) {
    localStorage.setItem(key, JSON.stringify(content))
};
// Function pour effacer les données devenues inutiles du localStorage
function supprimeKeys(key) {
    localStorage.removeItem(key)
};
// Function pour insérer du texte qui ne change pas
function insertionTxt(element, content) {
    document.getElementById(element).innerHTML = content
}
// Function pour insérer du texte avec l'opérateur += (additionne jusqu'à ce qu'il n'y ait plus de texte à ajouter)
function txtAddEgal(element, content) {
    document.getElementById(element).innerHTML += content
}

//---------------Utils pour l'étape 1---------------------//
// déclaration d'un tableau pour y insérer les quantités de chaque produit sélectionné
let tableauQuantite = [];
// déclaration d'un tableau pour y insérer les prix de chaque produit sélectionné
let tableauTotaux = [];
// Fonction pour l'utilisation de la méthode reducer --> cumul quantité ou prix
function reducer(accumulator, currentValue) {
    return accumulator + currentValue;
}
// Fonction pour cibler l'article dans le html et récupérer les données id/couleur
function targetArticle(e) {
    const target = e.target.closest('article');
    //ici on va récupérer l'id et la couleur associés à l'article pour savoir de quel produit il s'agit
    let id = target.dataset.id;
    let color = target.dataset.color;
    return { id, color };
}

//-----------------Utils pour l'étape 2-----------------//
// function pour alléger le code, peut être utilisé plusieurs fois (ex : prénom,nom,ville)
function regexSame(regex) { return /^[A-Za-zàéèêëîïôöûüùç.-\s]{3,20}$/.test(regex) }
function regexAddress(regexAddress) { return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(regexAddress) }
function regexEmail(regexEmail) { return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(regexEmail) }

//--------------------Utils étape 3------------------------//
// Définition d'une constante pour créer un tableau d'Id dont on aura besoin pour obtenir l'orderId de la commande
const products = [];

//----------------------------------------Fin Utils------------------------------------------------------//

//ETAPE 1 : gestion de l'affichage des articles préalablement stockés dans le localStorage

// Si le localStorage est vide, afficher un texte pour le préciser en utilisant la function "insertionTxt".
if (stockProducts == null) {
    insertionTxt('cart__items', `<article class="cart__item">
                                    <div class="cart__item__img">
                                        <img src="/front/images/logo.png" alt="logo de Kanap">
                                    </div>
                                    <div class="cart__item__content">
                                        <div class="cart__item__content__description">
                                            <p>Votre panier est vide !<p>
                                        </div>
                                    </div>
                                </article>`)
}
// Si le localStorage n'est pas vide, afficher les produits qui y sont enregistrés et gérer les interactions
else if (stockProducts != null) {
    // la boucle for permet de répéter les opérations suivantes jusqu'à ce que tout soit à jour
    for (let i = 0; i < stockProducts.length; i++) {
        // pour tous les produits enregistrés dans le localStorage on récupère les informations qui y sont relatives
        //grâce à fetch et à l'intégration dans l'url de l'id du produit stocké 
        fetch(`http://localhost:3000/api/products/${stockProducts[i].id}`)
            .then(response => response.json())
            .then(product => {
                //_______Affichage(function "txtAddEgal") des produits_____//
                txtAddEgal('cart__items',
                    `<article class="cart__item" data-id="${stockProducts[i].id}" data-color="${stockProducts[i].couleur}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>couleur : ${stockProducts[i].couleur}</p> 
                        <p>prix : ${product.price} €</p> <!-- multiplication du prix par la quantité de produit -->
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${stockProducts[i].quantite}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`)
                // __________Gestion de l'affichage du prix total de la commande________//
                //pour chaque produit, on push son prix dans tableauTotaux
                tableauTotaux.push(parseInt(product.price) * parseInt(stockProducts[i].quantite))
                // utilisation de la méthode reduce et la function "reducer" pour cumuler les prix
                const prixTotal = tableauTotaux.reduce(reducer);
                // on affiche dans le html le prix total 
                insertionTxt('totalPrice', prixTotal);
                // __________Gestion de l'affichage de la quantité totale d'articles________//
                //même procédure que pour la gestion du prix total
                tableauQuantite.push(parseInt(stockProducts[i].quantite));
                const quantiteTotale = tableauQuantite.reduce(reducer);
                insertionTxt('totalQuantity', quantiteTotale);
            })
            .then(() => {
                // __________Gérer la modification des quantités depuis la page panier_______________//
                // pour modifier le produit, utiliser "change" dans addEventListener
                document.querySelectorAll('.itemQuantity').forEach((inputQuantity) => {
                    inputQuantity.addEventListener('change', (e) => { 

                        // utilisation de la function "targetArticle" pour cibler l'article et récupérer l'id/couleur associés
                        let { id, color } = targetArticle(e); 

                        // on utilise "find" pour chercher le produit avec le même id et la même couleur dans notre localStorage
                        let searchProduct = stockProducts.find((product) => product.id === id && product.couleur === color);
                        // puis on change la quantité du produit trouvé
                        if (searchProduct != undefined) {
                            let quantite = inputQuantity.value
                            let product = { id: id, couleur: color, quantite: quantite }

                            for (let y = 0; y < stockProducts.length; y++) {
                                if (product.quantite <= 100 && stockProducts[y].id == product.id && stockProducts[y].couleur == product.couleur) {
                                    // mise à jour des quantités et envoi des infos au localStorage
                                    stockProducts[y].quantite = product.quantite
                                    setPanier("keyProducts", (stockProducts))
                                }else if (product.quantite > 100 && stockProducts[y].id == product.id && stockProducts[y].couleur == product.couleur)
                                {
                                    alert(`la quantité de kanap ${product.id} ${product.couleur}  est limitée à 100`)
                                }
                            }
                        }
                        // actualisation automatique des données
                        location.reload()
                    })
                })
            })
            .then(() => {
                //___________________Pour supprimer un produit du panier_________________________//
                // pour supprimer le produit, utiliser le paramètre click dans addEventListener
                document.querySelectorAll('.deleteItem').forEach((btnSupprimer) => {
                    btnSupprimer.addEventListener('click', (e) => {

                        // utilisation de la function "targetArticle" pour cibler l'article et récupérer l'id/couleur associés
                        let { id, color } = targetArticle(e)
                        /*on cherche grâce à "filter", un produit qui a un id différent 
                        OU un produit qui a un id correspondant et une couleur différente*/
                        let finalProductList = stockProducts.filter((product) => product.id !== id || product.id === id && product.couleur !== color)

                        if (finalProductList != undefined) {
                            // on enregistre seulement les produits trouvés précédemment
                            let stockProducts = finalProductList
                            if (stockProducts.length != 0) {
                                //si le localstorage n'est pas égale à 0, le mettre à jour
                                setPanier("keyProducts", (stockProducts))
                            }
                            else {
                                //autrement, suppression de la clé "KeyProducts" puisqu'elle est vide
                                supprimeKeys("keyProducts")
                            }
                        }
                        // actualisation automatique des données 
                        location.reload()
                    });
                })
            })
    }
}
//_________________________________________Fin étape 1_______________________________________________//
//ETAPE 2 : gestion du formulaire de contact
// Sélection du bouton "commander !"
const btnCommander = document.getElementById("order")
// addEventListener pour les intérations lors du click
btnCommander.addEventListener("click", (event) => {
    event.preventDefault()
    console.log(btnCommander.addEventListener)
    //_____________ contrôle et validation des données saisies dans les champs du formulaire____________//
    // Création d'un objet "contact" pour contrôler et valider les valeurs du formulaire
    const contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    }
    //le prénom :
    function controlePrenom() {
        //si le champ est bien rempli (regex ok), aucun texte n'apparaît
        if (regexSame(contact.firstName)) {
            insertionTxt('firstNameErrorMsg', ``)
            return true
        }
        else // autrement, insérer un texte indiquant le champ à corriger
        {
            insertionTxt('firstNameErrorMsg', `Les chiffres et les symboles ne sont pas autorisés. Le nombre de caractères doit être compris entre 3 et 20.`)
            return false
        }
    } 
    //le Nom :
    function controleNom() {
        //si le champ est bien rempli (regex ok), aucun texte n'apparaît
        if (regexSame(contact.lastName)) {
           insertionTxt('lastNameErrorMsg', ``)
           return true
        }
        else // autrement, insérer un texte indiquant le champ à corriger
        {
            insertionTxt('lastNameErrorMsg', `Les chiffres et les symboles ne sont pas autorisés. Le nombre de caractères doit être compris entre 3 et 20.`)
            return false
        }
    } 
    //la ville:
    function controleCity() {
        //si le champ est bien rempli (regex ok), aucun texte n'apparaît
        if (regexSame(contact.city)) {
            insertionTxt('cityErrorMsg', ``)
            return true
        }
        else // autrement, insérer un texte indiquant le champ à corriger
        {
            insertionTxt('cityErrorMsg', `Les chiffres et les symboles ne sont pas autorisés. Le nombre de caractères doit être compris entre 3 et 20.`)
            return false
        }
    } 
    //l'adresse postale:
    function controleAddress() {
        //si le champ est bien rempli (regex ok), aucun texte n'apparaît
        if (regexAddress(contact.address)) {
            insertionTxt('addressErrorMsg', ``)
            return true
        }
        else // autrement, insérer un texte indiquant le champ à corriger
        {
            insertionTxt('addressErrorMsg', `Les symboles ne sont pas autorisés. Le nombre de caractères est de 3 minimum.`)
            return false
        }
    }
    //l'email:
    function controleEmail() {
        //si le champ est bien rempli (regex ok), aucun texte n'apparaît
        if (regexEmail(contact.email)) {
            insertionTxt('emailErrorMsg', ``)
            return true
        }
        else // autrement, insérer un texte indiquant le champ à corriger
        {
           insertionTxt('emailErrorMsg',`Veuillez saisir une adresse email valide.`)
           return false
        }
    }
    // si les contrôles répondent aux exigences, valider les champs saisis 
    //et envoyer les données dans le localStorage dans la clé "contact"
    if (controlePrenom() && controleNom() && controleCity() && controleAddress() && controleEmail()) { 
        setPanier("contact", (contact))
    }
    else { 
        alert('Tous les champs du formulaire doivent être correctement saisis.')
        return controlePrenom(), controleNom(), controleCity(), controleAddress(),controleEmail()    
    }
    //_________________________________________Fin étape 2_______________________________________________//

    // ETAPE 3 : gestion de la confirmation de commande_______________________//

    // Si le localstorage n'est pas vide, pour tous les produits sauvegardés, pusher leur id dans le tableau "products".
    if (stockProducts != undefined) {
        for (let d = 0; d < stockProducts.length; d++) {
            products.push(stockProducts[d].id)
        }
    }
    else {
        alert("Votre panier est vide. Pour faire une commande, sélectionnez le Kanap de votre choix.")
        return false
    }

    // Création d'un objet avec un objet de contact et un tableau d'id de produit
    let orderProducts = { contact, products };

    if (orderProducts != undefined) {
        // Si orderProducts existe, faire une requête fetch avec la méthode POST 
        // pour envoyer les données au serveur et récupérer l'orderId
        fetch(`http://localhost:3000/api/products/order`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/JSON',
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify(orderProducts)
            })
            .then(response => response.json())
            .then((order) => {
                //Ici, on redirige l'utilisateur vers la page confirmation en intégrant "order.orderId" dans l'url
                window.location.href = `confirmation.html?id=${order.orderId}`;

                // puis on supprime la key keyProducts
                supprimeKeys("keyProducts");
            })
    }
    else {
        alert("une erreur est survenue, veuillez réitérer votre commande")
        return false
    }
})







