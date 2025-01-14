// Domyślne kategorie
let categories = [
    { name: 'Jedzenie', sum: 0, entries: [] },
    { name: 'Transport', sum: 0, entries: [] },
    { name: 'Rozrywka', sum: 0, entries: [] }
];

// Funkcja do zapisywania danych w LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Funkcja do ładowania danych z LocalStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('categories');
    if (savedData) {
        categories = JSON.parse(savedData);
    }
}

// Funkcja do czyszczenia danych
function clearData() {
    if (confirm("Czy na pewno chcesz wyczyścić wszystkie dane?")) {
        // Usuń dane z LocalStorage
        localStorage.removeItem('categories');

        // Przywróć domyślne kategorie
        categories = [
            { name: 'Jedzenie', sum: 0, entries: [] },
            { name: 'Transport', sum: 0, entries: [] },
            { name: 'Rozrywka', sum: 0, entries: [] }
        ];

        // Zaktualizuj interfejs
        initializeCategories();
        alert("Dane zostały wyczyszczone.");
    }
}

// Funkcja inicjalizująca kategorie
function initializeCategories() {
    const categorySelect = document.getElementById('category');
    const categoriesContainer = document.getElementById('categories-container');

    // Wyczyszczenie istniejących elementów
    categorySelect.innerHTML = '';
    categoriesContainer.innerHTML = '';

    categories.forEach(category => {
        // Dodanie kategorii do <select>
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);

        // Dodanie tabeli dla kategorii
        const categoryDiv = document.createElement('div');
        categoryDiv.id = `category-${category.name}`;
        categoryDiv.innerHTML = `
            <h3>${category.name}</h3>
            <button class="edit-name-button" onclick="editCategoryName('${category.name}')">Edytuj nazwę</button> <!-- Dodajemy przycisk "Edytuj nazwę" -->
            <table border="1" id="table-${category.name}">
                <thead>
                    <tr>
                        <th>Opis</th>
                        <th>Wartość</th>
                        <th class="actions-column">Akcje</th> <!-- Kolumna Akcje z klasą -->
                    </tr>
                </thead>
                <tbody>
                    <!-- Wiersze dla wpisów -->
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Suma</strong></td>
                        <td id="sum-${category.name}">0</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        `;
        categoriesContainer.appendChild(categoryDiv);

        // Wypełnij tabelę wpisami
        const tableBody = document.getElementById(`table-${category.name}`).querySelector('tbody');
        category.entries.forEach((entry, entryIndex) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.description}</td>
                <td>${entry.value}</td>
                <td><button class="delete-button" onclick="deleteEntry('${category.name}', ${entryIndex})">Usuń</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Zaktualizuj sumę dla kategorii
        document.getElementById(`sum-${category.name}`).textContent = category.sum;
    });

    // Ukryj wszystkie przyciski "Usuń" oraz kolumnę "Akcje"
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.style.display = 'none';
    });

    const actionsColumn = document.querySelectorAll('.actions-column');
    actionsColumn.forEach(col => {
        col.style.display = 'none'; // Ukrywa całą kolumnę Akcje
    });

    const editNameButtons = document.querySelectorAll('.edit-name-button');
    editNameButtons.forEach(button => {
        button.style.display = 'none';
    });

    updateTotalSum();
}

// Funkcja do wyświetlania lub ukrywania przycisków "Usuń" oraz kolumny "Akcje"
function toggleDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    const actionsColumn = document.querySelectorAll('.actions-column');
    const editNameButtons = document.querySelectorAll('.edit-name-button');

    // Pokazuje lub ukrywa przyciski "Usuń" oraz kolumnę "Akcje"
    deleteButtons.forEach(button => {
        if (button.style.display === 'none') {
            button.style.display = 'inline';  // Pokazuje przyciski "Usuń"
        } else {
            button.style.display = 'none';  // Ukrywa przyciski "Usuń"
        }
    });

    actionsColumn.forEach(col => {
        if (col.style.display === 'none') {
            col.style.display = 'table-cell'; // Pokazuje kolumnę "Akcje"
        } else {
            col.style.display = 'none'; // Ukrywa kolumnę "Akcje"
        }
    });

    editNameButtons.forEach(button => {
        if (button.style.display === 'none') {
            button.style.display = 'inline';  // Pokazuje przyciski "Edytuj nazwę"
        } else {
            button.style.display = 'none';  // Ukrywa przyciski "Edytuj nazwę"
        }
    });
}

