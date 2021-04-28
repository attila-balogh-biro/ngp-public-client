'use strict';

(function () {
    var connection = null;
    Terminal.applyAddon(fit);
    var term = new Terminal({
        cursorBlink: true
    });

    angular.module('serverless', [])
        .controller('UX', function ($scope) {
            var ctrl = this;
            ctrl.allIsWell = true;
            ctrl.devices = [];

            connection.on('console', function(messages){
                angular.forEach(messages, function(message){
                    term.writeln('>> Event '+message);
                });
            });
        });

        
        $.ajax({
            type: "POST",
            crossDomain: true,
            url:"https://func-ngp-geh-dev-weu-001.azurewebsites.net/api/negotiate",
            success: function (data) {
                connection = new signalR.HubConnectionBuilder()
                    .withUrl(data.url, { accessTokenFactory: () => data.accessToken })
                    .build();
                connection.start()
                    .then(function () {
                         term.open(document.getElementById('terminal'));
                         term.fit();
                         window.onresize = function () {
                                term.fit();
                            };
                         angular.bootstrap(document.body, ['serverless']);
                    })
                    .catch(function (error) {
                        console.error(error.message);
                    });
                }
            });
})();