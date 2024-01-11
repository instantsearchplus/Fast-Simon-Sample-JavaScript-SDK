function showColorswatches(product, productContainer) {
    let variants = product.vra;
    let colorSwatchesContainer = document.createElement('div');
    colorSwatchesContainer.classList.add('fs_colorswatches_container');
    variants.forEach(variant => {
        if (variant[1][0][0] == 'Color') {
            let colorName = variant[1][0][1][0].replace(/\s/g, '-').toLowerCase();
            // Create the color swatch element
            const swatchElement = document.createElement('div');
            swatchElement.classList.add('fs_colorswatch');
            let swatchClass = `fast-swatch-color-${colorName}`;
            swatchElement.classList.add(`${swatchClass}`);
            swatchElement.style.backgroundColor = colorName;
            // Add event listener to the color swatch
            swatchElement.addEventListener('mouseover', () => {
                // Perform actions when color swatch is clicked
                console.log(`Selected color: ${colorName}`);
                // Add your logic here for handling the selected color
                variant[1].forEach(attr => {
                    if (attr[0] == "imgs") {
                        productContainer.querySelector('.fs_product_image').src = attr[1][0];
                    }
                });
            });

            // Append the color swatch to the container
            if (colorSwatchesContainer.querySelectorAll(`.${swatchClass}`).length == 0) {
                colorSwatchesContainer.appendChild(swatchElement);
            }
        }
    })
    productContainer.appendChild(colorSwatchesContainer);
}