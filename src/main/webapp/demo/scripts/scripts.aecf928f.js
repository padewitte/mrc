"use strict";function convertToBytes(a){return 1>a/1024?""+a+" Bytes":(a/=1024,1>a/1024?""+Math.round(a)+" KB":(a/=1024,1>a/1024?""+Math.round(a)+" MB":(a/=1024,1>a/1024?""+Math.round(a)+" GB":(a/=1024,1>a/1024?""+Math.round(a)+" TB":(a/=1024,1>a/1024?""+Math.round(a)+" PB":""+a)))))}angular.module("demoApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.select"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/dbs.html",controller:"DbsCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/cluster",{templateUrl:"views/cluster.html",controller:"ClusterCtrl"}).when("/dbs",{templateUrl:"views/dbs.html",controller:"DbsCtrl"}).when("/collections",{templateUrl:"views/collections.html",controller:"CollectionsCtrl"}).when("/graph",{templateUrl:"views/graph.html",controller:"GraphCtrl"}).otherwise({redirectTo:"/"})}]).run(["$rootScope",function(a){a.kupraUrl="/kupra/rest/"}]),angular.module("demoApp").controller("MainCtrl",["$scope","$http",function(a){a.selectedDb={},a.dbs=[{name:"test",size:"100 ko"},{name:"mrc",size:"200 ko"},{name:"foo",size:"300 Mo"}]}]),angular.module("demoApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("demoApp").controller("ClusterCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("demoApp").controller("DbsCtrl",["$scope","ksGetColStats",function(a,b){a.dbCtrl={},a.charts=[],a.$watch("dbCtrl.selected.name",function(c,d){if(c!==d){var e=b.getColStats(c);e.then(function(b){e=b,console.log(e),0==a.charts.length?(a.charts[0]=Morris.Donut({element:"count-chart",data:e[0]}),a.charts[1]=Morris.Donut({element:"size-chart",data:e[1],formatter:function(a){return convertToBytes(a)}})):(a.charts[0].setData(e[0]),a.charts[1].setData(e[1]))})}})}]),angular.module("demoApp").controller("CollectionsCtrl",["$scope",function(a){a.dbCtrl={},a.colCtrl={}}]),angular.module("demoApp").controller("GraphCtrl",["$scope",function(a){a.dbCtrl={},a.colCtrl={}}]),angular.module("demoApp").directive("kupraSelect",["$http","ksGetDatabases","ksGetCollections",function(a,b,c){return{templateUrl:"views/directives/kupraselect.html",scope:{db:"=",col:"=?"},restrict:"E",link:function(a){b.getDatabases().then(function(b){a.dbs=b}),a.col&&a.$watch("db",function(b,d){b!==d&&c.getCollections(a.db.selected.name).then(function(b){a.cols=b})},!0)}}}]),angular.module("demoApp").directive("kupraDb",["$http","$rootScope",function(a,b){return{restrict:"E",scope:{db:"="},templateUrl:"views/directives/kupradb.html",link:function(c){c.$watch("db",function(d,e){d!==e&&a.get(b.kupraUrl+c.db).success(function(a){c.dbData=a,console.log(a)})},!0)}}}]).directive("kupraCol",["$http","$rootScope",function(a,b){return{scope:{db:"=",col:"="},restrict:"E",templateUrl:"views/directives/kupradb.html",link:function(c){c.$watch("col",function(d,e){d!==e&&(console.log("Find : "+d),a.get(b.kupraUrl+c.db.selected.name+"/"+c.col.selected.name+"/?Colstats").success(function(a){c.dbData=a,console.log(a)}))},!0)}}}]),angular.module("demoApp").filter("unsafe",function(){return function(a){return convertToBytes(a)}}),angular.module("demoApp").filter("collectionFilter",function(){return function(a){return name.indexOf("$")>=0&&name.indexOf(".oplog.$")<0?void 0:a}}),angular.module("demoApp").service("ksGetCollections",["$http","$q","$log","$rootScope",function(a,b,c,d){return{getCollections:function(e){var f=b.defer();return c.log(e),a.get(d.kupraUrl+e+"/system.namespaces/").success(function(a){c.log("Collections Service"),c.log(a);for(var b=[],d=0;d<a.length;d++){var g=a[d].name.substring(e.length+1);g.indexOf("$")>=0&&g.indexOf(".oplog.$")<0||(a[d].name=g,b.push(a[d]))}f.resolve(b)}),f.promise}}}]),angular.module("demoApp").service("ksGetDatabases",["$http","$q","$log","$rootScope",function(a,b,c,d){return{getDatabases:function(){var c=b.defer();return a.get(d.kupraUrl+'/admin/?cmd={"listDatabases":1}').success(function(a){c.resolve(a.databases)}),c.promise}}}]),angular.module("demoApp").service("ksGetColStats",["$http","$q","$log","$rootScope","ksGetCollections",function(a,b,c,d,e){return{getColStats:function(c){var f=b.defer();return e.getCollections(c).then(function(e){var g=[];g.push([]),g.push([]);for(var h=[],i=0;i<e.length;++i)console.log(c+" = "+e[i].name),h.push(a.get(d.kupraUrl+c+"/"+e[i].name+"/?Colstats").success(function(a){console.log(a),g[0].push({label:a.ns,value:a.count}),g[1].push({label:a.ns,value:a.size})}));b.all(h).then(function(){console.log("Fin"),console.log(g),f.resolve(g)})}),f.promise}}}]);