/* function fact(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * fact(n-1);
    }
}

function applique(f, tab){
    return tab.map(f);
}

console.log(applique(fact,[1,2,3,4,5,6]));
console.log(applique(function(n) { return (n+1); } , [1,2,3,4,5,6])); */

const btnMaj = document.getElementById("btnMaj");
const btnStyle = document.getElementById("btnStyle");
const textArea = document.getElementById("txtMsg");
const pseudo = document.getElementById("txtPseudo");

let msgs;

fetch('http://localhost:8080/msg/getAll')
.then(function(response) {
  return response.json();
})
.then(function(data) {
    msgs = data.msgs;
    update(msgs);
});

let colorMode = ["black", "white"];

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

btnMaj.addEventListener("click", function(){
    if (textArea.value.length > 0 && pseudo.value.length > 0){
        let responseNber;
        fetch('http://localhost:8080/msg/post/' + textArea.value + '?pseudo=' + pseudo.value + '&date=' + new Date().toISOString())
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            responseNber = data.nber;
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

btnStyle.addEventListener("click", function(){
    colorMode = colorMode[0] === "black" ? ["white", "black"] : ["black", "white"];
    document.documentElement.style.setProperty('--background-color', colorMode[0]);
    document.documentElement.style.setProperty('--text-color', colorMode[1]);
    document.documentElement.style.setProperty('--button-background-color', colorMode[1]);
    document.documentElement.style.setProperty('--button-text-color', colorMode[0]);
});

