/**
 *  Defines the SignupController controller
 *
 *  @author  Howard.Zuo
 *  @date    Nov 24, 2015
 *
 */
'use strict';

var DB_ADDRESS_KEY = 'windtaler.dbaddress';

var SignupController = function($scope, events, AuthService, utils, DbService) {
    $scope.hasDbSet = DbService.checkDbAddress();

    $scope.user = {};
    $scope.state = {notsame: false};

    AuthService.questions()
        .success(function(data) {
            $scope.questions = data;
        });

    var unwatch1 = $scope.$watch('user.repassword', function(newValue) {
        $scope.state.notsame = newValue !== $scope.user.password;
    });

    var unwatch2 = $scope.$watch('user.password', function(newValue) {
        $scope.state.notsame = newValue !== $scope.user.repassword;
    });

    $scope.saveUser = function() {
        AuthService.addUser({
            name: $scope.user.name,
            password: $scope.user.password,
            question: $scope.user.question,
            answer: $scope.user.answer
        })
            .success(function() {
                events.emit('toast', {
                    type: 'success',
                    content: '用户创建成功，请登录'
                });
                utils.redirect('login');
            })
            .error(function(err) {
                events.emit('toast', {
                    type: 'error',
                    content: err
                });
            });
    };

    $scope.$on('$destroy', function() {
        unwatch1();
        unwatch2();
    });
};

module.exports = [
    '$scope',
    'events',
    'AuthService',
    'utils',
    'DbService',
    SignupController
];
