// Déclaration d'un objet pour stocker les scores des partis
let scores = {
	animaliste: 0,
	breton: 0,
	centriste: 0,
	corsica_libera: 0,
	dlf: 0,
	ecologie_au_centre: 0,
	eelv: 0,
	generations: 0,
	lfi: 0,
	lo: 0,
	lr: 0,
	lrem: 0,
	modem: 0,
	npa: 0,
	patriotes: 0,
	pcf: 0,
	place_publique: 0,
	ps: 0,
	radical: 0,
	reconquete: 0,
	resistons: 0,
	rev: 0,
	rn: 0,
	udi: 0,
	udr: 0,
	unser_land: 0,
	upr: 0
};

// Noms d'affichage des partis
const partiNames = {
	animaliste: "Parti Animaliste",
	breton: "Parti Breton",
	centriste: "Parti Centriste",
	corsica_libera: "Corsica Libera",
	dlf: "Debout la France",
	ecologie_au_centre: "Écologie au Centre",
	eelv: "Europe Écologie Les Verts",
	generations: "Génération.s",
	lfi: "La France Insoumise",
	lo: "Lutte Ouvrière",
	lr: "Les Républicains",
	lrem: "La République En Marche",
	modem: "MoDem",
	npa: "Nouveau Parti Anticapitaliste",
	patriotes: "Les Patriotes",
	pcf: "Parti Communiste Français",
	place_publique: "Place Publique",
	ps: "Parti Socialiste",
	radical: "Parti Radical",
	reconquete: "Reconquête",
	resistons: "Résistons",
	rev: "Révolution Écologique pour le Vivant",
	rn: "Rassemblement National",
	udi: "Union des Démocrates et Indépendants",
	udr: "Union des Droites Républicaines",
	unser_land: "Unser Land",
	upr: "Union Populaire Républicaine"
};

// Variable pour suivre si les scores ont déjà été initialisés
let scoresInitialized = false;

// Données JSON contenant les réponses des partis
let questionsData = [];

// Stockage temporaire de la question actuelle
let currentQuestionText = "";

// Fonction pour charger le fichier JSON
function loadData() {
	fetch(chrome.runtime.getURL('votes_total.json'))
		.then(response => response.json())
		.then(data => {
			questionsData = data;
			console.log("Données chargées avec succès :", questionsData.length, "questions");
		})
		.catch(error => console.error("Erreur lors du chargement des données :", error));
}

// Fonction pour sauvegarder les scores dans sessionStorage
function saveScores() {
	sessionStorage.setItem('scores', JSON.stringify(scores));
	console.log("Scores sauvegardés :", scores);
}

// Fonction pour charger les scores depuis sessionStorage
function loadScores() {
	const savedScores = sessionStorage.getItem('scores');
	if (savedScores) {
		scores = JSON.parse(savedScores);
		console.log("Scores chargés :", scores);
	}
}

// Fonction pour réinitialiser les scores à 0
function resetScores() {
	for (const parti in scores) {
		scores[parti] = 0;
	}
	sessionStorage.removeItem('scores'); // Effacer les scores sauvegardés
	scoresInitialized = true; // Empêcher une réinitialisation supplémentaire
	console.log("Scores réinitialisés à 0");
}

// Fonction pour déboguer la structure de la page
function debugPageStructure() {
	console.log("=== DÉBOGAGE DE LA STRUCTURE DE LA PAGE ===");
	console.log("Élément #question:", document.getElementById("question"));
	console.log("Élément #question-text:", document.getElementById("question-text"));
	console.log("Sélecteur #question-content:", document.querySelector("#question-content"));
	console.log("Sélecteur #question p:", document.querySelector("#question p"));
	console.log("Tous les paragraphes de la page:", document.querySelectorAll("p"));

	// Essayer de trouver l'élément qui contient le texte de la question
	const allParagraphs = document.querySelectorAll("p");
	console.log("Contenus de tous les paragraphes:");
	allParagraphs.forEach((p, index) => {
		console.log(`p[${index}]: ${p.textContent.trim()}`);
	});
}

