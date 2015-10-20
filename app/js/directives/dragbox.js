angular.module('designlessApp')

.directive('dragBox', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.draggable();
        }
    };
});