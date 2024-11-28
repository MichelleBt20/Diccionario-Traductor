
const wordInput = document.getElementById("wordInput");
const languageSelect = document.getElementById("languageSelect");
const translateButton = document.getElementById("translateButton");
const translationResult = document.getElementById("translationResult");
const dictionaryTable = document.querySelector("#dictionaryTable tbody");
const addWordForm = document.getElementById("addWordForm");
const categoryFilters = document.getElementsByName("category");


function displayDictionary(category = "all", sortBy = "english") {
  dictionaryTable.innerHTML = ""; 

  const entries = Object.entries(dictionary.categories)
    .filter(([key]) => category === "all" || key === category)
    .flatMap(([_, words]) => words);

  const sortedEntries = entries.sort((a, b) =>
    a[sortBy].localeCompare(b[sortBy])
  );

  sortedEntries.forEach(word => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${word.english}</td><td>${word.spanish}</td><td>${word.example}</td>`;
    dictionaryTable.appendChild(row);
  });
}

translateButton.addEventListener("click", () => {
  const input = wordInput.value.trim();
  const lang = languageSelect.value;

  if (!input) {
    translationResult.textContent = "Por favor, escribe una palabra.";
    return;
  }

  let result = null;
  for (const category in dictionary.categories) {
    const word = dictionary.categories[category].find(word =>
      lang === "enToEs" ? word.english.toLowerCase() === input.toLowerCase() : word.spanish.toLowerCase() === input.toLowerCase()
    );
    if (word) {
      result = lang === "enToEs" ? word.spanish : word.english;
      break;
    }
  }

  translationResult.textContent = result
    ? `Traducción: ${result}`
    : "Palabra no encontrada.";
});

addWordForm.addEventListener("submit", event => {
  event.preventDefault();

  const english = document.getElementById("newWordEnglish").value.trim();
  const spanish = document.getElementById("newWordSpanish").value.trim();
  const example = document.getElementById("newWordExample").value.trim();
  const category = document.getElementById("newWordCategory").value;

  if (!english || !spanish || !example) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const newWord = {
    id: Date.now(),
    english,
    spanish,
    example,
  };

  dictionary.categories[category].push(newWord);
  displayDictionary();
  addWordForm.reset();
});

document.getElementById("sortEnglish").addEventListener("click", () => displayDictionary(undefined, "english"));
document.getElementById("sortSpanish").addEventListener("click", () => displayDictionary(undefined, "spanish"));

categoryFilters.forEach(radio => {
  radio.addEventListener("change", () => displayDictionary(radio.value));
});

displayDictionary();