// Funkcja do usuwania wpisu z kategorii
function deleteEntry(categoryName, entryIndex) {
    const category = categories.find(cat => cat.name === categoryName);

    // Pytanie o potwierdzenie przed usunięciem
    if (confirm("Czy na pewno chcesz usunąć ten wpis?")) {
        // Usunięcie wpisu z kategorii
        category.entries.splice(entryIndex, 1);
        category.sum = category.entries.reduce((sum, entry) => sum + entry.value, 0);

        // Zaktualizowanie tabeli
        initializeCategories();

        // Zaktualizowanie całkowitej sumy
        updateTotalSum();

        // Zapisz dane do LocalStorage
        saveToLocalStorage();
    }
}

// Funkcja aktualizująca całkowitą sumę wartości
function updateTotalSum() {
    const totalSum = categories.reduce((sum, category) => sum + category.sum, 0);
    document.getElementById('total-sum').textContent = totalSum;
}

// Funkcja do edytowania nazwy kategorii
function editCategoryName(categoryName) {
    const category = categories.find(cat => cat.name === categoryName);

    // Ukryj przycisk "Edytuj nazwę" i pokaż pole do edycji
    const categoryDiv = document.getElementById(`category-${categoryName}`);
    const editButton = categoryDiv.querySelector('.edit-name-button');
    editButton.style.display = 'none'; // Ukryj przycisk edycji nazwy

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = category.name;
    categoryDiv.insertBefore(inputField, categoryDiv.querySelector('table')); // Wstaw pole przed tabelą

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Zapisz';
    saveButton.onclick = () => saveCategoryName(categoryName, inputField.value);
    categoryDiv.appendChild(saveButton);
}

// Funkcja do zapisania nowej nazwy kategorii
function saveCategoryName(oldName, newName) {
    const category = categories.find(cat => cat.name === oldName);

    // Jeśli nowa nazwa jest pusta lub już istnieje, przerwij
    if (!newName.trim() || categories.some(cat => cat.name === newName)) {
        alert("Nazwa kategorii jest pusta lub już istnieje!");
        return;
    }

    // Zaktualizowanie nazwy kategorii
    category.name = newName;

    // Zaktualizowanie interfejsu
    initializeCategories();

    // Zapisz dane do LocalStorage
    saveToLocalStorage();
}

// Funkcja dodająca nową kategorię
function addCategory() {
    const newCategory = document.getElementById('new-category').value.trim();

    if (!newCategory) {
        alert("Nazwa kategorii nie może być pusta!");
        return;
    }

    if (categories.some(cat => cat.name === newCategory)) {
        alert("Kategoria o takiej nazwie już istnieje!");
        return;
    }

    // Dodanie nowej kategorii
    categories.unshift({ name: newCategory, sum: 0, entries: [] });

    // Zaktualizuj interfejs
    initializeCategories();

    // Zapisz dane do LocalStorage
    saveToLocalStorage();

    // Wyczyść pole nowej kategorii
    document.getElementById('new-category').value = '';
}

