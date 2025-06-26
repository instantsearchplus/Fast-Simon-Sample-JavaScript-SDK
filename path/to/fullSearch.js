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
      callback: (response) => {
        console.log(response);
        if (searchResultsContainer.classList.contains('fs_products_loaded')) {
          searchResultsContainer.classList.remove('fs_products_loaded')
        }
        searchResults = response.payload;
        searchFilters = response.payload.facets;
        if (response.action == fastSimonResponseAction) {
          console.log(fastSimonResponseAction);
          displayFilters(searchFilters);
          if (!searchResultsContainer.classList.contains('fs_products_loaded')) {
            displaySearchResults(searchResults, searchResultsContainer, searchPageTitle);
          }
        } else {
          displaySearchResults(searchResults, searchResultsContainer, searchPageTitle);
          console.log('products only');
        }

        //Search Result page viewed event
        let promotilesArray = [];
        if(response.products && response.products.filter(product=>product.promotile))
        {
          const responsePromotile=response.products.filter(product=>product.promotile);
          responsePromotile.forEach(promo=>{
            promotilesArray.push({
              id: promo.id,
              name: promo.title,
              link: promo.link,
              thumbnail: promo.image
            });
          });
          
        }

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
