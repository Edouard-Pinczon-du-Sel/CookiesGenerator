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
      
      // une manière de savoir si la liste à des enfants si on regarde quelque chose
    if(cookiesList.children.length) {
        displayCookies();
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

const cookiesList = document.querySelector(".cookies-list");
const displayCookieBtn = document.querySelector(".display-cookie-btn")
const infoTxt = document.querySelector(".info-txt")

displayCookieBtn.addEventListener("click", displayCookies);

let lock = false
function displayCookies() {
    // quand un if n'a qu'une seule chose à faire on peut le mettre sur une seule ligne
    if(cookiesList.children.length) cookiesList.textContent = "";
    // regex remplace tous les global espace par "" et split pas ; en renverant voir regex101.com
    const cookies = document.cookie.replace(/\s/g, "").split(";").reverse()
    console.log(cookies);

    // S'il n'y a pas de cookies
    lock=false;
    if(!cookies[0]) {
        if(lock) return
        // block le fait de pouvoir spamer le message
        lock = true;
        infoTxt.textContent = "Pas de cookies à afficher, créez-en un!";
        
        setTimeout(() =>{
        infoTxt.textContent = "";
        lock = false
        }, 1500)
        return;
    }

  createElements(cookies)
}

function createElements(cookies) {
    cookies.forEach(cookie => {
        // créer un nouveau tableau en séparant les élémets là ou se trouve des espaces
        const formatCookie = cookie.split('=');
        const listItem = document.createElement('li');
        const name = decodeURIComponent(formatCookie[0]);
        listItem.innerHTML = 
        `
            <p>
                <span>Nom</span> : ${name}
            </p>
            <p>
                <span>Valeur</span> : ${decodeURIComponent(formatCookie[1])}
            </p>
            <button>X</button>
        `
        listItem.querySelector('button').addEventListener('click', e => {
            createToast({name: name, state: 'supprimé', color: 'crimson'})
            // on détruit un cookie
            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`
            // On supprime du DOM
            e.target.parentElement.remove();
        });
        cookiesList.appendChild(listItem);
    })
}