// Fonction pour obtenir la question actuelle de manière plus robuste
function getCurrentQuestion() {
	// Essayer différentes méthodes pour trouver la question
	let questionText = "";

	// Méthode 1: Chercher un paragraphe dans #question-content
	const questionContentP = document.querySelector("#question-content p");
	if (questionContentP) {
		questionText = questionContentP.textContent.trim();
		console.log("Question trouvée via #question-content p:", questionText);
		return questionText;
	}

	// Méthode 2: Chercher un paragraphe dans #question
	const questionP = document.querySelector("#question p");
	if (questionP) {
		questionText = questionP.textContent.trim();
		console.log("Question trouvée via #question p:", questionText);
		return questionText;
	}

	// Méthode 3: Chercher #question-text
	const questionTextElem = document.querySelector("#question-text");
	if (questionTextElem) {
		questionText = questionTextElem.textContent.trim();
		console.log("Question trouvée via #question-text:", questionText);
		return questionText;
	}

	// Méthode 4: Chercher #question
	const questionElem = document.querySelector("#question");
	if (questionElem) {
		questionText = questionElem.textContent.trim();
		console.log("Question trouvée via #question:", questionText);
		return questionText;
	}

	// Méthode 5: Parcourir tous les paragraphes et trouver celui qui a du contenu
	const allParagraphs = document.querySelectorAll("p");
	for (const p of allParagraphs) {
		const text = p.textContent.trim();
		if (text.length > 20) { // Une question a généralement plus de 20 caractères
			questionText = text;
			console.log("Question trouvée via paragraphe:", questionText);
			return questionText;
		}
	}

	// Utiliser la question stockée si disponible
	if (currentQuestionText) {
		console.log("Utilisation de la question stockée:", currentQuestionText);
		return currentQuestionText;
	}

	console.error("Conteneur de question non trouvé");
	return "";
}

// Fonction pour stocker la question actuelle dès qu'elle est détectée
function storeCurrentQuestion() {
	const questionText = getCurrentQuestion();
	if (questionText && questionText.length > 10) {
		currentQuestionText = questionText;
		console.log("Question stockée pour usage ultérieur:", currentQuestionText);
	}
}

// Fonction pour traiter le clic sur un bouton de réponse
function handleAnswerClick(value, storedQuestion = null) {
	// Utiliser la question stockée si fournie, sinon essayer de la récupérer
	const questionText = storedQuestion || currentQuestionText || getCurrentQuestion();

	if (!questionText || questionText.length < 10) {
		console.error("Question actuelle non trouvée ou vide:", questionText);
		debugPageStructure(); // Déboguer pour voir la structure de la page
		return;
	}

	console.log("Traitement de la réponse pour la question:", questionText);

	// Trouver la question correspondante dans les données
	const questionData = questionsData.find(q => q.question === questionText);

	if (!questionData) {
		console.error("Question non trouvée dans les données:", questionText);
		return;
	} else {
		console.log("Question trouvée dans les données:", questionText);
	}

	// Déterminer quelle clé de réponse utiliser en fonction de la valeur du bouton
	let userResponseKey;
	if (value === 1) {
		userResponseKey = "Absolument d'accord";
	} else if (value === 2 / 3) {
		userResponseKey = "Plutôt d'accord";
	} else if (value === 0) {
		userResponseKey = "Neutre ou hésitant";
	} else if (value === -2 / 3) {
		userResponseKey = "Plutôt pas d'accord";
	} else if (value === -1) {
		userResponseKey = "Absolument pas d'accord";
	}

	console.log("Réponse cliquée par l'utilisateur:", userResponseKey);

	// Tableau de toutes les réponses possibles
	const allResponses = [
		"Absolument d'accord",
		"Plutôt d'accord",
		"Neutre ou hésitant",
		"Plutôt pas d'accord",
		"Absolument pas d'accord"
	];

	// Structure des points à attribuer selon la réponse de l'utilisateur
	const pointsMapping = {
		"Absolument d'accord": {
			"Absolument d'accord": 2,
			"Plutôt d'accord": 1,
			"Neutre ou hésitant": 0,
			"Plutôt pas d'accord": -1,
			"Absolument pas d'accord": -2
		},
		"Plutôt d'accord": {
			"Absolument d'accord": 1,
			"Plutôt d'accord": 2,
			"Neutre ou hésitant": 0,
			"Plutôt pas d'accord": -1,
			"Absolument pas d'accord": -2
		},
		"Neutre ou hésitant": {
			"Absolument d'accord": 0,
			"Plutôt d'accord": 0,
			"Neutre ou hésitant": 2,
			"Plutôt pas d'accord": 0,
			"Absolument pas d'accord": 0
		},
		"Plutôt pas d'accord": {
			"Absolument d'accord": -2,
			"Plutôt d'accord": -1,
			"Neutre ou hésitant": 0,
			"Plutôt pas d'accord": 2,
			"Absolument pas d'accord": 1
		},
		"Absolument pas d'accord": {
			"Absolument d'accord": -2,
			"Plutôt d'accord": -1,
			"Neutre ou hésitant": 0,
			"Plutôt pas d'accord": 1,
			"Absolument pas d'accord": 2
		}
	};

	// Pour chaque type de réponse possible (Absolument d'accord, Plutôt d'accord, etc.)
	for (const responseKey of allResponses) {
		// Si des partis ont cette réponse
		if (questionData[responseKey]) {
			// Calculer les points pour cette réponse selon le choix de l'utilisateur
			const points = pointsMapping[userResponseKey][responseKey];

			// Récupérer les partis qui ont cette réponse
			const partis = questionData[responseKey].split(", ");

			console.log(`Pour les partis ${responseKey}: ${points} points`);

			// Incrémenter les compteurs pour chaque parti
			partis.forEach(parti => {
				// Remplacer les tirets par des underscores pour correspondre aux clés de l'objet scores
				const partiVar = parti.replace(/-/g, "_");
				if (scores[partiVar] !== undefined) {
					scores[partiVar] += points;
				} else {
					console.warn(`Parti inconnu: ${parti} (${partiVar})`);
				}
			});
		}
	}

	// Sauvegarder les scores mis à jour
	saveScores();

	// Afficher les scores actuels dans la console (pour le débogage)
	logScores();

	// Réinitialiser la question stockée après traitement
	currentQuestionText = "";
}

