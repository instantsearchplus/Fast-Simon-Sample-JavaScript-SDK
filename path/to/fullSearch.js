  // SDK Fast Simon search usage
  function fullSearchInit() {
    let searchQuery = getUrlParam('search');
    searchQuery = `${searchQuery}`;
    searchPageTitle = `Results for: "${searchQuery}"`;
    let narrowBy = getNarrowBy();
    let sortBy = getSortBy();
    let page = getPage();

    window.FastSimonSDK.fullTextSearch({
      term: searchQuery,
      narrowBy: narrowBy,
      sortBy: sortBy,
      page: page,
      productsPerPage: 15,
      onFacetsLoaded: (response) => {
        console.log('Facets loaded:', response);
        searchFilters = response.payload.facets;
        displayFilters(searchFilters);
      },
      onProductsLoaded: (response) => {
        console.log('Products loaded:', response);

        // Handle turbolink redirect
        if (response.action === "turbolink" && response.payload.turbolink?.u) {
          window.location.href = response.payload.turbolink.u;
          return;
        }

        if (searchResultsContainer.classList.contains('fs_products_loaded')) {
          searchResultsContainer.classList.remove('fs_products_loaded')
        }
        searchResults = response.payload;
        displaySearchResults(searchResults, searchResultsContainer, searchPageTitle);

        //Search Result page viewed event
        let promotilesArray = [];
        const products = response.payload.products || [];
        if(products && products.filter(product=>product.promotile))
        {
          const responsePromotile = products.filter(product=>product.promotile);
          responsePromotile.forEach(promo=>{
            promotilesArray.push({
              id: promo.id,
              name: promo.title,
              link: promo.link,
              thumbnail: promo.image
            });
          });

        }

        // Extract product IDs for reporting
        const productIDs = products.map(p => p.id);

        window.FastSimonSDK.event({
          eventName: window.FastSimonEventName.SearchPerformed,
          data: {
            query: searchQuery, // (Required)
            narrowBy: currentNarrow,
            sortBy: sortBy,
            promoTiles: promotilesArray // (Optional)
          }
        });
        afterInit();
      }
    });

  }
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if(turboLinkUrl) {
      window.location.href = turboLinkUrl;
    } else {
      searchResultsContainer.classList.add('fs_search');
      if (searchResultsContainer.classList.contains('fs_collections')) {
        searchResultsContainer.classList.remove('fs_collections');
      }
      const searchTerm = searchInput.value;
      clearUrlSearchParams();
      setUrlParam('search', searchTerm);
      currentNarrow = [];
    }

  });
