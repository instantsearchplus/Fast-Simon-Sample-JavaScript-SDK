  // SDK Fast Simon collections usage
  function smartCollectionsInit() {

    let narrowBy = getNarrowBy();
    let collectionID = getCollectionId();
    let page = getPage();
    
    let sortBy = getSortBy();

    window.FastSimonSDK.smartCollections({
      // showing All-products category
      categoryID: collectionID,
      narrowBy: narrowBy,
      sortBy: sortBy,
      page: page,
      productsPerPage: 15,
      callback: (response) => {
        console.log(response);
        if (searchResultsContainer.classList.contains('fs_products_loaded')) {
          searchResultsContainer.classList.remove('fs_products_loaded')
        }
        collectionTitle = `Collection "${response.payload.name}"`;
        collectionResults = response.payload;
        collectionFilters = response.payload.facets;
        console.log(collectionFilters);
        setUrlParam('collectionID', collectionID, false);
        if (response.action == fastSimonResponseAction) {
          console.log(fastSimonResponseAction);
          displayFilters(collectionFilters);
          if (!searchResultsContainer.classList.contains('fs_products_loaded')) {
            displaySearchResults(collectionResults, searchResultsContainer, collectionTitle);
          }
        } else {
          console.log('products only');
          displaySearchResults(collectionResults, searchResultsContainer, collectionTitle);
        }
        afterInit();
      },

    });
    //Collection Viewed event
    window.FastSimonSDK.event({
      eventName: window.FastSimonEventName.SmartCollectionPreformed,
      data: {
        categoryID: collectionID, // (Required)
        narrowBy: narrowBy,
        sortBy: sortBy
      }
    });
  }


function getNarrowBy() {
    // let narrowBy = JSON.parse(url.searchParams.get('checkboxState2'));
    let narrowBy = JSON.parse(url.searchParams.get(filtersUrlParam));
    if(!narrowBy) {
        narrowBy = [];
    }
    let minPriceValue = getMinPriceValue(false);
    let maxPriceValue = getMaxPriceValue(false);
    if(minPriceValue && maxPriceValue) {
        let selectedFilters = [];
        selectedFilters.push('Price_from_to');
        selectedFilters.push(minPriceValue + '-' + maxPriceValue);
        narrowBy.push(selectedFilters);
    }
    let selectedColors = getSelectedColors();
    if(selectedColors && selectedColors.size) {
        selectedColors.forEach(color => {
          let selectedFilters = [];
          selectedFilters.push('Colors');
          selectedFilters.push(color);
          narrowBy.push(selectedFilters);
        });
    }
    console.log('narrowBy', narrowBy)
    return narrowBy;
}

function getMinPriceValue(useCatalog = true) {
    let minPriceValue = url.searchParams.get('min_price');
    if(!minPriceValue && minPrice && useCatalog) {
        minPriceValue = minPrice;
    }
    return minPriceValue;
}
function getMaxPriceValue(useCatalog = true) {
    let maxPriceValue = url.searchParams.get('max_price');
    if(!maxPriceValue && maxPrice && useCatalog) {
        maxPriceValue = maxPrice;
    }
    return maxPriceValue;
}

function getCollectionId() {
  return url.searchParams.get('collectionID')  || '292003643599';
}

function getPage() {
  return url.searchParams.get('page')  || '1';
}