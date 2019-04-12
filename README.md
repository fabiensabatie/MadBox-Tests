# MadBox - Playable

Pour démarrer le serveur :

```
npm i && npm start
```

Pour accéder au jeu : http://localhost:8080
Pour vider la base de donnée et la remplir à nouveau :
```
node server.js renew
```

J'ai utilisé MongoDB pour stocker les mots et leurs traductions. Le serveur stocke les mots à l'initialisation. la traduction est sauvegardée à la volée selon l'utilisation par un joueur.

Structure :
```
controllers/api - translate.js : Fonctions de back-end et api de traduction
public/scripts - translato.js : Instance vue gérant les interactions avec le joueur.
public/views - translatate.pug : Vue pug du jeu translato
```
