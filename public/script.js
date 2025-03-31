document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const postcodeInput = document.getElementById('postcode-input');
    const searchButton = document.getElementById('search-button');
    const samplePostcodesContainer = document.getElementById('sample-postcodes-container');
    const errorContainer = document.getElementById('error-container');
    const restaurantsContainer = document.getElementById('restaurants-container');
    const loadingContainer = document.getElementById('loading-container');
    
    searchForm.addEventListener('submit', handleSearch);
    
    samplePostcodesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('postcode-chip')) {
            postcodeInput.value = e.target.textContent;
            searchForm.dispatchEvent(new Event('submit'));
        }
    });
    
    async function handleSearch(e) {
        e.preventDefault();
        
        const postcode = postcodeInput.value.trim();
        if (!postcode) return;
        
        showLoading(true);
        clearResults();
        
        try {
            const restaurants = await fetchRestaurants(postcode);
            
            if (restaurants.length === 0) {
                showNoResultsMessage();
            } else {
                displayRestaurants(restaurants);
            }
        } catch (error) {
            showError(error.message);
        } finally {
            showLoading(false);
        }
    }
    
    async function fetchRestaurants(postcode) {
        const formattedPostcode = postcode.replace(/\s/g, '');
        const response = await fetch(`/api/restaurants/${formattedPostcode}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to fetch data (${response.status}): ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        const restaurantData = data.restaurants
            .map(restaurant => ({
                name: restaurant.name,
                cuisines: restaurant.cuisines.map(cuisine => cuisine.name).join(', '),
                rating: restaurant.rating.starRating,
                address: `${restaurant.address.firstLine}, ${restaurant.address.city}, ${restaurant.address.postalCode}`
            }))
            .slice(0, 10);
        
        return restaurantData;
    }
    
    function displayRestaurants(restaurants) {
        const resultsTitle = document.createElement('h2');
        resultsTitle.className = 'results-title';
        resultsTitle.textContent = `Restaurants (${restaurants.length})`;
        const restaurantGrid = document.createElement('div');
        restaurantGrid.className = 'restaurant-grid';
        
        restaurants.forEach(restaurant => {
            const card = createRestaurantCard(restaurant);
            restaurantGrid.appendChild(card);
        });
        
        restaurantsContainer.appendChild(resultsTitle);
        restaurantsContainer.appendChild(restaurantGrid);
    }
    
    function createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        const name = document.createElement('h3');
        name.className = 'restaurant-name';
        name.textContent = restaurant.name;
        
        const cuisinesDetail = createDetailElement(
            'coffee',
            'Cuisines',
            restaurant.cuisines
        );
        
        const ratingDetail = createDetailElement(
            'star',
            'Rating',
            restaurant.rating
        );
        
        const addressDetail = createDetailElement(
            'map-pin',
            'Address',
            restaurant.address
        );
        
        cardBody.appendChild(name);
        cardBody.appendChild(cuisinesDetail);
        cardBody.appendChild(ratingDetail);
        cardBody.appendChild(addressDetail);
        card.appendChild(cardBody);
        
        return card;
    }
    
    function createDetailElement(iconName, label, value) {
        const detail = document.createElement('div');
        detail.className = 'restaurant-detail';
        const icon = document.createElement('div');
        icon.className = 'detail-icon';
        icon.innerHTML = getIconSvg(iconName);
        const content = document.createElement('div');
        content.className = 'detail-content';
        const labelElement = document.createElement('p');
        labelElement.className = 'detail-label';
        labelElement.textContent = label;
        const valueElement = document.createElement('p');
        valueElement.textContent = value;
        content.appendChild(labelElement);
        content.appendChild(valueElement);
        detail.appendChild(icon);
        detail.appendChild(content);
        
        return detail;
    }
    
    function getIconSvg(name) {
        const icons = {
            'coffee': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" x2="6" y1="2" y2="4"></line><line x1="10" x2="10" y1="2" y2="4"></line><line x1="14" x2="14" y1="2" y2="4"></line></svg>',
            'star': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
            'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
        };
        
        return icons[name] || '';
    }
    
    function showError(message) {
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-error';
        errorAlert.innerHTML = `
            <p><strong>Error</strong></p>
            <p>${message}</p>
        `;
        
        errorContainer.appendChild(errorAlert);
    }
    
    function showNoResultsMessage() {
        const infoAlert = document.createElement('div');
        infoAlert.className = 'alert alert-info';
        infoAlert.innerHTML = `
            <p><strong>No restaurants found</strong></p>
            <p>Try another postcode from the list above.</p>
        `;
        
        errorContainer.appendChild(infoAlert);
    }
    
    function showLoading(isLoading) {
        if (isLoading) {
            loadingContainer.style.display = 'flex';
            searchButton.disabled = true;
        } else {
            loadingContainer.style.display = 'none';
            searchButton.disabled = false;
        }
    }
    
    function clearResults() {
        errorContainer.innerHTML = '';
        restaurantsContainer.innerHTML = '';
    }
});