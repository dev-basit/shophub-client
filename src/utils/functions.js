export function getQueryParams(query) {
  const queryParams = {};
  let queryParamsList = "";
  if (query) queryParamsList = query.split("&");

  for (let i = 0; i < queryParamsList.length; i++) {
    let pair = queryParamsList[i].split("=");
    queryParams[pair[0]] = pair[1];
  }

  return queryParams;
}

export function handleQueryParams(queryParams) {
  let filters = "";

  for (let item in queryParams) {
    filters += item + "=" + queryParams[item] + "&";
  }

  return filters.slice(0, filters.length - 1);
}

export function isSellerMode(props) {
  return props.match.path.indexOf("/seller") >= 0;
}

// dynamic params
// const getUrl = (url) => {
//   if (history.location.search) {
//     let query = history.location.search.substring(1);
//     const oldParams = {};
//     let queryParamsList = query.split("&");

//     for (let i = 0; i < queryParamsList.length; i++) {
//       let pair = queryParamsList[i].split("=");
//       oldParams[pair[0]] = pair[1];
//     }

//     const newParams = {};
//     let newQueryParamsList = url.split("&");

//     for (let i = 0; i < newQueryParamsList.length; i++) {
//       let pair = newQueryParamsList[i].split("=");
//       newParams[pair[0]] = pair[1];
//     }

//     for (let item in newParams) oldParams[item] = newParams[item];

//     let newUrl = "?";
//     for (let item in oldParams) newUrl += item + "=" + oldParams[item] + "&";

//     return newUrl;
//   }

//   return "?" + url;
// };
