Voici une extension chrome pour analyser les réponses de l'utilisateurice sur le Politiscale et les comparer avec les réponses supposées de 27 partis politiques Français.

Lors de l'affichage des résultats du Politiscale à la fin du test, les 10 partis politiques les plus proches des réponses de l'utilisateurice sont affichés également.

⚠️ L'extension ne fonctionne qu'avec le politiscale.fr EN FRANÇAIS et à condition que l'utilisateurice avance linéairement dans le test, PAS DE RETOUR EN ARRIÈRE POSSIBLE.

———— POUR INSTALLER L'EXTENSION SUR CHROME/NAVIGATEUR CHROMIUM ————
1. Télécharger le fichier zip de l'extension sur GitHub (bouton "<> Code" --> Download ZIP)
2. Le décompresser sur son ordinateur
3. Ouvrir Google Chrome / le Navigateur Chromium (Brave, Arc...)
4. Aller dans les Paramètres --> Extensions --> Gérer les extensions
5. Activer le mode développeur en haut à droite
6. Cliquer sur le bouton "Charger l'extension non empaquetée"
7. Sélectionner le dossier décompressé précédemment et s'assurer qu'elle est bien activée parmi les extensions.
8. Aller sur le politiscale.fr en Français et effectuer le test SANS REVENIR EN ARRIÈRE OU À LA QUESTION PRÉCÉDENTE
9. À la fin, les affinités avec les partis politiques s'affichent sous l'image des résultats à télécharger


———— DISCLAIMER ————
Je suis une jeune passionnée par le dev et la politique. Des erreurs peuvent être présentes dans mon code que j'ai développé à l'aide des IAs.

L'extension ne fonctionne qu'avec le Politiscale EN FRANÇAIS et à condition que l'utilisateurice avance linéairement dans le test, PAS DE RETOUR EN ARRIÈRE POSSIBLE.

Même si j'ai fais de mon mieux pour que les résultats soient impartiaux et neutres vis à vis de mes convictions politiques (les résultats ont été obtenus via IAs et révisés), il est possible qu'il y ait des biais sur les choix de notation des points. Si tel est le cas, j'en suis désolée.

Par soucis de transparence, vous pourrez trouver l'intégralité des votes supposés de chacun des partis ainsi que l'explication dudit vote dans le dossier /BONUS/votes-partis.

Je me suis également amusée à simuler les résultats de chacun des partis. Les images en résultant sont trouvables dans /BONUS/resultats-partis-politiscale

Enfin, encore par soucis de transparence, je vous met ci-dessous le prompt que j'ai renseigné à l'IA (DeepSeek) ayant supposé des réponses des partis :


'
je vais te poser 117 questions. Je veux que tu répondes parmi 5 choix ce qu'aurait choisi comme réponse le parti politique suivants en te basant sur les votes auxquels ce partis a participé. Si le partis n'a jamais participé à certains votes ou n'a jamais pu voter au sujet de la question, essaie de deviner le choix que ce parti aurait fait selon la politique qu'il mène, mais attention à ne pas te faire avoir par le populisme ! Bases toi principalement sur les faits plutôt que sur les belles paroles quand c'est possible.

voici le parti politique à analyser :
*Nom du parti politique à analyser*

et voici les 5 choix possibles :
- Absolument d'accord
- Plutôt d'accord
- Neutre ou hésitant
- Plutôt pas d'accord
- Absolument pas d'accord


Voici finalement les 117 questions :
1. On ne naît pas femme, on le devient.
2. Les différences de traitements et de qualité de vie dans notre société montrent que le racisme est encore très présent.
...
...

Formule ta réponse sous forme de tableau .json à 4 colonnes :
une colonne avec l'index de la question posée
une colonne avec l'intitulé de la question
une colonne avec la réponse courte parmi les 5 choix proposés
une colonne avec un développement court du pourquoi cette réponse a été choisie
'


Pour toute demande, n'hésitez pas à me contacter sur BlueSky à @louisfchl.bsky.social ☺️