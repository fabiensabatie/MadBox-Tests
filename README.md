# MadBox

## Partie API/Automatisation (Temps requis : 4h)

Pour démarrer le serveur :

```
git clone https://github.com/fabiensabatie/MadBox.git MadBox && cd MadBox && npm i && npm start
```

Pour accéder au jeu de traduction : http://localhost:8080

Si vous souhaitez repeupler la base de donnée, vous pouvez la vider la base de donnée et la remplir à nouveau via la commande :
```
node server.js renew
```

La gestion des levels est faite via le nombre de lettres du mot en français (peut d'intérêt donc).
J'ai utilisé MongoDB pour stocker les mots et leurs traductions. Le serveur stocke les mots à l'initialisation. la traduction est sauvegardée à la volée selon l'utilisation par un joueur. La base de donnée est sur une sandbox MLAB, afin de vous éviter installation / configuration de MongoDB.

Structure :
```
app_commons - global_cm.js : Définition des variables d'environnement
app_commons - mongo_cm.js : Wrapper custom mongodb
controllers/api - translate.js : Fonctions de back-end et api de traduction
public/scripts - translato.js : Instance vue gérant les interactions avec le joueur.
public/views - translatate.pug : Vue pug du jeu translato
```

Le code fonctionne ainsi : à l'initialisation, l'app se connecte à la base de donnée, définit les indexs de celle-ci, puis la peuple. Pour la peupler, le fichier définit par "__WORDLIST_PATH" (app_commons/global_cm) est ouvert, puis "__WORDS_TO_ADD" mots sont ajoutés. Une fois ceci fait, le serveur écoute les requetes entrantes.

La route '/' rend la vue du jeu, la route API /:level, où level est le niveau du mot désiré, renvoie un mot en français et sa traduction anglaise au client sous la forme d'un JSON {word: 'boujour', t_word: 'hi'}. Pour ce faire, les mots sont récupérés depuis la base de donnée, puis un mot du level spécifié est choisi aléatoirement parmi tous les mots du level. Si le mot dispose deja d'une traduction, celle ci est envoyée, sinon, on requiert la traduction auprès de Yandex, puis on ajoute le mot traduit à la DB.

Dans public/scripts/translato.js la vue gère l'appel à l'api mentionnée ci-dessus, puis peuple le template avec les variables requises.

### Points d'amélioration :

- Il serait plus judicieux de stocker toutes les traductions avant plutôt qu'au fur et à mesure.
- Le code coté client est ouvert, et n'importe quel joueur peut modifier son score / voir les reponses s'il cherche dans la console.
- Une définition claire de la notion de niveau aurait permis d'éviter de collecter tous les mots lorsqu'un joueur demande d'une nouveau mot, en cherchant un couple traduit directement via le level.
- L'API n'est pas sécurisée
- Yandex ne parvient pas à tout traduire, par conséquent, un mot traduit qui est égal à son mot français est ignoré. Ceci peut mener à de faux négatifs pour les mots s'écrivant à l'identique en français et en anglais.


## Partie collision (Temps requis : 5h)

Pour accéder au jeu de collision : http://localhost:8080/playable

Comme sur la vidéo, un clic stoppe la rotation du rectangle, et un second réinitalise le jeu. Le jeu est aussi reset lorsque la balle sort du champ.

Structure :
```
public/scripts/vendor : Scripts vendeurs (ThreeJS)
public/scripts - playable.js : Script ThreeJS gérant la scene
public/views - playable.pug : Vue pug du jeu de collision
```

### Points d'amélioration :
- Methode de collision à revoir : la balle ne rebondit pas correctement lorsque le rectangle est à la verticale, de plus le calcul semble lent et peu optimisé. J'observe parfois des lags dans le déplacement de la balle.
- Dans le cadre de cet exercice, l'utilisation des canvas HTML5 sans threejs offre une flexibilité plus intéressante (pas de conversion entre les coordonnées du monde et celles de l'écran nécessaire, comme c'est ici le cas).

### Difficultés
- J'ai passé plus des deux tiers de cet exercice à debug la collision, qui s'est soldée par une simple inversion du signe de theta. Je ne comprends pas encore complètement en quoi ce changement permet une collision propre.
