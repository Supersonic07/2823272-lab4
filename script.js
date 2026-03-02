const searchBtn = document.getElementById("search-btn");
const countryInput = document.getElementById("country-input");
const countryInfo = document.getElementById("country-info");
const bordersContainer = document.getElementById("bordering-countries");
const spinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

// Main search function
async function searchCountry(countryName) {
    try {
        // Clear previous results
        countryInfo.innerHTML = "";
        bordersContainer.innerHTML = "";
        errorMessage.classList.add("hidden");

        // Show spinner
        spinner.classList.remove("hidden");

        // Fetch country data
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );

        if (!response.ok) {
            throw new Error("Country not found. Please try again.");
        }

        const data = await response.json();
        const country = data[0];

        // Update country info
        countryInfo.innerHTML = `
            <div class="country-card">
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
            </div>
        `;

        // Fetch bordering countries if they exist
        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(
                    `https://restcountries.com/v3.1/alpha/${code}`
                );
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderCard = document.createElement("div");
                borderCard.classList.add("country-card");
                borderCard.innerHTML = `
                    <h4>${borderCountry.name.common}</h4>
                    <img src="${borderCountry.flags.svg}" 
                         alt="${borderCountry.name.common} flag" 
                         width="80">
                `;
                bordersContainer.appendChild(borderCard);
            }
        } else {
            bordersContainer.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");
    } finally {
        // Hide spinner
        spinner.classList.add("hidden");
    }
}

// Button click event
searchBtn.addEventListener("click", () => {
    const country = countryInput.value.trim();
    if (country) {
        searchCountry(country);
    }
});

// Enter key event
countryInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const country = countryInput.value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});