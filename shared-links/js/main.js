;(function(_, window, undefined) {
  'use strict';

  var commentParser = new app.CommentParser({
    url: 'https://api.github.com/repos/tastejs/TasteMusic/issues/1/comments',
    container: document.getElementById('shared-links')
  });

  commentParser.init();

}(_, window));