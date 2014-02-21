/*jslint indent: false, global app: false */
;(function(_, window, undefined) {
  'use strict';


  var output = document.getElementById('shared-links');


  // The sharedLinks are available here.
  function parseDone(result) {
    if (result && _.isObject(result)) {
      output.innerHTML = result.htmlList.outerHTML;
      console.log(result);

      window.app.Player.updatePlaylist();

    }
  }

  function parseFail(errMessage) {
    if (errMessage) {
      output.innerHTML = errMessage;
    }
  }
  
  new window.app.CommentsParser({
    url: 'https://api.github.com/repos/tastejs/TasteMusic/issues/1/comments',
    done: parseDone,
    fail: parseFail
  }).parse();

}(_, window));