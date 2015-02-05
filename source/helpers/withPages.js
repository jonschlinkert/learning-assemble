/*
    withPages Handlebars helper for Assemble

    Sample Usage:

    <ul>
         {{#withPages name="RecentPosts" collection="posts" inflection="post" value="all" sortBy="data.posted" dir="desc" limit=4 verbose=false}}
             <li>{{formatDate data.posted "%F"}}: Post - {{data.title}} ({{basename}})</li>
         {{/withPages}}
    </ul>

 */

(function() {
    "use strict";

    var _ = require("lodash");

    function getPropertyFromSpec(obj, propertySpec) {
        var properties = propertySpec.split('.');
        var resultObj = obj;
        _.each(properties, function (property) {
            if (resultObj && resultObj[property]) {
                resultObj = resultObj[property];
            } else {
                resultObj = null;
            }
        });
        return resultObj;
    }

    module.exports.register = function(Handlebars, options) {
        Handlebars.registerHelper("withPages", function(options) {
            var result = "";
            var verbose = options.hash.verbose;
            var collectionName = options.hash.collection;
            var inflection = options.hash.inflection;
            var inflectionValue = options.hash.value;
            var limit = options.hash.limit;
            var sortBy = options.hash.sortBy;
            var sortDir = options.hash.dir;
            var sortDescending = options.hash.dir && (sortDir === "desc" || sortDir === "descending");
            var name = options.hash.name || "" + [collectionName, inflection, inflectionValue, sortBy, sortDir, limit].join("/");
            var sourcePageName = this.page.src.substr(this.page.src.lastIndexOf("/") + 1);
            var logPrefix = "{{#withPages}} " + name + " in " + sourcePageName + ": ";

            function log(level, message, extra) {
                if (verbose || level !== "info") {
                    if (extra) {
                        console[level](logPrefix + message, extra);
                    } else {
                        console[level](logPrefix + message);
                    }
                }
            }

            log("info", "{{withPages}} options:", options.hash);
            if (sortDir && (sortDir !== "asc" && sortDir !== "ascending" && sortDir !== "desc" && sortDir !== "descending")) {
                log("warn", "{{withPages dir parameter '" + sortDir + "' is not recognized.  " +
                    "Use one of 'asc', 'ascending', 'desc', 'descending'");
            }

            var selectedPages = this.pages;

            // Collection filtering
            if (collectionName && inflection && inflectionValue) {
                var collection = this[collectionName];
                if (!collection) {
                    log("error", "collection '" + collectionName + "' not found");
                    return result;
                }
                if (collection.length > 0 && !collection[0][inflection]) {
                    log("warn", "{{withPages}} did not find pages matching inflection '" + inflection +
                        "' in collection '" + collectionName + "'");
                    return result;
                }
                var collectionFilter = {};
                collectionFilter[inflection] = inflectionValue;
                var collectionSubset = _.find(collection, collectionFilter);
                if (collectionSubset && collectionSubset.pages && collectionSubset.pages.length > 0) {
                    log("info", "{{withPages}} found " + collectionSubset.pages.length + " pages in collection '" +
                        collectionName + "' with inflection '" + inflection + "' and value '" + inflectionValue + "'");
                    selectedPages = collectionSubset.pages;
                } else {
                    log("info", "{{withPages}} did not find any pages in collection '" + collectionName +
                        "' with inflection '" + inflection + "' and value '" + inflectionValue + "'");
                    return result;
                }
            } else {
                log("info", "using all " + selectedPages.length + " pages");
            }

            // Sorting
            if (sortBy) {
                var pagesWithSortByValue = 0;
                selectedPages = _.sortBy(selectedPages, function (item) {
                    var sortByValue = getPropertyFromSpec(item, sortBy);
                    if (sortByValue) {
                        pagesWithSortByValue++;
                    }
                    return sortByValue;
                });
                log("info", "{{withPages}} sorted by '" + sortBy + "'. " + pagesWithSortByValue + " of " +
                    selectedPages.length + " pages had '" + sortBy + "' values.");
                if (pagesWithSortByValue < selectedPages.length && sortBy.indexOf("data.") == -1) {
                    log("info", "{{withPages}} Did you mean to use sortBy 'data." + sortBy + "'?");
                }
            }
            if (sortDescending) {
                selectedPages = selectedPages.reverse();
                log("info", "{{withPages}} reversing sort order");
            }

            // Limit
            if (limit && limit >= 0) {
                var limitedPages = _.first(selectedPages, limit);
                log("info", "{{withPages}} limiting to " + limitedPages.length + " pages out of " +
                    selectedPages.length);
                selectedPages = limitedPages;
            }

            // Rendering
            _.each(selectedPages, function (page, index, pages) {
                log("info", "{{withPages}} rendering page: " + page.basename);
                result += options.fn(page);
            });

            return result;
        });
    };

}).call(this);