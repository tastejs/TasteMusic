;(function(_, window, undefined) {
  'use strict';

  // Namespace
  window.app = window.app || {};


  // Global helpers
  window.$ = document.querySelectorAll.bind(document);
  window.$$ = document.querySelector.bind(document);


  // Regex: https://gist.github.com/dperini/729294
  var re_weburl = new RegExp(
    "^" +
      // protocol identifier
      "(?:(?:https?|ftp)://)" +
      // user:pass authentication
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!10(?:\\.\\d{1,3}){3})" +
        "(?!127(?:\\.\\d{1,3}){3})" +
        "(?!169\\.254(?:\\.\\d{1,3}){2})" +
        "(?!192\\.168(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      ")" +
      // port number
      "(?::\\d{2,5})?" +
      // resource path
      "(?:/[^\\s]*)?" +
    "$", "i"
  );  


  // Ajax methods
  var http = app.http = {
    // [CORS]: 
    // The request will succeed if the Browser supports 
    // XHR2/CORS because GitHub also allows CORS requests.
    get: function(options) {
      var xhr;

      // Bypass cache by adding timestamp at the end of the url.
      var url = options.url + ((/\?/).test(url) ? "&" : "?") + (+(new Date));

      // Only modern Browsers!
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        throw new Error("Your browser doesn't support the XMLHttpRequest object!");
        return;
      }

      // Set handler to process server's response
      xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            options.success(xhr.responseText, xhr.status, xhr.statusText);
          } else {
            options.error(xhr, xhr.status, xhr.statusText);
          }
        }
      }, false);

      xhr.open('GET', url, true);
      xhr.send(null);
    }
  };


  // Regular expressions
  var regex = app.regex = {
    newline: /\r\n/,
    space: /\s/,
    weburl: re_weburl
  };
}(_, window));