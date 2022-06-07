//_______________________________________PAGE CONFIRMATION ______________________________________________//

//__________________________ Récupération d'id via l'url_______________________//
// ciblage de l'url puis paramétrage avec searchParams
const recuperationUrl = window.location.search;    
const urlSearchParams = new URLSearchParams (recuperationUrl);
// Extraction de l'Id
const id = urlSearchParams.get("id");

//__________________Insertion du numéro de commande dans le html________________//
document.getElementById('orderId').innerHTML = id;

//__________________Suppression des données du formulaire________________//
localStorage.removeItem("contact");