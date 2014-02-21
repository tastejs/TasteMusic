/*jslint indent: false, global app: true */
;(function(_, window, undefined) {
  'use strict';

  var app = window.app;

  // The result object after we're done parsing the URLs.
  var result = {
    htmlList: document.createElement('ol'),

    array: [], // all of the links

    hash: { // links in categories
      'soundcloud': [],
      'youtube': [],
      'other': []
    }
  };


  // Returns true if a URL matches any of the provided domain names.
  var domainMatch = function(URL, domains) {
    var r = false, url = URL.toLowerCase();

    if (_.isString(domains)) {
      return url.indexOf(domains) > 1 ? true : false;
    }

    _.each(domains, function(domain) {
      if (url.indexOf(domain) > 1) {
        r = true;
      }
    });
   
    return r;
  };


  var item; // Creates a list-item with a link for each URL.
  function buildList(url) {
    item = document.createElement('li');
    item.innerHTML = '<a href="'+url+'" target="_blank" class="track">' + url + '</a>';
    result.htmlList.appendChild(item);
  }


  // Builds a hash of URLs categorized by domain names.
  function buildHash(url) {
    if(domainMatch(url, 'soundcloud.com')) {
      result.hash['soundcloud'].push(url);
    } else if(domainMatch(url, ['youtube.com', 'youtu.be'])) {
      result.hash['youtube'].push(url);
    } else {
      result.hash['other'].push(url);
    }
  }


  function addToCollections(url) {
    buildHash(url);
    buildList(url);
  }


  function CommentsParser(options) {
    this.options = options;

    // The comments in the opened issue
    this.comments = null;
  }

  CommentsParser.prototype = {
    constructor: CommentsParser,

    // Parses comments from the first
    // page of the paginated comments.
    parse: function() {
      this.getPage();
    },

    // Parses all comments, including the paginated ones.
    parseAll: function() {
      // TODO
    },

    getPage: function(num) {
      var self = this;
      var endpoint = self.options.url;

      // Get paginated comments
      if (num) {
        endpoint += '?page=' + num;
      }

      // Send ajax
      new app.http.get({
        url: endpoint,

        success: function(data, status, statusText) {
          if (data && status === 200) {
            self.comments = JSON.parse(data);

            if (self.comments.length > 0) {
              self.build();
            } else {
              self.options.fail('No more links are available. '+statusText);
            }
          }
        },

        error: function(xhr, status, statusText) {
            self.comments = [];
            self.build();
          self.options.fail(status + ' ' + statusText);
        }
      });
    },

    // Collect URLs from a single chunk of string
    collectUrls: function(stringChunk) {
      var stringLines = [];
      var words = [];
      var URLs = [];

      // Split on new lines
      stringLines = stringChunk.split(app.regex.newline);

      // Get words out of each line
      _.each(_.compact(stringLines), function(line) {
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

    build: function() {
      var self = this;
      var commentUrls;
      var currentLength = 0;
      var commentsLength = self.comments.length;

      // Collect urls from comment's body
      _.each(self.comments, function(comment) {
        commentUrls = self.collectUrls(comment['body']);

        // Simply concat them to the result array
        result.array = result.array.concat(commentUrls);

        // Each URL in the comment is added to a  
        // collection type in the result object
        _.each(commentUrls, addToCollections);

        currentLength += 1;

        // Are we done?
        if (currentLength === commentsLength) {
          self.complete();
          return;
        }
      });
    },

    complete: function() {
      console.log('Parsed URLs from ' + this.comments.length + ' comments!');
      this.options.done(result);
    }
  };

  window.app.CommentsParser = CommentsParser;
}(_, window));