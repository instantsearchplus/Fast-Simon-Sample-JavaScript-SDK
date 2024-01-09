// SDK Fast Simon recommendations usage
function recommendationsInit() {
    console.log('recommendations')
    const widgetContainer = document.querySelector('.recommendation-widget')
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
                maxSuggestions: 5,
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
    const widgetContainer = document.querySelector('.recommendation-widget');
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    // Create a heading for the widget
    const widgetHeading = document.createElement("h2");
    widgetHeading.className = 'fs-title';
    widgetHeading.textContent = "You may also like";

    // Create a list to hold the recommendation items
    const recommendationList = document.createElement('div')
    recommendationList.className = 'recommendation-list'

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

    if (recommendationItems && recommendationItems.length > 0) {
        widgetContainer.style.display = 'flex'
        // Append recommendation list to the carousel container
        carouselContainer.appendChild(recommendationList)
        // Append the heading and carousel container to the widget container
        widgetContainer.appendChild(widgetHeading);
        widgetContainer.appendChild(carouselContainer);

        // Append the widget container to the document or a specific element
        document.body.appendChild(widgetContainer);
    }
}