// Fonction pour afficher les scores actuels dans l'ordre décroissant
function logScores() {
	console.log("=== SCORES ACTUELS (ORDRE DÉCROISSANT) ===");

	// Convertir l'objet scores en un tableau de paires [parti, score]
	const scoresArray = Object.entries(scores);

	// Trier le tableau par score décroissant
	scoresArray.sort((a, b) => b[1] - a[1]);

	// Afficher les scores triés dans la console
	scoresArray.forEach(([parti, score]) => {
		console.log(`${parti}:`, score);
	});
}

// Fonction pour afficher les 5 partis avec les scores les plus élevés sur la page des résultats
function displayTopParties() {
	// Vérifier si nous sommes sur la page des résultats
	if (window.location.href.includes("politiscales.fr/results")) {
		console.log("Affichage des top partis sur la page de résultats");

		// Charger les scores
		loadScores();

		// Convertir l'objet scores en un tableau de paires [parti, score]
		const scoresArray = Object.entries(scores);

		// Trier le tableau par score décroissant
		scoresArray.sort((a, b) => b[1] - a[1]);

		// Prendre les 10 premiers partis (ou moins s'il y en a moins de 10)
		const topParties = scoresArray.slice(0, 10);

		// Rechercher le premier <hr> pour insérer notre contenu après
		const firstHr = document.querySelector('hr');

		if (firstHr) {
			// Vérifier si notre section existe déjà pour éviter les duplications
			const existingSection = document.getElementById('top-parties-section');
			if (existingSection) {
				existingSection.remove();
			}

			// Créer la div principale pour notre section
			const topPartiesSection = document.createElement('div');
			topPartiesSection.id = 'top-parties-section';
			topPartiesSection.style.margin = '20px auto 0 auto';
			topPartiesSection.style.padding = '10px';
			topPartiesSection.style.backgroundColor = 'none';
			topPartiesSection.style.borderRadius = '5px';
			topPartiesSection.style.width = '70%';
			topPartiesSection.style.minWidth = '500px';

			// Ajouter un titre
			const title = document.createElement('h3');
			title.textContent = 'Proximité par parti politique';
			title.style.textAlign = 'center';
			title.style.marginBottom = '15px';
			topPartiesSection.appendChild(title);

			// Créer une liste pour les partis
			const partiesList = document.createElement('div');
			partiesList.style.display = 'flex';
			partiesList.style.flexDirection = 'column';
			partiesList.style.gap = '30px';

			// Ajouter chaque parti avec sa barre de score
			topParties.forEach(([parti, score], index) => {
				// Ignorer les partis avec un score de 0
				if (score === 0) return;

				const partyRow = document.createElement('div');
				partyRow.style.display = 'flex';
				partyRow.style.alignItems = 'center';
				partyRow.style.gap = '20px';

				// Conteneur pour logo et nom
				const partyNameContainer = document.createElement('div');
				partyNameContainer.style.display = 'flex';
				partyNameContainer.style.alignItems = 'center';
				partyNameContainer.style.width = '240px';
				partyNameContainer.style.gap = '20px';

				// Position (#1, #2, etc.)
				const position = document.createElement('span');
				position.textContent = `#${index + 1}`;
				position.style.fontWeight = 'bold';
				position.style.minWidth = '35px';

				// Logo du parti
				const logoImg = document.createElement('img');
				// Convertir le nom du parti au format du fichier image (remplacer les underscore par des tirets)
				const logoFileName = parti.replace(/_/g, '-') + '.png';
				logoImg.src = chrome.runtime.getURL(`logos-partis/${logoFileName}`);
				logoImg.alt = partiNames[parti] || parti;
				logoImg.style.height = '60px'; // Hauteur fixe
				logoImg.style.width = '60px'; // Largeur fixe pour uniformité
				logoImg.style.objectFit = 'contain'; // Maintenir les proportions
				logoImg.style.display = 'block'; // Afficher comme bloc
				logoImg.style.marginRight = '10px';
				logoImg.style.marginLeft = '10px';

				// Conteneur pour le logo
				const logoContainer = document.createElement('div');
				logoContainer.style.width = '30px'; // Largeur fixe pour le conteneur
				logoContainer.style.height = '20px'; // Hauteur correspondant au logo
				logoContainer.style.display = 'flex';
				logoContainer.style.justifyContent = 'center'; // Centrer horizontalement
				logoContainer.style.alignItems = 'center'; // Centrer verticalement
				logoContainer.appendChild(logoImg);

				// En cas d'erreur de chargement du logo, masquer l'image
				logoImg.onerror = function() {
					this.style.display = 'none';
					console.warn(`Logo non trouvé pour ${parti}`);
				};

				// Nom du parti
				const partyName = document.createElement('span');
				partyName.textContent = partiNames[parti] || parti;
				partyName.style.fontWeight = index === 0 ? 'bold' : 'normal';

				// Assembler le conteneur de nom
				partyNameContainer.appendChild(position);
				partyNameContainer.appendChild(logoContainer); // Utiliser le conteneur du logo
				partyNameContainer.appendChild(partyName);

				// Barre de score
				const scoreBar = document.createElement('div');
				scoreBar.style.height = '20px';
				scoreBar.style.backgroundColor = '#ddd';
				scoreBar.style.borderRadius = '3px';
				scoreBar.style.position = 'relative';
				scoreBar.style.flex = '1';

				// Remplissage de la barre
				// Calculer le pourcentage par rapport au score maximum
				const maxScore = topParties[0][1]; // Score du parti en tête
				const fillPercentage = (score / maxScore) * 100;

				const scoreBarFill = document.createElement('div');
				scoreBarFill.style.width = `${fillPercentage}%`;
				scoreBarFill.style.height = '100%';
				scoreBarFill.style.backgroundColor = index === 0 ? '#4CAF50' : '#8BC34A';
				scoreBarFill.style.borderRadius = '3px';

				// Valeur du score
				const scoreValue = document.createElement('span');
				scoreValue.textContent = `${score} points`;
				scoreValue.style.position = 'absolute';
				scoreValue.style.right = '10px';
				scoreValue.style.top = '0';
				scoreValue.style.lineHeight = '20px';
				scoreValue.style.color = '#000';

				scoreBar.appendChild(scoreBarFill);
				scoreBar.appendChild(scoreValue);

				partyRow.appendChild(partyNameContainer);
				partyRow.appendChild(scoreBar);

				partiesList.appendChild(partyRow);
			});

			topPartiesSection.appendChild(partiesList);

			// Créer un nouveau <hr>
			const newHr = document.createElement('hr');

			// Insérer notre section après le premier <hr>
			firstHr.insertAdjacentElement('afterend', topPartiesSection);

			// Insérer le nouveau <hr> après notre section
			topPartiesSection.insertAdjacentElement('afterend', newHr);

			console.log("Section des top partis ajoutée à la page des résultats");
		} else {
			console.error("Élément <hr> non trouvé sur la page des résultats");
		}
	}
}

