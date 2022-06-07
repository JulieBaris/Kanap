//_______________Gestion de l'affichage des produits sur la page d'accueil________________//
//--------------------------------------------Utils--------------------------------------//
// création d'une constante pour alléger le code dans le fetch
const cartProduit = document.getElementById("items")
//---------------------------------------------------------------------------------------//
/** Gestion de l'affichage des fiches produits et des interactions :
 * 1) Requête permettant de récupérer les informations relatives aux produits via l'api grâce à fetch ;
 * 2) Insertion des éléments <a>, <article>, ... dans le DOM grâce à innerHTML +=;
 * 3) Insertion des caractéristiques des produits grâce à ${products.__}
 * 4) Gestion de l'élément <a> et de son attribut href grâce à l'ajout de ?id=${products._id}&name=${products.name} dans l'url.
 **/
 fetch("http://localhost:3000/api/products")
 .then( response => response.json()) 
 .then( products => 
 {
     for( let product of products)
     {
         cartProduit.innerHTML += 
         `<a href="${`product.html?id=${product._id}&name=${product.name}`}">
         <article>
         <img src="${product.imageUrl}" alt="${product.altTxt}">
         <h3 class="productName">${product.name}</h3>
         <p class="productDescription">${product.description}</p>
         </article>
         </a>`
     }
 })


