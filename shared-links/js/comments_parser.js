;(function(_, window, undefined) {
  'use strict';

  function CommentParser(options) {
    // Initial endpoint
    this.url = options.url;

    // The comments in the opened issue
    this.comments = null;

    // DOM elements
    this.container = options.container;
    this.linkList = document.createElement('ol');
  }

  CommentParser.prototype = {
    constructor: CommentParser,

    init: function() {
      var pageNum = location.search.split('=')[1];
      this.getPage(pageNum > 1 ? pageNum : false);
    },

    getPage: function(num) {
      var self = this;
      var endpoint = self.url;

      // Get paginated comments
      if (num) {
        endpoint += '?page=' + num;
      }

      // Send ajax
      app.http.get({
        url: endpoint,

        success: function(data, status, statusText) {
          if (data && status === 200) {
            self.comments = JSON.parse(data);

            if (self.comments.length > 0) {
              self.buildHTML();
            } else {
              self.container.innerHTML = 'No links are available for this page.';
            }
          }
        },

        error: function(xhr, status, statusText) {
          self.container.innerHTML = status + ' ' + statusText;
        }
      });
    },

    // Collect URLs from a single chunk of string
    collectUrls: function(string_chunk) {
      var string_lines = [];
      var words = [];
      var URLs = [];

      // Split on new lines
      string_lines = string_chunk.split(app.regex.newline);

      // Get words out of each line
      _.each(_.compact(string_lines), function(line) {
        words.push(line.split(app.regex.space));
      });

     // Collect URLs
     URLs = _.chain(words)
      .flatten()
      .filter(function(str) {
        return app.regex.weburl.test(str);
      }).value();

      // console.log('Before: ', string_chunk);
      // console.log('\nAfter: ', URLs);

      return URLs;
    },

    buildHTML: function() {
      var self = this;
      var comment_urls, item;
      var currentLength = 0;
      var commentsLength = self.comments.length;

      // Collect urls from comment's body
      _.each(self.comments, function(comment) {
        comment_urls = self.collectUrls(comment['body']);

        // For each url in comment build a list item & a link
        _.each(comment_urls, function(url) {
          item = document.createElement('li');
          item.innerHTML = '<a href="'+url+'" target="_blank">' + url + '</a>';
          self.linkList.appendChild(item);
        });

        currentLength += 1;

        // Are we done?
        if (currentLength == commentsLength) {
          self.render();
          return;
        }
      });
    },

    render: function() {
      // We must take into account pagination
      console.log('Parsed URLs from ' + this.comments.length + ' comments!');
      this.container.innerHTML = this.linkList.outerHTML;
    }
  };

  window.app.CommentParser = CommentParser;
}(_, window));