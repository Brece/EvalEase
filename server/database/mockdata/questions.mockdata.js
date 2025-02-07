const questions = [
    {
      _id: 1,
      text: "Wie zufrieden sind Sie mit der Benutzerfreundlichkeit der Software?",
      type: "rating", // Fragetyp: Bewertung
      options: [1, 2, 3, 4, 5], // Bewertungsskala von 1 bis 5
      headlineId: 1
    },
    {
      _id: 2,
      text: "Welche Features würden Sie gerne in zukünftigen Versionen sehen?",
      type: "text", // Fragetyp: Freitext
      options: null, // Keine vordefinierten Optionen
      headlineId: 1
    },
    {
      _id: 3,
      text: "Wie oft nutzen Sie die Software?",
      type: "multiple-choice",
      options: [
        "Täglich",
        "Mehrmals pro Woche",
        "Einmal pro Woche",
        "Seltener"
      ],
      headlineId: 1
    },
    {
      _id: 4,
      text: "Welche Funktion ist für Sie am wichtigsten?",
      type: "multiple-choice",
      options: [
        "Schnelle Ladezeiten",
        "Einfache Bedienung",
        "Gutes Design",
        "Umfangreiche Features"
      ],
      headlineId: 1
    },
    {
      _id: 5,
      text: "Würden Sie die Software weiterempfehlen?",
      type: "yes-no", // Fragetyp: Ja/Nein
      options: ["Ja", "Nein"],
      headlineId: 1
    },
    {
      _id: 6,
      text: "Das ist eine Frage?",
      type: "multiple-choice", // Fragetyp: Mehrfachauswahl
      options: [
        "Stimme voll zu",
        "",
        "Neutral",
        " ",
        "Stimme überhaupt nicht zu"
      ],
      headlineId: 1
    },
    {
      _id: 7,
      text: "Das ist eine Frage?",
      type: "multiple-choice", // Fragetyp: Mehrfachauswahl
      options: [
        "Stimme voll zu",
        "",
        "Neutral",
        " ",
        "Stimme überhaupt nicht zu"
      ],
      headlineId: 1
    },
    {
      _id: 8,
      text: "Das ist eine Frage?",
      type: "multiple-choice", // Fragetyp: Mehrfachauswahl
      options: [
        "Stimme voll zu",
        "",
        "Neutral",
        " ",
        "Stimme überhaupt nicht zu"
      ],
      headlineId: 2
    },
    {
      _id: 9,
      text: "Das ist eine Frage?",
      type: "multiple-choice", // Fragetyp: Mehrfachauswahl
      options: [
        "Stimme voll zu",
        "",
        "Neutral",
        " ",
        "Stimme überhaupt nicht zu"
      ],
      headlineId: 2
    },
    {
      _id: 10,
      text: "Würden Sie die Software weiterempfehlen?",
      type: "yes-no", // Fragetyp: Ja/Nein
      options: ["Ja", "Nein"],
      headlineId: 3
    },
    {
      _id: 11,
      text: "Das ist eine Frage?",
      type: "multiple-choice", // Fragetyp: Mehrfachauswahl
      options: [
        "Stimme voll zu",
        "",
        "Neutral",
        " ",
        "Stimme überhaupt nicht zu"
      ],
      headlineId: 3
    },
    {
      _id: 12,
      text: "Was hat Ihnen gefallen?",
      type: "text", // Fragetyp: Freitext
      options: null, // Keine vordefinierten Optionen
      headlineId: 1
    },
    {
      _id: 13,
      text: "Was hat Ihnen nicht gefallen?",
      type: "text", // Fragetyp: Freitext
      options: null, // Keine vordefinierten Optionen
      headlineId: 1
    }
  ];
  
  export default questions;