'use strict';

var bonanza = require('bonanza');

angular.module('bonanza')
  .directive('bonanza', function ($parse, $q) {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        bonanzaLabel: '&?',
        bonanzaItemLabel: '&?',
        bonanzaLoadingLabel: '&?',
        bonanzaOnSelect: '&',
        bonanzaRequest: '&',
        bonanzaIsLoading: '=?'
      },
      link: function (scope, element, attrs, ngModel) {
        var lastItemSelected;

        element
          .unbind('input')
          .unbind('keydown')
          .unbind('change');

        var options = {};

        if (attrs.bonanzaLabel) {
          options.templates.label = scope.bonanzaLabel;
          options.templates.item = options.templates.label;
        }

        if (attrs.bonanzaItemLabel) {
          options.templates.item = scope.bonanzaItemLabel;
        }

        if (attrs.bonanzaLoadingLabel) {
          options.templates.loading = scope.bonanzaLoadingLabel;
        }

        var container = bonanza(element[0], options, doQuery);

        container.on('change', changeItem);

        container.on('select', function (item) {
          lastItemSelected = item;
        });

        element.on('blur', function () {
          if (lastItemSelected) {
            changeItem(lastItemSelected);

            lastItemSelected = null;
          }
        });

        container.on('search', function () {
          scope.bonanzaIsLoading = true;
        });

        container.on('success', function () {
          scope.bonanzaIsLoading = false;
        });

        if (ngModel) {
          scope.$watch(function () {
            return ngModel.$modelValue;
          }, updateValue, true);
        }

        function changeItem(item) {
          scope.$apply(function () {
            if (ngModel) {
              ngModel.$setViewValue(item);
            }

            scope.bonanzaOnSelect({ $item: item });
          });

          lastItemSelected = null;
        }

        function updateValue(obj) {
          if (!obj) {
            element[0].value = '';
          }
          else {
            element[0].value = bonanza.render(options.templates.label, obj);
          }
        }

        function doQuery(query, callback) {
          var request = scope.bonanzaRequest({ $query: query });

          $q.when(request)
            .then(function (result) {
              callback(null, result);
            })
            .catch(function (err) {
              callback(err);
            });
        }
      }
    };
  });
