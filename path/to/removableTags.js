function displayRemovableTags(){
    let removableTagsWrapper = document.querySelector('.removable_tags_wrapper');

    if(!removableTagsWrapper.hasChildNodes()){
        const removableTagContainer = document.createElement("div");
        removableTagContainer.classList.add('removable_tags_container');
        removableTagsWrapper.appendChild(removableTagContainer);
    }
}

function createClearAllButton(){
    let removableTagsWrapper = document.querySelector('.removable_tags_wrapper');
    const clearAllButton = document.createElement("button");
    clearAllButton.classList.add('clear_all_removable_tags');
    clearAllButton.innerText = "clear all"

    clearAllButton.addEventListener("click", () => {
        while (removableTagsWrapper.firstChild) {
          removableTagsWrapper.removeChild(removableTagsWrapper.firstChild);
        }
        clearUrlSearchParams(true)
    })

    removableTagsWrapper.appendChild(clearAllButton)
}

function checkIfRemovableTagExist(removableTagsMainContainer, tagType, tagName){
    const allRemovableTags = removableTagsMainContainer.querySelectorAll('.removable_tag');
    for (let i = 0; i < allRemovableTags.length; i++) {
        let element = allRemovableTags[i];
        if(element.getAttribute("tagType") === tagType && element.getAttribute("name") === tagName)
            return true;
    };

    return false;
}

function hasChildWithAttributeAndValue(parentNode, tagtype, value) {
    const childElements = parentNode.children;

    for (let i = 0; i < childElements.length; i++) {
        const currentElement = childElements[i].firstChild;
        if (
            currentElement.getAttribute('value')?.toLowerCase() === value.toLowerCase() &&
            currentElement.getAttribute('tagtype')?.toLowerCase() === tagtype.toLowerCase()
        ) {
            return true;
        }
    }

    return false;
}

function checkIfRemovableTagExistCheckBox(removableTagsMainContainer, key, value){
    let unselectedFilters = [];
    unselectedFilters.push(key);
    unselectedFilters.push(value);
    let currentFilters = JSON.parse(url.searchParams.get(filtersUrlParam));
    for (let i = 0; i < currentFilters?.length; i++) {
        const jsonunselectedFilters = JSON.stringify(unselectedFilters);
        if (JSON.stringify(currentFilters[i]) == jsonunselectedFilters &&
            (removableTagsMainContainer.hasChildNodes() && hasChildWithAttributeAndValue(removableTagsMainContainer, key, value))) {
          return true;
        }
    }
    return false;
}

function createRemovableTag(elementToListen, tagType, tagName, tagValue = null){
    let removableTagsMainContainer = document.querySelector('.removable_tags_container');

    const removableTagContainer = document.createElement("span");
    removableTagsMainContainer.appendChild(removableTagContainer)

    const removableTag = document.createElement("div");
    removableTag.classList.add('removable_tag');
    removableTag.setAttribute("tagType", tagType);
    removableTag.setAttribute("name", tagName);
    if(tagValue){
        removableTag.setAttribute("value", tagValue);
    }
    const removableTagText = document.createElement("span")
    removableTagText.classList.add('removable_tag_text');
    removableTagText.innerText = tagName;

    const removableTagRemoveButton = document.createElement("span")
    removableTagRemoveButton.classList.add('removable_tag_remove_button');
    removableTagRemoveButton.innerHTML = '&times;';

    removableTagRemoveButton.addEventListener("click", () => {
        if(tagType === 'color' || tagType === 'size'){
            elementToListen.click()
        }
        else{
            if(tagType === 'price'){
                removeUrlParam('min_price', false)
                removeUrlParam('max_price')
            }
            else {
                unCheckedCheckBox(elementToListen, tagType, tagValue)
            }
        }
        let removableTagsMainContainer = document.querySelector('.removable_tags_container');

        if(removableTagsMainContainer.hasChildNodes() && removableTagsMainContainer.contains(removableTagRemoveButton.parentNode.parentNode)) {
            removableTagsMainContainer.removeChild(removableTagRemoveButton.parentNode.parentNode);
        }
        let removableTagsContainer = document.querySelector('.removable_tags_container')
        if(!removableTagsContainer.hasChildNodes()){
            //remove clear all button
            let clear_all_button = document.querySelector('.clear_all_removable_tags')
            if(clear_all_button){
                clear_all_button.remove()
            }
        }

    })

    removableTag.appendChild(removableTagText);
    removableTag.appendChild(removableTagRemoveButton);

    removableTagContainer.appendChild(removableTag);

    // console.log('removableTagsMainContainer.childNodes.length > 0', removableTagsMainContainer.childNodes)
    // console.log('!removableTagsMainContainer.closest(.clear_all_removable_tags)', !removableTagsMainContainer.closest('.clear_all_removable_tags'))

    if(removableTagsMainContainer.childNodes.length > 0 && !document.querySelector('.clear_all_removable_tags')){
        createClearAllButton();
    }
}

function deleteRemovableTag(tagType, tagName, tagValue = null){
    let removableTagsMainContainer = document.querySelector('.removable_tags_container');
    let elementToRemove;
    if(tagValue){
       elementToRemove = removableTagsMainContainer.querySelector('[value="' + tagValue + '"][tagType="' + tagType + '"]');
    }
    else{
        elementToRemove = removableTagsMainContainer.querySelector('[name="' + tagName + '"][tagType="' + tagType + '"]');
    }
    if(elementToRemove){
        elementToRemove.closest('span').remove();
    }
    if(removableTagsMainContainer.childNodes.length == 0){
        let clear_all_button = document.querySelector('.clear_all_removable_tags')
        if(clear_all_button){
            clear_all_button.remove()
        }
    }
}

