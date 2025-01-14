/* <div id="status-container">
<p id="current-time">Aktualna data i godzina: </p>
<p id="time-left">Pozostały czas do generacji: </p>
</div> */
// Funkcja planowania automatycznego czyszczenia
function scheduleMonthlyReset() {
    const now = new Date();
    const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1, 23, 45, 0);

    const timeUntilReset = nextMonthReset - now;

    setTimeout(() => {
        generateExcel();
        clearData();
        alert("Dane zostały zapisane i wyczyszczone automatycznie!");
        scheduleMonthlyReset(); // Zaplanuj ponownie dla kolejnego miesiąca
    }, timeUntilReset);
}

// Uruchomienie planowania przy starcie aplikacji
scheduleMonthlyReset();

////////////////////
// <button id="clear-data-btn">Wyczyść dane</button>
// Funkcja do czyszczenia danych i ciasteczek
function clearData() {
    categories = [];
    document.cookie = "categories=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    initializeCategories();
    alert("Dane zostały wyczyszczone!");
}

// Obsługa kliknięcia przycisku do czyszczenia danych
document.getElementById('clear-data-btn').addEventListener('click', clearData);


// local storage 
// Obsługa przycisku czyszczenia danych
document.getElementById('clear-data-button').addEventListener('click', clearData);
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