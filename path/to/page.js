function isSearchPage() {
    return getUrlParam('search');
}

let prevUrl = [];

function setUrlParam(paramName, paramValue, refresh = true) {
    url.searchParams.set(paramName, paramValue);
    // let new_url = dumpNarrow(url.searchParams);
    if(refresh) {
        // window.history.replaceState(null, null, decodeURIComponent(url.toString()));
        window.history.pushState(null, null, convertUrl());
    }
}
function removeUrlParam(paramName, refresh = true) {
    url.searchParams.delete(paramName);
    // let new_url = dumpNarrow(url.searchParams);
    if(refresh) {
        window.history.pushState(null, null, convertUrl());
    }
}
function convertUrl() {
    return decodeURIComponent(url.toString());
}
// function dumpNarrow(narrow) {
//     if (Object.keys(narrow ? narrow : {}).length === 0) {
//       return ""
//     }

//     let narrowString = "",
//       i = 0
//     const items = Object.entries(narrow)
//     for (const [name, values] of items) {
//       if (values) {
//         narrowString += Array.from(values).reduce(
//           (p, value, i) =>
//             p + `${name},${value}${i < values.size - 1 ? "," : ""}`,
//           ""
//         )
//         if (i++ < items.length - 1) {
//           narrowString += ","
//         }
//       }
//     }

//     return narrowString;
//   }

function getUrlParam(param) {
    return url.searchParams.get(param);
}

function initPage() {
    if (isSearchPage()) {
        fullSearchInit();
    } else {
        smartCollectionsInit();
    }
    //init recommendation
    recommendationsInit();
    prevUrl.push(convertUrl());
}

function afterInit() {
    loadCheckboxState();
}

//listening for changes in the URL
var _wr = function (type) {
    var orig = history[type];
    return function () {
        var rv = orig.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _wr('pushState');
// history.replaceState = _wr('replaceState');
// history.back = _wr('back');
history.popstate = _wr('popstate');

// window.addEventListener('replaceState', function (e) {
//     initPage();
// });

window.addEventListener('pushState', function (e) {
    initPage();
});

// window.addEventListener('back', function (e) {
//     initPage();
// });

// window.addEventListener('go', function (e) {
//     initPage();
// });

window.addEventListener('popstate', function(event) {
    // This event handler will be called when the back button is pressed
    // setTimeout(() => {
        
    //             initPage();
    //         }, 1500);
    // initPage();
    this.window.location.reload();
  });

// window.onhashchange = function() {
//     initPage();
// }

// window.addEventListener('popstate', function(event) {
//     let url = prevUrl.pop();
//     console.log(url);
//     url = prevUrl.pop();
//     console.log(url);
//     url = prevUrl.pop();
//     console.log(url);
//     if(url) {

//         window.location.href = url;
//     }


//     // window.history.pushState(null, null, url);
//     // console.log('init!!!!!!!!!!!!!');
//     // setTimeout(() => {
        
//     //     initPage();
//     // }, 500);
//     // if(prevUrl && prevUrl[prevUrl.length - 3]) {
//     //     this.alert(prevUrl[prevUrl.length - 3]);
//     //     window.history.pushState(null, null, prevUrl[prevUrl.length - 3]);
//     // } else {
//     //     history.back();
//     // }
//     // The popstate event is fired each time when the current history entry changes.

//     // var r = confirm("You pressed a Back button! Are you sure?!");
//     // let r = true;

//     // if (r == true) {
//     //     // Call Back button programmatically as per user confirmation.
//     //     history.back();
//     //     // Uncomment below line to redirect to the previous page instead.
//     //     window.location = document.referrer // Note: IE11 is not supporting this.
//     // } else {
//     //     // Stay on the current page.
//     //     history.pushState(null, null, window.location.pathname);
//     // }

//     // history.pushState(null, null, window.location.pathname);

// }, false);