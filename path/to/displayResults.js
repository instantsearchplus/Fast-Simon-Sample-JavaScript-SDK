function displaySearchResults(results, container, searchQuery) {
  // Clear previous search results
  container.innerHTML = '';

  //find search results title
  let searchTitle = document.querySelector('.fs_search_results_summary');
  let products = results.products;
  const searchResultsTitle = document.createElement('div');
  searchResultsTitle.classList.add('fs_search_results_title');
  if (searchQuery) {
    searchResultsTitle.innerText = `${searchQuery}, ${results.totalResults} results`;
  }
  if (searchTitle) {
    // Clear previous search results title
    searchTitle.innerHTML = '';
    searchTitle.appendChild(searchResultsTitle)
  }
  // container.appendChild(searchResultsTitle);

  const searchResultsWrapper = document.createElement('div');
  searchResultsWrapper.classList.add('fs_search_results_wrapper');

  // Iterate over the products and create the necessary HTML elements
  products.forEach((product) => {
    // Create a container for each product
    const productContainer = document.createElement('div');
    productContainer.classList.add('fs_product');

    // Add product information to the container
    const productImage = document.createElement('img');
    productImage.classList.add('fs_product_image');
    // product.t is an image URL
    if (product.t) {
      productImage.src = product.t;
      productImage.setAttribute('firstSrc', product.t);
    } else {
      productImage.src = 'https://acp-magento.appspot.com/images/missing.gif';
    }
    if (product && product.vra && product.vra.length > 1) {
      product.vra[1][1].forEach(el => {
        if (el[0] == 'imgs') {
          let secondSrc = el[1][0];
          productImage.setAttribute('secondSrc', secondSrc);
          //image carousel 
          productImage.addEventListener("mouseenter", (event) => {
            let src = productImage.getAttribute('secondSrc');
            productImage.src = src;
          })
          productImage.addEventListener("mouseleave", (event) => {
            let src = productImage.getAttribute('firstSrc');
            productImage.src = src;
          })
        }
      })
    }
    productContainer.appendChild(productImage);

    //title
    if (product.l) {
      const productName = document.createElement('h3');
      productName.classList.add('fs_product_title');
      productName.textContent = product.l;
      productContainer.appendChild(productName);
    }

    //price
    if (product.p && product.c) {
      const productPrice = document.createElement('span');
      productPrice.classList.add('fs_product_price');
      productPrice.textContent = `${product.p}`;
      if (product.c == 'USD') {
        productPrice.innerText = `$${productPrice.innerText}`;
      }
      productContainer.appendChild(productPrice);
    }

    //compare price
    if (product.p_c && product.p_c > 0 && product.c) {
      const productComparePrice = document.createElement('span');
      productComparePrice.classList.add('fs_product_compare_price');
      productComparePrice.textContent = `${product.p_c}`;
      if (product.c == 'USD') {
        productComparePrice.innerText = `$${productComparePrice.innerText}`;
      }
      productContainer.appendChild(productComparePrice);
    }

    //colorswatches
    if (product && product.vra && product.vra.length > 1) {
      showColorswatches(product, productContainer);

    }

    // Append the product container to the search results container
    searchResultsWrapper.appendChild(productContainer);
    container.appendChild(searchResultsWrapper);
  });

  //pagination
  displayPagination(results, container);

  searchResultsContainer.classList.add('fs_products_loaded');
}