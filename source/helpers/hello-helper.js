(function() {
    module.exports.register = function(Handlebars, options) {

        Handlebars.registerHelper('hello', function(name) {
            return new Handlebars.SafeString("Hello, " + name + "!");
        });

    };
}).call(this);


