// SDK Fast Simon recommendations usage
function recommendationsInit() {
    const widgetContainer = document.querySelector('.fs-recommendation-widget')
    widgetContainer.innerHTML = '';
    setTimeout(() => {
        window.FastSimonSDK.initialization({
            storeID: 55906173135, // store-id,
            uuid: "3eb6c1d2-152d-4e92-9c29-28eecc232373", // uuid
            type: 'SPA', // multi page application ("MPA") or single page application("SPA") (for reporting)
            onReady: () => {
                fetchProducts()
            },
        })
    }, 200)
}

function getOptimizedImageURL(url) {
  if (url.includes('missing.gif')) {
    return url
  }
  const newSize = ''
  const srcSize = url.substring(url.lastIndexOf('_') + 1, url.lastIndexOf('.'))

  if (['small', 'medium', 'large'].includes(srcSize)) {
    return url.replace('_' + srcSize + '.', newSize + '.')
  }

  return url
}

function fetchProducts() {
    window.FastSimonSDK.productRecommendation({
        productID: "6567320748239",
        specs: [
            {
                sources: ['related_recently_viewed', 'related_views', 'similar_products_by_attributes', 'related_cart', 'related_purchase', 'related_recent_products', 'related_top_products'],
                maxSuggestions: 12,
                widgetID: "my-widget"
            }
        ],
        callback: (response) => {
            const payload = response.payload;
            if (payload.length > 0) {
                for (let i = 0; i < payload.length; i++) {
                    const widgetPayload = payload[0].payload;
                    if (widgetPayload) {
                        const recommendationItems = widgetPayload.map(item => {
                            const productDetail = item;
                            return {
                                id: +productDetail.id,
                                variantId: productDetail.vra[0][0],
                                title: productDetail.l,
                                price: "$" + productDetail.p,
                                regularPrice: "$" + productDetail.p_c,
                                imageUrl: productDetail.t,
                                imageUrl2: productDetail.t2,
                                href: productDetail.u,
                                vra: productDetail.vra
                            };
                        });
                        renderRecommendationWidget(recommendationItems);
                    }
                }
            }
        }
    });
}

function activeCarouselDot(paginationContainer, currentDot) {
      paginationContainer.querySelectorAll("[class^='pagination-dot-']").forEach((d) => {
          if(d.classList.contains('pagination-dot-'+currentDot)){
              d.classList.add("active");
          }
          else{
              d.classList.remove("active");
          }
      })
}

function onPaginationButtonClick(paginationContainer, buttonElement, position, imageNumPerSlide, numberOfDots, clickedDot){
    buttonElement.addEventListener('click', function () {
        let dotNumber = clickedDot ? clickedDot : getUrlParam('widgetSlide')
        let recommendationItemsElements = document.querySelectorAll('.recommendation-item');
        recommendationItemsElements.forEach((item) => {
            let numOfProductsToMove =
                position == "right" ? imageNumPerSlide * dotNumber :
                    (position == "dot" ? imageNumPerSlide * (dotNumber - 1) : imageNumPerSlide * (dotNumber-2));
            let newTransform = "translate3d(-" + numOfProductsToMove * 240 + "px, 0px, 0px)";
            item.style.transform = newTransform;
        })
        if(position == "right"){
            let prevBtn = document.querySelector('.fa-arrow-left');
            prevBtn.style.visibility = recommendationItemsElements.length > 1 && dotNumber + 1 > 0 ? "visible" : "hidden";
            dotNumber++;
            buttonElement.style.visibility = dotNumber < numberOfDots ? "visible" : "hidden";
        }
        else{
            if(position == "left") {
                dotNumber--;
                let nextBtn = document.querySelector('.fa-arrow-right');
                nextBtn.style.visibility = dotNumber < numberOfDots ? "visible" : "hidden";
                buttonElement.style.visibility = recommendationItemsElements.length > 1 && dotNumber > 1 ? "visible" : "hidden";
            }
            else{
                //dot clicked
                let nextBtn = document.querySelector('.fa-arrow-right');
                let prevBtn = document.querySelector('.fa-arrow-left');
                nextBtn.style.visibility = dotNumber === numberOfDots ? "hidden" : "visible";
                prevBtn.style.visibility = dotNumber == 1 ? "hidden" : "visible";
            }
        }
        setUrlParam('widgetSlide', dotNumber,false);
        activeCarouselDot(paginationContainer, dotNumber);
    });
}

