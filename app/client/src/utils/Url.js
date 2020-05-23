/**
 * URL related util methods
 */
const UrlUtil = {
  /**
   * Returns all query params of the given search part (querySearch) of an URL
   * as JS object (key-value).
   * If querySearch is not provided it is derived from the current location.
   *
   * @param  {String} querySearch Search part (querySearch) of an URL
   * @return {Object}             Key-value pairs of the URL parameters
   */
  getQueryParams(querySearch) {
    if (!querySearch) {
      querySearch = document.location.search;
    }
    querySearch = querySearch.split('+').join(' ');

    const re = /[?&]?([^=]+)=([^&]*)/g;
    let params = {};
    let tokens;
    while ((tokens = re.exec(querySearch))) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  },

  /**
   * Returns a dedicated URL parameter if existing.
   * If querySearch is not provided it is derived from the current location.
   *
   * @param  {String} param       The URL param name
   * @param  {String} querySearch Search part (querySearch) of an URL
   * @return {String}             Value of the given URL param
   */
  getQueryParam(param, querySearch) {
    const params = this.getQueryParams(querySearch);
    let value;
    Object.keys(params).forEach(key => {
      if (key === param) {
        value = params[key];
      }
    });

    return value;
  },

  /**
   * Creates an url from urlString. String can be absolute or relative.
   * If value is relative the location origin will be used
   * @param  {String} urlString String of the url
   * @return {Object}             Constructed Url
   */
  parseUrl(urlString) {
    let url = '';
    // Check if image url is relative or absolute
    const pat = /^https?:\/\//i;
    if (pat.test(url) === true) {
      // Image url is absolute
      url = urlString;
    } else {
      // Image url is relative, (so we get the baseUrl from the domain)
      url = new URL(urlString, window.location.origin).href;
    }
    return url;
  },

  /**
   * Test is URL string is valid
   * @param  {String} str String of the url
   * @return {boolean}             Is Url Valie
   */
  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }
};

export default UrlUtil;
