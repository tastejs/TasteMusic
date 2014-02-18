;(function(_, window, undefined) {
  'use strict';

  var output = document.getElementById('shared-links');

  new app.CommentsParser({
    url: 'https://api.github.com/repos/tastejs/TasteMusic/issues/1/comments',
    done: parseDone,
    fail: parseFail
  }).parse();


  // The sharedLinks are available here.
  function parseDone(result) {
    if (result && _.isObject(result)) {
      output.innerHTML = result.htmlList.outerHTML;

      console.log(result);
    }
  }

  function parseFail(errMessage) {
    if (errMessage) {
      output.innerHTML = errMessage;
    }
  }
}(_, window));