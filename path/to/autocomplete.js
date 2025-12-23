// Autocomplete instant search by Fast simon
const searchInput = document.getElementById('searchInput');
searchInput.value = isSearchPage();

searchInput.addEventListener('input', function(event) {
    const searchTerm = event.target.value;
    // Use the following code for every keystroke shoppers perform in a searchbox.
    window.FastSimonSDK.instantSearch({
        query: searchTerm,
        is_content: true,
        callback: (response) => {
            console.log(response);
            displayAutocomplete(response.payload, searchTerm);
        },
        articlesCallback: (response) => {
            console.log('Articles loaded:', response);
            displayArticles(response.payload.articles, searchTerm);
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
    response.products.forEach(function(product) {
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

        if (product.l) { // title
            const productName = document.createElement('h3');
            productName.classList.add('fs_product_title_ac');
            productName.textContent = product.l;
            productContainer.appendChild(productName);
        }

        if (product.p && product.c) { // price
            const productPrice = document.createElement('span');
            productPrice.classList.add('fs_product_price_ac');
            productPrice.textContent = `${product.p}`;
            if (product.c == 'USD') {
                productPrice.innerText = `$${productPrice.innerText}`;
            }
            productContainer.appendChild(productPrice);
        }

        if (product.p_c && product.p_c > 0 && product.c) { // Compare price
            const productComparePrice = document.createElement('span');
            productComparePrice.classList.add('fs_product_compare_price_ac');
            productComparePrice.textContent = `${product.p_c}`;
            if (product.c == 'USD') {
                productComparePrice.innerText = `$${productComparePrice.innerText}`;
            }
            productContainer.appendChild(productComparePrice);
        }

        // add report for product click
        productContainer.addEventListener("click",()=>{
            window.FastSimonSDK.event({
                eventName: window.FastSimonEventName.AutocompleteProductClicked,
                data: {
                    query: searchTerm, // (Required)
                    productID: product.id, // (Required)
                    productQuery: product.s, // product's 's' key (Required)
                }
            });
        });


        // Append the product container to the search results container
        productList.appendChild(productContainer);
    });

    // Add content to the instant search dropdown
    if (response.categories.length > 0 || response.popularSearches.length > 0 || response.turbolinks.length > 0) {
        linksContainer.classList.add('fs_links_container');
        productModal.querySelector('.modal-content').appendChild(linksContainer);

        // Collections links
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
                    collectionLink.addEventListener('click', function(event) {
                        console.log('collection btn clicked');
                        event.preventDefault();

                        // add report for category click
                        window.FastSimonSDK.event({
                            eventName: window.FastSimonEventName.AutocompleteCategoryClicked,
                            data: {
                                query: searchTerm, // (Required)
                                collectionID: category.id, // (Required)
                            }
                        });
                        

                        collectionID = collectionLink.getAttribute("id");
                        searchResultsContainer.classList.add('fs_collections');
                        if (searchResultsContainer.classList.contains('fs_search')) {
                            searchResultsContainer.classList.remove('fs_search');
                        }
                        clearUrlSearchParams();
                        setUrlParam('collectionID', collectionID);
                    });
                    collectionLinks.appendChild(collectionLink);
                    counter++;
                }
            });
            linksContainer.appendChild(collectionLinks);
        }

        // Popular searches links
        if (response.popularSearches.length > 0) {
            let popularSearchesLinks = document.createElement('div');
            popularSearchesLinks.classList.add('fs_autocomplete_links', 'fs_popular_links');
            let popularSearchesLinksTitle = document.createElement('div');
            popularSearchesLinksTitle.classList.add('fs_autocomplete_links_title', 'fs_popular_links_title');
            popularSearchesLinksTitle.innerText = 'popular searches:';
            popularSearchesLinks.appendChild(popularSearchesLinksTitle);
            let counter = 0;
            response.popularSearches.forEach(popularSearch => {
                if (counter < 3) {
                    let popularSearchLink = document.createElement('div');
                    popularSearchLink.classList.add('fs_autocomplete_link', 'fs_popularSearch_link');
                    popularSearchLink.innerText = popularSearch.l;
                    popularSearchLink.setAttribute('id', popularSearch.id);
                    popularSearchLink.addEventListener('click', function(event) {
                        console.log('popularSearchLink btn clicked');
                        event.preventDefault();

                        // add report for popular click
                        window.FastSimonSDK.event({
                            eventName: window.FastSimonEventName.AutocompletePopularClicked,
                            data: {
                                query: searchTerm, // (Required)
                                term: popularSearch.l // (Required)
                            }
                        });

                        // Navigate to search results for the popular search term
                        searchResultsContainer.classList.add('fs_search');
                        if (searchResultsContainer.classList.contains('fs_collections')) {
                            searchResultsContainer.classList.remove('fs_collections');
                        }
                        clearUrlSearchParams();
                        setUrlParam('search', popularSearch.l);
                        currentNarrow = [];
                    });
                    popularSearchesLinks.appendChild(popularSearchLink);
                    counter++;
                }
            });
            linksContainer.appendChild(popularSearchesLinks);
        }

        // Turbolinks
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
                    turboLink.classList.add('fs_autocomplete_link', 'fs_turbolink_link');
                    turboLink.innerText = turbolink.l;
                    turboLink.href = turbolink.u;
                    turboLink.target = '_blank';
                    turboLinks.appendChild(turboLink);
                    // Save url for quick submit
                    if (turbolink.l.toLowerCase() == searchTerm.toLowerCase()) {
                        turboLinkUrl = turbolink.u;
                    }
                    counter++;
                }
            });
            linksContainer.appendChild(turboLinks);
        }
    }
    // Show the modal
    if (response.products.length > 0 || response.turbolinks.length > 0) {
        console.log('open AC');
        var searchForm = document.querySelector('.fs_autocomplete_wrap');
        var triangleModal = document.querySelector('.triangle');
        triangleModal.style.top = '' + (parseInt(searchForm.offsetTop) + parseInt(searchForm.offsetHeight - 20)) +'px';
        productModal.style.top = '' + (parseInt(searchForm.offsetTop) + parseInt(searchForm.offsetHeight) - 10) + 'px';
        productModal.style.display = 'block';
        productModal.style.position = 'absolute';
        productModal.style.zIndex = 100;
    } else {
        productModal.style.display = 'none';
    }
}

// Display articles from articlesCallback
function displayArticles(articles, searchTerm) {
    // Remove existing articles container if present
    const existingArticles = linksContainer.querySelector('.fs_articles_links');
    if (existingArticles) {
        existingArticles.remove();
    }

    if (articles && articles.length > 0) {
        let articlesLinks = document.createElement('div');
        articlesLinks.classList.add('fs_autocomplete_links', 'fs_articles_links');
        let articlesLinksTitle = document.createElement('div');
        articlesLinksTitle.classList.add('fs_autocomplete_links_title', 'fs_articles_links_title');
        articlesLinksTitle.innerText = 'articles:';
        articlesLinks.appendChild(articlesLinksTitle);
        let counter = 0;
        articles.forEach(article => {
            if (counter < 3) {
                let articleLink = document.createElement('a');
                articleLink.classList.add('fs_autocomplete_link', 'fs_article_link');
                articleLink.innerText = article.l;
                articleLink.href = article.u;
                articleLink.target = '_blank';
                articlesLinks.appendChild(articleLink);
                counter++;
            }
        });
        linksContainer.appendChild(articlesLinks);
    }
}

// Close the modal when the user clicks outside the modal
window.addEventListener('click', function(event) {
    if (event.target !== productModal) {
        productModal.style.display = 'none';
    }
});
