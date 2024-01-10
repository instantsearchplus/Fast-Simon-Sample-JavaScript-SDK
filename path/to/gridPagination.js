function createThreeDotsBtn(paginationBtnsWrap){
  const threeDotsItem = document.createElement("span");
  threeDotsItem.className = "pagination-number three-dots-item";
  threeDotsItem.innerHTML = "...";
  paginationBtnsWrap.appendChild(threeDotsItem);
}

function createPageNumBtn(paginationBtnsWrap, pageNumber, active){
  const pageNumBtn = document.createElement("a");
  pageNumBtn.className = "pagination-number";
  pageNumBtn.innerHTML = pageNumber;
  pageNumBtn.setAttribute("page-index", pageNumber);
  pageNumBtn.setAttribute("aria-label", "Page " + pageNumber);
  pageNumBtn.addEventListener('click', function() {
    setUrlParam('page', pageNumber);
    window. scrollTo(0, 0);
  });
  //mark current page
  if(active) {
    pageNumBtn.classList.add("active");
  }
  else {
    pageNumBtn.classList.remove("active");
  }
  paginationBtnsWrap.appendChild(pageNumBtn);
}

//create previous or next button
function createArrowsBtns(paginationBtnsWrap, prev, pageNumber){
  const arrowBtn = document.createElement('a');
  arrowBtn.classList.add('fs_load_more_btn');
  arrowBtn.textContent = prev ? '<' : '>';
  arrowBtn.addEventListener('click', function() {
    prev ? pageNumber-- : pageNumber++;
    setUrlParam('page', pageNumber);
    window. scrollTo(0, 0);
  });
  paginationBtnsWrap.appendChild(arrowBtn);
}

function displayPagination(results, container) {
  const currentPage = results.page;
  const totalPages = results.pageCount;
  const paginationBtnsWrap = document.createElement('div');
  paginationBtnsWrap.classList.add('fs_pagination_btns_wrapper');
  //previous btn
  if (totalPages && currentPage && currentPage > 1 && currentPage > 1) {
    createArrowsBtns(paginationBtnsWrap, true, currentPage)
  }

  //pagination numbers
  const centerPageWrapper = document.createElement('div');
  centerPageWrapper.classList.add('center-pages-wrapper');

  for (let i = 1; i <= totalPages; i++) {
    if(i === 2 && currentPage > 4){
      createThreeDotsBtn(centerPageWrapper)
    }

    if(i === currentPage){
      createPageNumBtn(centerPageWrapper, i, true)
    }
    else{
      if(i == currentPage + 1 || i == currentPage + 2 || i == currentPage + 3 || i == currentPage - 1 || i == currentPage - 2 || i == currentPage - 3 || i == totalPages || i === 1){
        createPageNumBtn(centerPageWrapper, i);
      }
    }

    if(currentPage < totalPages - 3 && i === totalPages - 1){
      createThreeDotsBtn(centerPageWrapper)
    }
  }
  paginationBtnsWrap.appendChild(centerPageWrapper)
  //next btn
  if (totalPages > currentPage) {
    createArrowsBtns(paginationBtnsWrap, false, currentPage);
  }
  container.appendChild(paginationBtnsWrap);
}
