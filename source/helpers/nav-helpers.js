(function() {
    var _ = require("lodash");
    module.exports.register = function(Handlebars, options) {
        Handlebars.registerHelper("navPages", function(navTag, options) {
            var result = "";
            var collectionItem = _.find(this["navTags"], {"navTag": navTag});
            if (collectionItem) {
                var sortedPages = _.sortBy(collectionItem.pages, function (page, index, pages) {
                    return page.data.navSort || 0;
                });
                _.each(sortedPages, function (page, index, pages) {
                    page.navIndex = index;
                    result += options.fn(page);
                });
            }
            return result;
        });
    };
}).call(this);
