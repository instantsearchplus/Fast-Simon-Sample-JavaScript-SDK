// SDK Fast Simon recommendations usage
function recommendationsInit() {
    console.log('recommendations')
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
    console.log('fetch products')
    window.FastSimonSDK.productRecommendation({
        productID: "6567320748239",
        specs: [
            {
                sources: ['related_recently_viewed', 'related_views', 'similar_products_by_attributes', 'related_cart', 'related_purchase', 'related_recent_products', 'related_top_products'],
                maxSuggestions: 8,
                widgetID: "my-widget"
            }
        ],
        callback: (response) => {
            const payload = response.payload;
            console.log(payload)
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
                                href: productDetail.u
                            };
                        });
                        renderRecommendationWidget(recommendationItems);
                    }
                }
            }
        }
    });
}

function renderRecommendationWidget(recommendationItems) {
    console.log('render')
    const mainWidgetContainer = document.querySelector('.fs-recommendation-widget');
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    // Create a heading for the widget
    const widgetHeading = document.createElement("h2");
    widgetHeading.className = 'fs-title';
    widgetHeading.textContent = "You may also like";

    const productsContainer = document.createElement("div");
    productsContainer.className = "fs-recommendation-widget-products-container";

    // Create a list to hold the recommendation items
    const recommendationList = document.createElement('div')
    recommendationList.className = 'recommendation-list'
    let dotNumber = 1;
    setUrlParam('widgetSlide', dotNumber, false);
    console.log(url.searchParams.get('widgetSlide'))

    const imageNumPerSlide = 2;
    const numberOfDots = Math.ceil(recommendationItems.length/imageNumPerSlide);

    if (recommendationItems && recommendationItems.length > 0) {
        //add prev and next buttons
        const prevBtn = document.createElement('a');
        prevBtn.classList.add('fs_recommendation_arrow');
        prevBtn.textContent = '<';

        const nextBtn = document.createElement('a');
        nextBtn.classList.add('fs_recommendation_arrow');
        nextBtn.textContent = '>';

        prevBtn.addEventListener('click', function() {
             let recommendationItemsElements = document.querySelectorAll('.recommendation-item');
             dotNumber--;
             recommendationItemsElements.forEach((item, index) => {
                 console.log(item, index)
                 console.log(recommendationItems.length, dotNumber)
                let numOfProductsToMove = imageNumPerSlide * (dotNumber - 1);
                 console.log(numOfProductsToMove)
                 let newTransform = "translate3d(-" + numOfProductsToMove*166 + "px, 0px, 0px)"
                 item.style.transform = newTransform
                 console.log(newTransform)
                 nextBtn.style.visibility = dotNumber < numberOfDots ? "visible" : "hidden";
            })
             prevBtn.style.visibility = recommendationItems.length > 1 && dotNumber > 1 ? "visible" : "hidden";
             setUrlParam('widgetSlide', dotNumber, false);
             console.log(url.searchParams.get('widgetSlide'))
             nextBtn.style.visibility = dotNumber < numberOfDots ? "visible" : "hidden";
        });
        prevBtn.style.visibility = recommendationItems.length > 1 && dotNumber > 1 ? "visible" : "hidden";


        nextBtn.addEventListener('click', function () {
            let recommendationItemsElements = document.querySelectorAll('.recommendation-item');
            setUrlParam('widgetSlide', dotNumber,false);
            recommendationItemsElements.forEach((item, index) => {
                console.log(item, index)
                console.log(recommendationItems.length, dotNumber)
                let numOfProductsToMove = imageNumPerSlide * dotNumber;
                console.log(numOfProductsToMove)
                let newTransform = "translate3d(-" + numOfProductsToMove*166 + "px, 0px, 0px)"
                item.style.transform = newTransform
                console.log(newTransform)
                prevBtn.style.visibility = recommendationItems.length > 1 && dotNumber + 1 > 0 ? "visible" : "hidden";
            })
            dotNumber++;
            nextBtn.style.visibility = dotNumber < numberOfDots ? "visible" : "hidden";
            setUrlParam('widgetSlide', dotNumber,false);
            console.log(url.searchParams.get('widgetSlide'))
        });

        nextBtn.style.visibility = dotNumber < numberOfDots ? "visible" : "hidden";

        // Iterate through the recommendation items and create list items
        recommendationItems.forEach((item) => {
        const listItem = document.createElement('div')
        listItem.className = 'recommendation-item'

        // Create an image element for the product image
        const image = document.createElement('img')
        image.src = getOptimizedImageURL(item.imageUrl)
        // image.src = item.imageUrl;
        image.alt = item.title

        // Create a link to the product page
        const productLink = document.createElement('p')
        productLink.className = 'recommendation-title'
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

        // Append the list item to the recommendation list
        recommendationList.appendChild(listItem)
    })

        mainWidgetContainer.style.display = 'flex'
        carouselContainer.appendChild(prevBtn);
        carouselContainer.appendChild(productsContainer);
        // Append recommendation list to the carousel container
        productsContainer.appendChild(recommendationList)
        // Append the heading and carousel container to the widget container
        mainWidgetContainer.appendChild(widgetHeading);
        mainWidgetContainer.appendChild(carouselContainer);

        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = "pagination-wrapper";
        const paginationContainer = document.createElement('div');
        paginationContainer.className = "pagination-container";
        paginationWrapper.appendChild(paginationContainer);

        let recommendationListElem = document.querySelector(".recommendation-list");
        recommendationListElem.style.width = imageNumPerSlide * 166 + "px";

        for(let i=1; i <= numberOfDots; i++){
            const dotElement = document.createElement('span')
            dotElement.className = "pagination-dot-"+i;
            // Add a click event listener to the dot element
            dotElement.addEventListener('click', () => {
                paginationWrapper.querySelectorAll("[class^='pagination-dot-']").forEach((d) => {
                    d.classList.remove("active");
                })
                dotElement.classList.add("active");
                //check if to transform to the new dot
                let recommendationItemsElements = document.querySelectorAll('.recommendation-item');
                recommendationItemsElements.forEach((item, index) => {
                    console.log(item, index)
                    console.log(recommendationItems.length, dotNumber)
                    let numOfProductsToMove = imageNumPerSlide * (i - 1);
                    console.log(numOfProductsToMove)
                    let newTransform = "translate3d(-" + numOfProductsToMove*166 + "px, 0px, 0px)"
                    item.style.transform = newTransform
                    console.log(newTransform)
                })
                console.log(recommendationListElem.style.transform)
                dotNumber = i;
                setUrlParam('widgetSlide', dotNumber, false);
                console.log(url.searchParams.get('widgetSlide'))

                nextBtn.style.visibility = i === numberOfDots ? "hidden" : "visible";
                prevBtn.style.visibility = i === 1 ? "hidden" : "visible";
            })
            paginationContainer.appendChild(dotElement);
        }



        carouselContainer.appendChild(nextBtn);

        mainWidgetContainer.appendChild(paginationWrapper);
        // Append the widget container to the document or a specific element
        document.body.appendChild(mainWidgetContainer);
    }

}