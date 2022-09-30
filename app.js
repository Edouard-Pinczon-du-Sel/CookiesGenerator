const inputs = document.querySelectorAll("input")

// Pour tous les inputs de la page on met deux écouteurs appelant 2 handle
inputs.forEach(input =>{
    input.addEventListener("invalide", handleValidation)
    input.addEventListener("input", handleValidation)


})

// Cette fonction permmet de vérifier s'il n'y a pas d'erreurs dans la saisie
// Et de customiser le message d'erreur par défaut qui sera afficher
function handleValidation(e) {
    if(e.type === "invalid") {
        e.target.setCustomValidity("Ce champ ne peut être vide")

    } else if (e.type === "input") {
        e.target.setCustomValidity("")
    }
}

// On slectionne notre formulaire et on place un écouteur dessus
const cookieForm = document.querySelector("form")
cookieForm.addEventListener("submit", handleForm)

// Cette fonction à pour but de créer un cookie avec le nom et la valeur entré dans les inputs
function handleForm(e) {
    e.preventDefault()
    const newCookie = {};

    // Pour tous les inputs on prend l'attriput name et on lui attribut la valeur entrée dans l'input
    inputs.forEach(input => {
        const nameAttribute = input.getAttribute("name")
        newCookie[nameAttribute] = input.value;
    })
// Un cookie à besoin d'une date d'expiration qui se creer comme ceci
    newCookie.expires = new Date(new Date().getTime()+7*24*60*60*1000)
    //console.log(newCookie);
    createCookie(newCookie)
    cookieForm.reset();
}

function createCookie(newCookie) {

    if(doesCookieExist(newCookie.name)) {
        createToast({name: newCookie.name, state: "modifié", color: "orangered"})
    }
    else {
        createToast({name: newCookie.name, state: "crée", color: "green"})
    }
    
    document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};expires=${newCookie.expires.toUTCString()}`
    if(cookiesList.children.length) {
        displayCookies()
      }
}

function doesCookieExist(name) {
    // Retrouve les cookies et enleve les espaces en les rangeant dans un tableau en enlevant les elements séparés par des points virgules
    // le s g c'est du regex
    const cookies = document.cookie.replace(/\s/g, "").split(";");
    // On veut juste récupérer [0] premier élément en créant un sous tableau avec map
    const onlyCookiesName = cookies.map(cookie => cookie.split("=")[0])
    console.log(cookies, onlyCookiesName);
    // Find parcours le tableau onlyCookiesName
    const cookiePresence = onlyCookiesName.find(cookie => cookie === encodeURIComponent(name))
    return cookiePresence;
}

const toastsContainer = document.querySelector(".toasts-container")
function createToast({name, state, color}) {
    const toastInfo = document.createElement("p");
    toastInfo.className = "toast";
    toastInfo.textContent = `Cookie ${name} ${state}.`;
    toastInfo.style.backgroundColor = color;
    toastsContainer.appendChild(toastInfo);

    setTimeout(()=>{
        toastInfo.remove()
    }, 2500)}

const cookiesList = document.querySelector(".cookie-list");
const displayCookieBtn = document.querySelector(".display-cookie-btn")
const infoTxt = document.querySelector(".info-txt")

displayCookieBtn.addEventListener("click", displayCookies);

function displayCookies() {
    // regex remplace tous les global espace par "" et split pas ; en renverant voir regex101.com
    const cookies = document.cookie.replace(/\s/g, "").split(";").reverse()
    console.log(cookies);

    // S'il n'y a pas de cookies
    if(!cookies[0]) {
        infoTxt.textContent = "Pas de cookies à afficher, créez-en un!";
        setTimeout(() =>{
        infoTxt.textContent = "";
        }, 1500)
        return;
    }

  createElements(cookies)
}