// Fonction pour rechercher et stocker la question actuelle à intervalles réguliers
function setupQuestionMonitoring() {
	// Vérifier périodiquement s'il y a une nouvelle question et la stocker
	const monitorInterval = setInterval(() => {
		if (window.location.href.includes("politiscales.fr/quiz")) {
			storeCurrentQuestion();
		} else {
			// Ne pas surveiller si nous ne sommes pas sur la page du quiz
			clearInterval(monitorInterval);
		}
	}, 500); // Vérifier toutes les 500 ms
}

// Fonction pour intercepter les clics sur les boutons de réponse
function setupButtonListeners() {
	// Observer pour détecter les changements de DOM
	const observer = new MutationObserver(mutations => {
		const buttons = document.querySelectorAll('button[onclick^="next_question"]');

		buttons.forEach(button => {
			// Vérifier si le bouton a déjà un écouteur personnalisé
			if (!button.hasAttribute('data-listener-added')) {
				// Obtenir le onclick original comme chaîne de texte
				const originalOnclick = button.getAttribute('onclick');

				// Extraire la valeur du bouton de l'attribut onclick original
				let value = null;
				if (originalOnclick.includes("next_question(1)")) {
					value = 1;
				} else if (originalOnclick.includes("next_question(2/3)")) {
					value = 2 / 3;
				} else if (originalOnclick.includes("next_question(0)")) {
					value = 0;
				} else if (originalOnclick.includes("next_question(-2/3)")) {
					value = -2 / 3;
				} else if (originalOnclick.includes("next_question(-1)")) {
					value = -1;
				}

				if (value !== null) {
					// Stocker la question actuelle juste avant de cliquer
					button.addEventListener('mousedown', function() {
						storeCurrentQuestion();
					}, false);

					// Ajouter notre écouteur pour capturer l'information avant le clic
					button.addEventListener('click', function(e) {
						// Utiliser la question stockée
						setTimeout(() => {
							handleAnswerClick(value);
						}, 50); // Court délai pour s'assurer que storeCurrentQuestion a bien fonctionné
					}, false);

					// Marquer le bouton comme traité
					button.setAttribute('data-listener-added', 'true');
					console.log(`Écouteur ajouté pour la valeur ${value}`);
				}
			}
		});
	});

	// Observer les changements dans le corps du document
	observer.observe(document.body, { childList: true, subtree: true });

	// Vérifier immédiatement les boutons existants
	const buttons = document.querySelectorAll('button[onclick^="next_question"]');
	if (buttons.length > 0) {
		buttons.forEach(button => {
			if (!button.hasAttribute('data-listener-added')) {
				const originalOnclick = button.getAttribute('onclick');
				let value = null;

				if (originalOnclick.includes("next_question(1)")) {
					value = 1;
				} else if (originalOnclick.includes("next_question(2/3)")) {
					value = 2 / 3;
				} else if (originalOnclick.includes("next_question(0)")) {
					value = 0;
				} else if (originalOnclick.includes("next_question(-2/3)")) {
					value = -2 / 3;
				} else if (originalOnclick.includes("next_question(-1)")) {
					value = -1;
				}

				if (value !== null) {
					button.addEventListener('mousedown', function() {
						storeCurrentQuestion();
					}, false);

					button.addEventListener('click', function(e) {
						setTimeout(() => {
							handleAnswerClick(value);
						}, 50);
					}, false);

					button.setAttribute('data-listener-added', 'true');
					console.log(`Écouteur initial ajouté pour la valeur ${value}`);
				}
			}
		});
	}
}

