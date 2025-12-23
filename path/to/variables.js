const fastSimonResponseAction = 'facets and products';
const searchForm = document.getElementById('searchForm');
const searchResultsContainer = document.getElementById('searchResults');
let url = new URL(window.location.href);
let currentNarrow = [];
let searchResults;
let minPrice;
let maxPrice;
let priceSlider;
let turboLinkUrl = false;
let filtersUrlParam = 'filters';




