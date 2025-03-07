const express = require('express'); //import de la bibliothèque Express
const app = express(); //instanciation d'une application Express
let compteur = 0; // État initial du compteur
let allMsgs = [
    { "msg" : "Hello World", "pseudo" : "John", "date" : "2025-03-07T14:48:00Z" },
    { "msg" : "foobar", "pseudo" : "Jane", "date" : "2025-03-06T14:48:00Z" },
    { "msg" : "I love cats", "pseudo" : "Alice", "date" : "2025-03-05T14:48:00Z" },
    { "msg" : "CentraleSupelec Forever", "pseudo" : "Bob", "date" : "2025-03-04T14:48:00Z" },
];

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.
app.get("/", function(req, res) {
  res.send("Hello")
})

// Juste pour tester
app.get('/test/*', function(req, res) {
    res.json({"msg": req.url.substring(6)});
});

// Route pour obtenir la valeur du compteur
app.get('/cpt/query', (req, res) => {
    res.json({ compteur: compteur });
});

// Route pour incrémenter le compteur
app.get('/cpt/inc', (req, res) => {
    let v = req.query.v;
    if (v !== undefined) {
      let intValue = parseInt(v, 10);
      if (!isNaN(intValue) && v.match(/^\d+$/)) {
        compteur += intValue; // Incrémentation par une valeur donnée
        return res.json({ code: 0 });
      } else {
        return res.json({ code: -1 }); // Mauvaise valeur
      }
    } else if (Object.keys(req.query).length === 0) {
      compteur++;
      return res.json({ code: 0 });
    } else {
      return res.json({ code: -1 }); // Aucun paramètre v fourni, pas d'incrémentation
    }
});

// Route pour obtenir un message
app.get('/msg/get/*', function(req, res) {
    let id = req.url.substring(9);
    let intId = parseInt(id, 10);
    if (!isNaN(intId) && id.match(/^\d+$/) && intId < allMsgs.length) {
        res.json({ "code": 1, "msg": allMsgs[intId] });
    } else {
        res.json({ "code": 0 });
    }
});

// Route pour compter le nombre de messages
app.get('/msg/nber', function(req, res) {
    if (allMsgs === undefined) {
        res.json({ "nber": 0 });
    }
    else {
        res.json({ "nber": allMsgs.length });
    }
});

// Route pour obtenir tous les messages
app.get('/msg/getAll', function(req, res) {
    if (allMsgs !== undefined) {
        res.json({ "msgs": JSON.stringify(allMsgs) });
    }
});

// Route pour ajouter un message
app.get('/msg/post/*', function(req, res) {
    let msg = req.url.substring(10).split("?")[0];
    let pseudo = req.query.pseudo;
    let date = req.query.date;
    if (allMsgs !== undefined && msg !== undefined && pseudo !== undefined && date !== undefined) {
        allMsgs.push({ "msg" : decodeURIComponent(msg), "pseudo" : pseudo, "date" : date });
        res.json({ "nber": allMsgs.length-1 });
    }
    else {
        res.json({ "code": -1 });
    }
});



// Route pour supprimer un message
app.get('/msg/del/*', function(req, res) {
    let id = req.url.substring(9);
    let intId = parseInt(id, 10);
    if (!isNaN(intId) && id.match(/^\d+$/) && intId < allMsgs.length) {
        allMsgs.splice(intId, 1);
        res.json({ "code": 1 });
    } else {
        res.json({ "code": 0 });
    }
});

// Lancement du serveur
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}...`);
});