// Funkcja dodająca wartość do kategorii
function addValue() {
    const category = document.getElementById('category').value;
    const value = parseFloat(document.getElementById('value').value);
    const description = document.getElementById('description').value;

    if (!category || isNaN(value) || !description) {
        alert("Proszę uzupełnić wszystkie pola!");
        return;
    }

    // Znalezienie kategorii i dodanie wpisu
    const categoryObj = categories.find(cat => cat.name === category);
    categoryObj.entries.push({ description, value });
    categoryObj.sum += value;

    // Zaktualizuj tabelę dla kategorii
    const tableBody = document.getElementById(`table-${category}`).querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${description}</td>
        <td>${value}</td>
        <td><button onclick="deleteEntry('${category}', ${categoryObj.entries.length - 1})">Usuń</button></td>
    `;
    tableBody.appendChild(row);

    // Zaktualizuj sumę dla kategorii
    document.getElementById(`sum-${category}`).textContent = categoryObj.sum;

    // Zaktualizuj całkowitą sumę
    updateTotalSum();

    // Zapisz dane do LocalStorage
    saveToLocalStorage();

    // Wyczyść formularz
    document.getElementById('value').value = '';
    document.getElementById('description').value = '';
}


// Funkcja generująca plik Excel
function generateExcel() {
    const excelData = [];
    const maxEntries = Math.max(...categories.map(cat => cat.entries.length));

    // Przygotuj dane dla każdej kategorii w osobnej kolumnie
    for (let rowIndex = 0; rowIndex <= maxEntries; rowIndex++) {
        const row = [];

        categories.forEach((category, index) => {
            if (rowIndex === 0) {
                // Nagłówek z nazwą kategorii (zamień na wielkie litery)
                row.push(category.name.toUpperCase(), '');  // Pusta komórka po nazwie kategorii
            } else if (rowIndex <= category.entries.length) {
                // Dane dla wpisu (opis, wartość)
                const entry = category.entries[rowIndex - 1];
                row.push(entry.description, entry.value);
            } else {
                // Puste pola
                row.push('', '');
            }

            // Dodaj pustą kolumnę (odstęp) między kategoriami, ale nie po ostatniej
            if (index < categories.length - 1) {
                row.push('');
            }
        });

        excelData.push(row);
    }

    // Dodaj pusty wiersz przed sumami (jedna kratka niżej)
    const emptyRow = Array(categories.length * 2 + categories.length - 1).fill('');
    excelData.push(emptyRow);

    // Dodaj wiersz z sumami na końcu (zamień sumy na wielkie litery)
    const sumRow = [];
    categories.forEach((category, index) => {
        sumRow.push('Suma', category.sum);
        if (index < categories.length - 1) {
            sumRow.push('');
        }
    });
    excelData.push(sumRow);

    // Oblicz całkowitą sumę wszystkich kategorii
    const totalSum = categories.reduce((sum, category) => sum + category.sum, 0);

    // Dodaj pusty wiersz przed całkowitą sumą (dwa kratki niżej)
    const emptyRow2 = Array(categories.length * 2 + categories.length - 1).fill('');
    excelData.push(emptyRow2);

    // Dodaj wiersz z całkowitą sumą (zamień na wielkie litery)
    const totalSumRow = ['CAŁKOWITA SUMA', totalSum];
    excelData.push(totalSumRow);

    // Tworzenie arkusza
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dane");

    // Ustawianie szerokości kolumn
    const colWidths = [];
    // Szerokości kolumn dla opisów, wartości i odstępów między kategoriami
    const categoryCount = categories.length;

    for (let i = 0; i < categoryCount * 2 + categoryCount - 1; i++) {
        if (i % 3 === 0) { // Kolumny z opisami (szerokość 100)
            colWidths.push({ wpx: 100 });
        } else if (i % 3 === 1) { // Kolumny z wartościami (szerokość 40)
            colWidths.push({ wpx: 40 });
        } else { // Kolumny z odstępem między kategoriami (szerokość 20)
            colWidths.push({ wpx: 20 });
        }
    }

    worksheet["!cols"] = colWidths; // Ustawienie szerokości kolumn w arkuszu

    // Generowanie i pobieranie pliku Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'zaktualizowane_dane.xlsx');
}


// Inicjalizacja po załadowaniu strony
window.onload = () => {
    loadFromLocalStorage();
    initializeCategories();

    // Obsługa przycisku czyszczenia danych
    document.getElementById('clear-data-button').addEventListener('click', clearData);

    // Obsługa przycisku edytowania listy
    document.getElementById('edit-list-button').addEventListener('click', toggleDeleteButtons);
};

// Funkcja do aktualizacji wyświetlanego czasu
function updateTimeStatus() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 23, 45, 0);
    const timeLeft = nextMonth - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('current-time').textContent = `Aktualna data i godzina: ${now.toLocaleString()}`;
    document.getElementById('time-left').textContent = `Pozostały czas do generacji: ${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (timeLeft <= 0) {
        // Jeśli czas się skończył, wykonaj automatyczne pobieranie i czyszczenie
        generateExcel();
        clearData();
    }
}

// Inicjalizacja odświeżania czasu co sekundę
setInterval(updateTimeStatus, 1000);
