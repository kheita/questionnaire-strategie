// Questions du questionnaire
const questions = [
    {
        question: "Quelle est la taille de votre entreprise ?",
        options: [
            "Moins de 10 employés",
            "10 à 49 employés",
            "50 à 249 employés",
            "250 employés ou plus"
        ]
    },
    {
        question: "Dans quel secteur d'activité opérez-vous principalement ?",
        options: [
            "Services",
            "Commerce",
            "Industrie",
            "Technologies",
            "Autre"
        ]
    },
    {
        question: "Quel est votre principal objectif stratégique actuel ?",
        options: [
            "Croissance du chiffre d'affaires",
            "Amélioration de la rentabilité",
            "Innovation produit/service",
            "Expansion géographique",
            "Transformation digitale"
        ]
    },
    {
        question: "Comment évaluez-vous votre position concurrentielle actuelle ?",
        options: [
            "Leader sur notre marché",
            "Parmi les acteurs majeurs",
            "Position moyenne",
            "Position faible",
            "Nouveau sur le marché"
        ]
    },
    {
        question: "Quel est le niveau de maturité digitale de votre entreprise ?",
        options: [
            "Très avancé",
            "En cours de transformation",
            "Début de transformation",
            "Peu ou pas digitalisé"
        ]
    }
];

let currentQuestion = 0;
const answers = [];

// Initialisation du questionnaire
window.onload = function() {
    displayQuestion();
    updateProgress();
};

// Affichage de la question courante
function displayQuestion() {
    const questionnaireDiv = document.getElementById('questionnaire');
    const question = questions[currentQuestion];
    
    let html = `
        <div class="question-container active">
            <div class="question">${question.question}</div>
            <div class="options">
    `;
    
    question.options.forEach((option, index) => {
        const selected = answers[currentQuestion] === index ? 'selected' : '';
        html += `
            <div class="option ${selected}" onclick="selectOption(${index})">
                ${option}
            </div>
        `;
    });
    
    html += '</div></div>';
    questionnaireDiv.innerHTML = html;
    
    // Mise à jour des boutons
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').innerHTML = 
        currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant';
}

// Sélection d'une option
function selectOption(index) {
    answers[currentQuestion] = index;
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
}

// Navigation entre les questions
function nextQuestion() {
    if (answers[currentQuestion] === undefined) {
        alert('Veuillez sélectionner une réponse avant de continuer.');
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
        updateProgress();
    } else {
        showEmailForm();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        updateProgress();
    }
}

// Mise à jour de la barre de progression
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

// Affichage du formulaire email
function showEmailForm() {
    document.getElementById('questionnaire').style.display = 'none';
    document.getElementById('email-form').style.display = 'block';
    document.querySelector('.navigation').style.display = 'none';
}

// Génération des recommandations basées sur les réponses
function generateRecommendations() {
    let recommendations = [];
    
    // Taille de l'entreprise
    if (answers[0] <= 1) {
        recommendations.push("Pour une petite structure, concentrez-vous sur la consolidation de votre position et l'optimisation des ressources.");
    } else {
        recommendations.push("Votre taille vous permet d'envisager des projets d'envergure et d'investir dans l'innovation.");
    }
    
    // Secteur d'activité et objectif stratégique
    if (answers[2] === 4) { // Transformation digitale
        recommendations.push("Priorisez l'adoption d'outils numériques et la formation de vos équipes aux nouvelles technologies.");
    } else if (answers[2] === 0) { // Croissance CA
        recommendations.push("Développez votre force commerciale et investissez dans le marketing digital.");
    }
    
    // Position concurrentielle
    if (answers[3] <= 1) {
        recommendations.push("Maintenez votre avantage concurrentiel en innovant constamment et en restant à l'écoute du marché.");
    } else {
        recommendations.push("Identifiez des niches de marché et différenciez-vous par la qualité de service ou l'innovation.");
    }
    
    // Maturité digitale
    if (answers[4] >= 2) {
        recommendations.push("Accélérez votre transformation digitale en commençant par les processus critiques.");
    }
    
    return recommendations;
}

// Génération et téléchargement du PDF
function generatePDF() {
    const email = document.getElementById('email').value;
    if (!email || !email.includes('@')) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('Rapport Stratégique Personnalisé', 20, 20);
    
    // Informations générales
    doc.setFontSize(12);
    doc.text('Date du diagnostic : ' + new Date().toLocaleDateString(), 20, 40);
    doc.text('Email : ' + email, 20, 50);
    
    // Réponses au questionnaire
    doc.setFontSize(14);
    doc.text('Vos réponses :', 20, 70);
    
    let yPos = 90;
    questions.forEach((q, index) => {
        doc.setFontSize(12);
        doc.text(q.question, 20, yPos);
        doc.setFontSize(10);
        doc.text('→ ' + q.options[answers[index]], 30, yPos + 10);
        yPos += 30;
    });
    
    // Recommandations
    doc.setFontSize(14);
    doc.text('Nos recommandations :', 20, yPos);
    
    const recommendations = generateRecommendations();
    yPos += 20;
    
    recommendations.forEach(rec => {
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(rec, 170);
        doc.text(lines, 20, yPos);
        yPos += 10 * lines.length + 5;
    });
    
    // Pied de page
    doc.setFontSize(8);
    doc.text('Document généré automatiquement - Confidentiel', 20, 280);
    
    // Téléchargement
    doc.save('rapport-strategique.pdf');
} 