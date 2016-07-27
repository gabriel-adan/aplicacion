angular.module('appsiac', ['ionic', 'appsiac.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }

        window.addEventListener("orientationchange", function(){
            //alert(screen.orientation.angle);
        });
    });
})
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('/home', {
            url: '/',
            templateUrl: 'templates/home.html'
        })
        .state('/consultarReclamo', {
            url: '/consultarReclamo',
            templateUrl: 'templates/view-consultar-reclamo.html',
            controller: 'ConsultarReclamoCtrl',
            controllerAs: 'vm'

        })
        
        .state('/reclamo', {
            url: '/reclamo',
            templateUrl: 'templates/view-reclamo.html',
            controller: 'ReclamoCtrl',
            controllerAs: 'vm'
        })

        .state('/login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm'
        });

    $urlRouterProvider.otherwise('/');
});

angular.module('appsiac.services', []);

angular.module('appsiac.controllers', ['appsiac.services', 'components']);