function renderRecommendationWidget(recommendationItems) {
    const mainWidgetContainer = document.querySelector('.fs-recommendation-widget');
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    // Create a heading for the widget
    const widgetHeading = document.createElement("h2");
    widgetHeading.className = 'fs-title';
    widgetHeading.textContent = "You may also like";

    const productsContainer = document.createElement("div");
    productsContainer.className = "fs-recommendation-widget-products-container";

    const imageNumPerSlide = 4;
    const numberOfDots = Math.ceil(recommendationItems.length/imageNumPerSlide);

    // Create a list to hold the recommendation items
    const recommendationList = document.createElement('div')
    recommendationList.className = 'recommendation-list'
    recommendationList.style.width = imageNumPerSlide * 240 + "px";

    if (recommendationItems && recommendationItems.length > 0) {
        let dotNumber = 1;
        setUrlParam('widgetSlide', dotNumber, false);

        //create pagination elements
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = "pagination-wrapper";
        const paginationContainer = document.createElement('div');
        paginationContainer.className = "pagination-container";
        paginationWrapper.appendChild(paginationContainer);

        // Iterate through the recommendation items and create list items
        recommendationItems.forEach((item) => {
            const listItem = document.createElement('div')
            listItem.className = 'recommendation-item'

            // Create an image element for the product image
            const image = document.createElement('img')
            image.className = 'fs_product_image';
            image.src = getOptimizedImageURL(item.imageUrl)
            // image.src = item.imageUrl;
            image.alt = item.title

            // Create a link to the product page
            const productLink = document.createElement('p')
            productLink.className = 'product-title'
            productLink.href = item.href
            productLink.textContent = item.title

            // Create a paragraph for the product price
            const priceParagraph = document.createElement('p')
            priceParagraph.className = 'recommendation-price'
            priceParagraph.textContent = item.price

            // Add a click event listener to the image
            // listItem.addEventListener('click', () => {
            //   clickProduct(item.id.toString(), item.variantId)
            // })

            // Append elements to the list item
            listItem.appendChild(image)
            listItem.appendChild(priceParagraph)
            listItem.appendChild(productLink)
            //colorswatches
            if (item && item.vra && item.vra.length > 1) {
              showColorswatches(item, listItem);
            }
            // Append the list item to the recommendation list
            recommendationList.appendChild(listItem)
        })

        // Append recommendation list to the carousel container
        productsContainer.appendChild(recommendationList)

        //create prev and next buttons
        const prevBtn = document.createElement('a');
        prevBtn.classList.add('fa-arrow-left')
        prevBtn.classList.add('fs_recommendation_arrow');
        prevBtn.innerHTML = '&#129136;';

        const nextBtn = document.createElement('a');
        nextBtn.classList.add('fs_recommendation_arrow');
        nextBtn.classList.add('fa-arrow-right')
        nextBtn.innerHTML = '&#129138;';

        onPaginationButtonClick(paginationContainer, prevBtn, "left", imageNumPerSlide, numberOfDots)
        prevBtn.style.visibility = recommendationItems.length > 1 && dotNumber > 1 ? "visible" : "hidden";

        onPaginationButtonClick(paginationContainer, nextBtn, "right", imageNumPerSlide, numberOfDots)
        nextBtn.style.visibility = dotNumber < numberOfDots ? "visible" : "hidden";

        mainWidgetContainer.style.display = 'flex'
        carouselContainer.appendChild(prevBtn);
        carouselContainer.appendChild(productsContainer);
        // Append the heading and carousel container to the widget container
        mainWidgetContainer.appendChild(widgetHeading);
        mainWidgetContainer.appendChild(carouselContainer);

        for(let i=1; i <= numberOfDots; i++){
            const dotElement = document.createElement('span')
            dotElement.className = "pagination-dot-"+i;
            // Add a click event listener to the dot element
            onPaginationButtonClick(paginationContainer, dotElement, "dot", imageNumPerSlide, numberOfDots, i)
            paginationContainer.appendChild(dotElement);
        }
        carouselContainer.appendChild(nextBtn);
        mainWidgetContainer.appendChild(paginationWrapper);

        activeCarouselDot(paginationContainer, dotNumber);
        // Append the widget container to the document or a specific element
        document.body.appendChild(mainWidgetContainer);
    }

}