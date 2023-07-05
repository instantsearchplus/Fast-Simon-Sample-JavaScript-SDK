//Get all categories
function renderCategoriesMenu() {
    window.FastSimonSDK.getAllCategories((response) => {
        console.log(response);
        // Assuming there's a container element in your HTML to hold the buttons
        const container = document.getElementById('button-container');

        // Iterate over the response array and create buttons
        response.forEach(item => {
            const collectionButton = document.createElement('button');
            collectionButton.classList.add('fs_collections_btn');
            if(item.l == 'all-products') {
                collectionButton.textContent = 'All products';
            } else if(item.l == 'vertical-layout') {
                collectionButton.textContent = 'Vertical layout';
            } else {
                collectionButton.textContent = item.l;
            }
            collectionButton.setAttribute('id', item.id);
            collectionButton.addEventListener('click', function (event) {
                console.log('collection btn clicked');
                event.preventDefault();
                collectionID = collectionButton.getAttribute("id");
                searchResultsContainer.classList.add('fs_collections');
                if (searchResultsContainer.classList.contains('fs_search')) {
                    searchResultsContainer.classList.remove('fs_search');
                }
                currentNarrow = [];
                clearFilters();
                setUrlParam('collectionID', collectionID, true);
            });

            // Add the button to the container
            container.appendChild(collectionButton);
        });
    }, true);
};

function clearFilters() {
    url.searchParams.delete('color');
    url.searchParams.delete('min_price');
    url.searchParams.delete('max_price');
    url.searchParams.delete('checkboxState');
    url.searchParams.delete(filtersUrlParam);
    url.searchParams.delete('size');
    url.searchParams.delete('search');
    url.searchParams.delete('page');
    url.searchParams.delete('collectionID');
    url.searchParams.delete('sortBy');
    searchInput.value = '';
}