// Fonction pour intercepter le clic sur le bouton "Démarrer le test"
function setupStartButtonListener() {
	const startButton = document.querySelector('a.button[href="./quiz"][data-i18n="start_button"]');

	if (startButton) {
		startButton.addEventListener('click', function() {
			resetScores(); // Réinitialiser les scores à 0
		});
		console.log("Écouteur ajouté sur le bouton 'Démarrer le test'");
	}
}

// Fonction principale qui s'exécute lorsque la page est chargée
function init() {
	// Vérifier si nous sommes sur le site politiscales.fr
	if (window.location.href.includes("politiscales.fr")) {
		console.log("Extension activée sur politiscales.fr");

		// Charger les scores depuis sessionStorage
		loadScores();

		// Réinitialiser les compteurs UNIQUEMENT si nous sommes sur la page d'accueil
		if (window.location.pathname === "/" && !scoresInitialized) {
			resetScores();
		}

		// Charger les données JSON si ce n'est pas déjà fait
		if (questionsData.length === 0) {
			loadData();
		}

		// Mettre en place la surveillance des questions
		setupQuestionMonitoring();

		// Mettre en place les écouteurs de boutons
		setupButtonListeners();

		// Mettre en place l'écouteur sur le bouton "Démarrer le test"
		setupStartButtonListener();

		// Vérifier si nous sommes sur la page des résultats et afficher les top partis
		if (window.location.href.includes("politiscales.fr/results")) {
			// Attendre un peu pour s'assurer que la page est complètement chargée
			setTimeout(displayTopParties, 500);
		}

		// Débogage initial de la structure de la page
		if (window.location.href.includes("politiscales.fr/quiz")) {
			setTimeout(debugPageStructure, 1000);
		}
	}
}

// Exécuter notre script lors du chargement complet de la page
window.addEventListener('load', init);

// Réexécuter à chaque changement de page
window.addEventListener('popstate', function() {
	init();
	// Si nous arrivons sur la page des résultats après navigation
	if (window.location.href.includes("politiscales.fr/results")) {
		setTimeout(displayTopParties, 500);
	}
});