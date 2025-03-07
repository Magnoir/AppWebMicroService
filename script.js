require('dotenv').config(); // Pour lire le fichier .env
const BACKEND_URL = process.env.BACKEND_URL;

// Partie Client 3)
// Fonction factorielle
function fact(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * fact(n-1);
    }
}

console.log(fact(6));

// Fonction qui applique factorielle à un tableau
function applique(f, tab){
    return tab.map(f);
}

console.log(applique(fact,[1,2,3,4,5,6]));
console.log(applique(function(n) { return (n+1); } , [1,2,3,4,5,6]));

// Partie Serveur 
const btnMaj = document.getElementById("btnMaj");
const btnStyle = document.getElementById("btnStyle");
const textArea = document.getElementById("txtMsg");
const pseudo = document.getElementById("txtPseudo");

// Variable pour le dark mode
let colorMode = ["black", "white"];

// Variable qui contiendra les messages
let msgs;

// Récupération des messages
fetch(`${BACKEND_URL}/msg/getAll`)
.then(function(response) {
    return response.json();
})
.then(function(data) {
        msgs = JSON.parse(data.msgs);
        update(msgs);
})
.catch(function() {
        console.error("Error while getting the messages.");
});

// Fonction pour mettre à jour les messages
function update(tab){
    if (!Array.isArray(tab) || !tab.every(item => item.hasOwnProperty('msg'))
        || !tab.every(item => item.hasOwnProperty('pseudo')) 
        || !tab.every(item => typeof item.msg === 'string') 
        || !tab.every(item => item.msg.length > 0)) {
        console.error("Invalid input: The array must contain objects with a 'msg' property.");
        return;
    }

    document.getElementById("msgs").innerHTML = "";

    tab.forEach(element => {
        const li = document.createElement("li");
        li.textContent = `${element.msg} - ${element.pseudo} - ${element.date}`;
        document.getElementById("msgs").appendChild(li);
    });
}

// Ajout d'un message
btnMaj.addEventListener("click", function(){
    if (textArea.value.length > 0 && pseudo.value.length > 0){

        let responseNber;
        fetch(`${BACKEND_URL}/msg/post/` + textArea.value + '?pseudo=' + pseudo.value + '&date=' + new Date().toISOString())
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            responseNber = data.nber;
        })
        .catch(function() {
            responseNber = -1;
        });

        if (responseNber === -1){
            console.error("Error while posting the message.");
            return;
        }
        else {
            msgs.push({ "msg" : textArea.value, "pseudo" : pseudo.value, "date" : new Date().toISOString() });
            pseudo.value = "";
            textArea.value = "";
            update(msgs);
        }
    }
    }
);

// Dark mode
btnStyle.addEventListener("click", function(){
    colorMode = colorMode[0] === "black" ? ["white", "black"] : ["black", "white"];
    document.documentElement.style.setProperty('--background-color', colorMode[0]);
    document.documentElement.style.setProperty('--text-color', colorMode[1]);
    document.documentElement.style.setProperty('--button-background-color', colorMode[1]);
    document.documentElement.style.setProperty('--button-text-color', colorMode[0]);
});

