//Autocomplete
const searchInput = document.getElementById('searchInput');
searchInput.value = isSearchPage();

searchInput.addEventListener('input', function (event) {
    const searchTerm = event.target.value;
    // Use the following code for every keystroke shoppers perform in a searchbox.
    window.FastSimonSDK.instantSearch({
        query: searchTerm,
        callback: (response) => {
            console.log(response);
            displayAutocomplete(response.payload, searchTerm);
        }
    });
    console.log(searchTerm);
});
let linksContainer = document.createElement('div');
function displayAutocomplete(response, searchTerm) {
    productList.innerHTML = '';
    linksContainer.innerHTML = '';
    turboLinkUrl = false;
    // Add products to the modal
    response.products.forEach(function (product) {
        // Create a container for each product
        const productContainer = document.createElement('li');
        productContainer.classList.add('fs_product_ac');

        // Add product information to the container
        const productImage = document.createElement('img');
        productImage.classList.add('fs_product_image_ac');
        // product.t is an image URL
        if (product.t) {
            productImage.src = product.t;
        } else {
            productImage.src = 'https://acp-magento.appspot.com/images/missing.gif';
        }

        productContainer.appendChild(productImage);

        //title
        if (product.l) {
            const productName = document.createElement('h3');
            productName.classList.add('fs_product_title_ac');
            productName.textContent = product.l;
            productContainer.appendChild(productName);
        }

        //price
        if (product.p && product.c) {
            const productPrice = document.createElement('span');
            productPrice.classList.add('fs_product_price_ac');
            productPrice.textContent = `${product.p}`;
            if (product.c == 'USD') {
                productPrice.innerText = `$${productPrice.innerText}`;
            }
            productContainer.appendChild(productPrice);
        }

        //compare price
        if (product.p_c && product.p_c > 0 && product.c) {
            const productComparePrice = document.createElement('span');
            productComparePrice.classList.add('fs_product_compare_price_ac');
            productComparePrice.textContent = `${product.p_c}`;
            if (product.c == 'USD') {
                productComparePrice.innerText = `$${productComparePrice.innerText}`;
            }
            productContainer.appendChild(productComparePrice);
        }


        // Append the product container to the search results container
        productList.appendChild(productContainer);
    });

    //add links to the modal
    if (response.categories.length > 0 || response.popularSearches.length > 0 || response.turbolinks.length > 0) {

        linksContainer.classList.add('fs_links_container');
        productModal.querySelector('.modal-content').appendChild(linksContainer);

        //collections links
        if (response.categories.length > 0) {
            let collectionLinks = document.createElement('div');
            collectionLinks.classList.add('fs_autocomplete_links', 'fs_collection_links');
            let collectionLinksTitle = document.createElement('div');
            collectionLinksTitle.classList.add('fs_autocomplete_links_title', 'fs_collection_links_title');
            collectionLinksTitle.innerText = 'collections:';
            collectionLinks.appendChild(collectionLinksTitle);
            let counter = 0;
            response.categories.forEach(category => {
                if (counter < 3) {
                    let collectionLink = document.createElement('div');
                    collectionLink.classList.add('fs_autocomplete_link', 'fs_collection_link');
                    collectionLink.innerText = category.l;
                    collectionLink.setAttribute('id', category.id);
                    collectionLink.addEventListener('click', function (event) {
                        console.log('collection btn clicked');
                        event.preventDefault();
                        collectionID = collectionLink.getAttribute("id");
                        searchResultsContainer.classList.add('fs_collections');
                        if (searchResultsContainer.classList.contains('fs_search')) {
                            searchResultsContainer.classList.remove('fs_search');
                        }
                        clearFilters();
                        setUrlParam('collectionID', collectionID);
                    });
                    collectionLinks.appendChild(collectionLink);
                    counter++;
                }
            });
            linksContainer.appendChild(collectionLinks);
        }

        //popular searches links
        if (response.popularSearches.length > 0) {
            // let popularSearchesLinks = document.createElement('div');
            // popularSearchesLinks.classList.add('fs_autocomplete_links', 'fs_popular_links');
            // let popularSearchesLinksTitle = document.createElement('div');
            // popularSearchesLinksTitle.classList.add('fs_autocomplete_links_title', 'fs_popular_links_title');
            // popularSearchesLinksTitle.innerText = 'popular searches:';
            // popularSearchesLinks.appendChild(popularSearchesLinksTitle);
            // let counter = 0;
            // response.popularSearches.forEach(popularSearch => {
            //     if (counter < 3) {
            //         let popularSearchLink = document.createElement('div');
            //         popularSearchLink.classList.add('fs_autocomplete_link', 'fs_popularSearch_link');
            //         popularSearchLink.innerText = popularSearch.l;
            //         // popularSearchLink.setAttribute('id', popularSearch.id);
            //         popularSearchLink.addEventListener('click', function (event) {
            //             console.log('popularSearchLink btn clicked');
            //             event.preventDefault();
                        
            //         });
            //         popularSearchesLinks.appendChild(popularSearchLink);
            //         counter++;
            //     }
            // });
            // linksContainer.appendChild(popularSearchesLinks);
        }

        //turbolinks
        if (response.turbolinks.length > 0) {
            let turboLinks = document.createElement('div');
            turboLinks.classList.add('fs_autocomplete_links', 'fs_turbo_links');
            let turboLinksTitle = document.createElement('div');
            turboLinksTitle.classList.add('fs_autocomplete_links_title', 'fs_turbo_links_title');
            turboLinksTitle.innerText = 'turbolinks:';
            turboLinks.appendChild(turboLinksTitle);
            let counter = 0;
            response.turbolinks.forEach(turbolink => {
                if (counter < 3) {
                    let turboLink = document.createElement('a');
                    turboLink.classList.add('fs_autocomplete_link', 'fs_popularSearch_link');
                    turboLink.innerText = turbolink.l;
                    turboLink.href = turbolink.u;
                    turboLink.target = '_blank';
                    turboLinks.appendChild(turboLink);
                    //save url for quick submit
                    if(turbolink.l.toLowerCase() == searchTerm.toLowerCase()) {
                        turboLinkUrl = turbolink.u;
                    }
                    counter++;
                }
            });
            linksContainer.appendChild(turboLinks);
        }
    }
    // Show the modal
    if (response.products.length > 0 || response.turbolinks.length > 0 ) {
        productModal.style.display = 'block';
    } else {
        productModal.style.display = 'none';
    }
}

// Close the modal when the user clicks outside the modal
window.addEventListener('click', function (event) {
    if (event.target !== productModal) {
        productModal.style.display = 'none';
    }
});