angular.module('fixhomeApp')
	.controller('navBarCtrl',navBarCtrl);
	function navBarCtrl ($scope, $mdSidenav,$state, $log, $interval, fixhomeService, $mdDialog, $mdMedia, $rootScope, $cookies) {
		var vm = this;
		$rootScope.user = $cookies.getObject('user');

		vm.num = 0;
		
		
		$log.info('login: '+$state.current.name);
        vm.toggleLeft = buildToggler('left');
		
        vm.isOpenLeft = function(){
          return $mdSidenav('left').isOpen();
        };

        vm.close = function () {
          $mdSidenav('left').close()
            .then(function () {
              $log.debug("close LEFT is done");
            });
        };
		
		vm.logout = function() {
			$rootScope.user = undefined;
			$scope.user = undefined;
			$cookies.remove('user');
			$rootScope.isLogin = false;
			$state.go('login');
			vm.num = 0;
		}
		
		if($rootScope.user) {
			$rootScope.isLogin = true;
			$log.info('user: '+$rootScope.user);
			$log.info($rootScope.user.username+'- isLogin: '+ $rootScope.isLogin + '- quyen: '+ $rootScope.user.quyen);
			if(window.location.href === "http://localhost:8000/" ){
				if($rootScope.user.quyen === 'tho'){
					$rootScope.isTho = true;
					$state.go('canhan');
				} else{
					$rootScope.isTho = false;
					$state.go('home');
				}
			}
			if($rootScope.user.quyen === 'tho'){
					$rootScope.isTho = true;
				} else{
					$rootScope.isTho = false;
				}
				
		}
		
        function buildToggler(navID) {
          return function() {
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          }
        }
		
		if(!$rootScope.user){
			$log.info('dk navBar sai')
			$state.go('login');
		}
		
		$scope.showAdvanced = function(ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			$mdDialog.show({
			  controller: loginCtrl,
			  templateUrl: 'views/login.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:false,
			  fullscreen: useFullScreen
			})
			.then(function(answer) {
			  $scope.status = 'You said the information was "' + answer + '".';
			}, function() {
			  $scope.status = 'You cancelled the dialog.';
			});
			$scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
			  $scope.customFullscreen = (wantsFullScreen === true);
			});
		};
		/*$scope.showAdvanced();*/
        
        vm.items = [
            {
                'name': 'Yêu cầu khách hàng',
                'state': 'yeucau'
            },
            {
                'name': 'Quản lý thợ sửa chữa',
                'state': 'nhanvien'
            },
			{
				'name': 'Quản lý dịch vụ',
				'state': 'dichvu'
			},
			{
				'name': 'Quản lý khách hàng',
				'state': 'khachhang'
			},
			{
				'name': 'Thống kê',
				'state': 'thongke'
			}
        ]
        
		vm.goState = function (item) {
			$state.go(item);
		}
		
		vm.modelRequest = function() {
			if($rootScope.user.quyen === "tho"){
				$state.go('canhan');
			} else {
				$state.go('yeucau');
			}
		}
		
		$interval(getNumRequest, 1000);
		
		function getNumRequest() {
			if($rootScope.user){
				if($rootScope.user.quyen === "tho"){
					fixhomeService.requestOfFixerNew($rootScope.user.cmnd).then(function(response) {
						vm.num = response.length;
					});
				} else if ($rootScope.user.quyen === "admin"){
					fixhomeService.loadRequestNew().then(function(response) {
						$log.info(response);
						vm.num = response.length;
					});
				}
			} else {
				vm.num = 0;
			}
		}
	};

angular.module('fixhomeApp')
	.controller('nhanvienCtrl',nhanvienCtrl);
	function nhanvienCtrl ($state,$mdDialog, fixhomeService, $http, $scope, $log, $rootScope, $cookies, fileReader) {
		var vm = this;
		vm.selected = [];
		vm.tho = [];
		vm.condition = {
			'cmnd': '',
			'hoten':'',
			'sotruong': []
		};
		
		vm.user = $cookies.getObject('user');
		vm.khuvuc = ["Trung tâm","Đông", "Tây", "Nam", "Bắc"];
		
		vm.query = {
			order: 'cmnd',
    		limit: 5,
    		page: 1
		}
		
		if(!$rootScope.user){
			$state.go('login');
		}
		vm.calendarView = "week";
		vm.calendarDate = new Date();
		vm.calendarTitle=""
		vm.calendarData = [];
		vm.quans = [];
		
		$scope.$watchGroup(['vm.calendarView', 'vm.calendarDate'], function(value) {
			if(!value[0] && !value[1])
				return;
			var currentDate = angular.copy(value[1]);
			var first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			var last = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
			$log.info("first: "+first+" last: "+last);
			vm.loadData(first, last);
		})
		
		vm.loadData = function() {
			
		}
		
		vm.setPage = function() {
			vm.requestList = vm.tho.slice((vm.query.page-1)*vm.query.limit, vm.query.page*vm.query.limit);
		}
		
		vm.modelDetail = function (item) {
			$state.go('nhanvien-detail', {cmnd:item});
		}
		
		vm.modelCalendar = function (item) {
			$state.go('nhanvien-calendar', {cmnd:item});
		}
		
		fixhomeService.getSkill().then(function(response){
			vm.dsdv = response;
		});
		
		fixhomeService.getDistrict().then(function(response) {
			vm.quans = response;
		})
		
		vm.modelNew = function () {
			$state.go('nhanvien-new');
		}
		
		vm.showConfirm = function(ev,data) {
			var confirm = $mdDialog.confirm()
          .title('Bạn có muốn xóa nhân viên này không?')
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
			  	vm.xoanv(data); 
				fixhomeService.loadListFixer().then(function(response) {
					vm.tho = response;
				  	vm.setPage();
			  	});
			}, function() {
			  $scope.status = 'You decided to keep your debt.';
			});
		};
		
		vm.search = function() {
			vm.condition.sotruong = vm.selected;
			fixhomeService.searchFixer(vm.condition).then(function(response) {
				$log.info(response);
				vm.tho = response;
				vm.setPage();
				/*vm.requestList = response;*/
			})
		}
		
		fixhomeService.loadListFixer().then(function(response) {
			vm.tho = response;
			vm.setPage();
		})
		
		vm.themnv = function () {
			fixhomeService.saveFixer($scope.data).then(function(response) {
				$log.info(response);
			})
			vm.message = "Thêm thành công!";
			vm.edit = true;
			vm.modelDetail($scope.data.cmnd);
		}
		
		vm.capnhatnv = function () {
			$log.info(vm.nv);
			fixhomeService.updateFixer(vm.nv).then(function(response) {
				$log.info(response);
				alert(response);
				vm.message =response;
			});
			vm.edit = true;
			vm.modelDetail(vm.nv.cmnd);
		}
		
		vm.xoanv = function (cmnd) {
			fixhomeService.deleteFixerbyID(cmnd).then(function(response){
				$log.info(response);
			})
			fixhomeService.loadListFixer().then(function(response) {
				vm.tho = response;
				vm.setPage();
				$state.go('nhanvien');
			})
		}
		
		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
			  vm.selected.splice(idx, 1);
			}
			else {
			  vm.selected.push(item);
			}
		};
		
		if($state.current.name === "nhanvien-detail"){
			fixhomeService.getFixerbyID($state.params.cmnd).then(function(response){
				vm.edit = true;
				$log.info(response);
				vm.nv = response;
				vm.nv.ngaysinh = new Date(moment(vm.nv.ngaysinh).format('YYYY-MM-DD'));
			})
		}
		
		$scope.getFile = function () {
				fileReader.readAsDataUrl($scope.file, $scope)
				   .then(function(result) {
						$log.info('path: '+ $scope.file.getTrustedResourceUrl);
						$scope.imageSrc = result;
						$log.info('image: '+ $scope.imageSrc);
					});
			};
	};


angular.module('fixhomeApp')
	.controller('yeuCauCtrl',yeuCauCtrl);
	function yeuCauCtrl ($state,$mdDialog, fixhomeService, $log, $scope, $mdMedia, $rootScope, $cookies, $filter) {
		var vm = this;
		vm.selected = [];
		vm.mayc, vm.giobatdau, vm.gioketthuc;
		vm.edit = $scope.$parent.edit ? $scope.$parent.edit : false;
		vm.yeucau = [];
		vm.quan = [];
		vm.dsdv = [];
		vm.isSave = false;
		vm.condition = {
			'cmnd': '',
			'hoten':'',
			'sotruong': []
		};
		
		vm.query = {
			order: 'ngaydatyeucau',
    		limit: 5,
    		page: 1
		}
		
		vm.trangthai = ["Bắt đầu", "Đang thực hiện", "Kết thúc"];
		
		vm.dsGio = [
            {
                time: "6:00",
                value: 360
            },
            {
                time: "6:30",
                value: 390
            },       
            {
                time: "7:00",
                value: 420
            },       
            {
                time: "7:30",
                value: 450
            },       
            {
                time: "8:00",
                value: 480
            },       
            {
                time: "8:30",
                value: 510
            },        
            {
                time: "9:00",
                value: 540
            },        
            {
                time: "9:30",
                value: 570
            },        
            {
                time: "10:00",
                value: 600
            },        {
                time: "10:30",
                value: 630
            },        {
                time: "11:00",
                value: 660
            },        {
                time: "11:30",
                value: 690
            },        {
                time: "12:00",
                value: 720
            },        {
                time: "12:30",
                value: 750
            },        {
                time: "13:00",
                value: 780
            },        {
                time: "13:30",
                value: 810
            },        {
                time: "14:00",
                value: 840
            },        {
                time: "14:30",
                value: 870
            },        {
                time: "15:00",
                value: 900
            },        {
                time: "15:30",
                value: 930
            },        {
                time: "16:00",
                value: 960
            },        {
                time: "16:30",
                value: 990
            },        {
                time: "17:00",
                value: 1020
            },        {
                time: "17:30",
                value: 1050
            },        {
                time: "18:00",
                value: 1080
            },        {
                time: "18:30",
                value: 1110
            },        {
                time: "19:00",
                value: 1140
            },        {
                time: "19:30",
                value: 1170
            },        {
                time: "20:00",
                value: 1200
            }
		]
		
		if(!$rootScope.user){
			$state.go('login');
		}
		
		vm.countMunite = function(time){
			if(time){
				var a = time.split(':');
				vm.count = (+a[0])*60 + (+a[1]);
			}
		}
		
		vm.setPage = function() {
			vm.requestList = vm.yeucau.slice((vm.query.page-1)*vm.query.limit, vm.query.page*vm.query.limit);
		}
		
		vm.showConfirm = function(ev,data) {
			var confirm = $mdDialog.confirm()
          .title('Bạn có muốn xóa yêu cầu này không?')
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
			    vm.xoayc(data); 
				/*fixhomeService.loadListRequest().then(function(response) {
					vm.yeucau = response;
					vm.setPage();
				})*/
				vm.setPage();
				$state.go('yeucau');
			}, function() {
			  $scope.status = 'You decided to keep your debt.';
			});
		};
		
		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
			  vm.selected.splice(idx, 1);
			}
			else {
			  vm.selected.push(item);
			}
		};
		
		$scope.showAdvanced = function(ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			$mdDialog.show({
			  controller: timkiemCtrl,
			  templateUrl: 'views/showdanhsachtho.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true,
			  fullscreen: useFullScreen
			})
			.then(function(answer) {
			  $scope.status = 'You said the information was "' + answer + '".';
			}, function() {
			  $scope.status = 'You cancelled the dialog.';
			});
			$scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
			  $scope.customFullscreen = (wantsFullScreen === true);
			});
		};
		
		vm.search = function() {
			$rootScope.timkiem = [];
			vm.condition.sotruong = vm.selected;
			fixhomeService.searchFixer(vm.condition).then(function(response) {
				$scope.showAdvanced();
				$log.info(response);
				$rootScope.timkiem = response;
			})
		}
		
		fixhomeService.getSkill().then(function(response){
			vm.dsdv = response;
		})
		
		fixhomeService.loadListRequest().then(function(response) {
			vm.yeucau = response;
			vm.setPage();
		})
		
		fixhomeService.getDistrict().then(function(response){
			vm.quan = response;
		})
		
		vm.themyc = function () {
			vm.yc.mayc = vm.mayc;
			
			vm.yc.hotenTho = vm.hotenTho; 
			vm.yc.cmndTho = vm.cmndTho; 
			vm.yc.sdtTho = vm.sdtTho;
			
			vm.yc.ngaydatyeucau = new Date(vm.yc.ngaydatyeucau);
			vm.yc.giobatdau = String((vm.yc.giobatdau.getHours()*60) + vm.yc.giobatdau.getMinutes());
			vm.yc.gioketthuc = String((vm.yc.gioketthuc.getHours()*60) + vm.yc.gioketthuc.getMinutes());
			if(vm.isSave){
				fixhomeService.saveRequest(vm.yc).then(function(response) {
						alert(response);
					$log.info(response);
				});
			vm.modelDetail(vm.yc.mayc);
			}
		}
		
		vm.capnhatyc = function () {
			vm.yc.ngaydatyeucau = new Date(vm.yc.ngaydatyeucau);
			vm.yc.giobatdau = String((vm.yc.giobatdau.getHours()*60) + vm.yc.giobatdau.getMinutes());
			vm.yc.gioketthuc = String((vm.yc.gioketthuc.getHours()*60) + vm.yc.gioketthuc.getMinutes());
			$log.info(vm.yc);
			if(vm.isSave){
				fixhomeService.updateRequest(vm.yc).then(function(response) {
					vm.message = response;
					$log.info("Cập nhật thành công!" + vm.giobatdau);
				})
				vm.modelDetail(vm.yc.mayc);
			}
		}
		
		vm.xoayc = function (mayc) {
			fixhomeService.deleteRequestbyID(mayc).then(function(response){
				$log.info(response);
			})
			vm.yeucau = undefined;
			fixhomeService.loadListRequest().then(function(response) {
				vm.yeucau = response;
				vm.setPage();
			})
		}
		
		var findTimebyValue = function(value){
			for(var i = 0; i< vm.dsGio.length; i++){
				if(vm.dsGio[i].value === value){
					return vm.dsGio[i].time;
				}
			}
		}
		
		$scope.$watchGroup(['vm.yc.giobatdau', 'vm.yc.gioketthuc', 'vm.yc.dichvuyc'], function(value) {
			if(!value[0] || !value[1] || !value[2])
				return;
			var begin = (vm.yc.giobatdau.getHours() * 60) + vm.yc.giobatdau.getMinutes();
			var end = (vm.yc.gioketthuc.getHours() * 60) + vm.yc.gioketthuc.getMinutes();
			
			var kq = end - begin;
			if(kq%60 === 0){
				vm.isSave = true;
				var phidv = 0;
				for(var i = 0; i < vm.dsdv.length; i++){
					for(var j = 0; j < vm.yc.dichvuyc.length; j++){
						if(vm.dsdv[i].tenDichVu === vm.yc.dichvuyc[j]){
							phidv = vm.dsdv[i].phiTheoGio > phidv ? vm.dsdv[i].phiTheoGio : phidv;
						}
					}
				}
				$log.info('pdv: '+phidv);
				vm.yc.phidichvu = kq*phidv/60;
				vm.message = "";
				$log.info(vm.yc.phidichvu);
			} else {
				vm.message = 'Khoảng thời gian thự hiện được tính bằng giờ. Vui lòng kiểm tra lại!!';
				vm.isSave = false;
			}
		})
		
		if($state.current.name === "yeucau-chitiet"){	
			fixhomeService.getRequestbyID($state.params.mayc).then(function(response){
				$log.info(response);
				vm.edit = true;
				vm.yc = response;
			})
		}
				
		vm.modelDetail = function (id) {
			vm.yc = undefined;
			vm.edit = true;
			$state.go('yeucau-chitiet', {mayc:id});
			fixhomeService.getRequestbyID($state.params.mayc).then(function(response){
				$log.info(response);
				vm.edit = true;
				vm.yc = response;
			})
		}
		
		vm.modelNew = function (item) {
			$state.go('yeucau-new', {cmnd: item});
		}
		
		if($state.current.name === "yeucau-new"){
			fixhomeService.getRequestID().then(function(response){
				$log.info(response);
				vm.mayc = response;
				
				fixhomeService.getFixerbyID($state.params.cmnd).then(function(response){
					vm.hotenTho = response.hoten;
					vm.cmndTho = response.cmnd;
					vm.sdtTho = response.sodt;
				})
			})
		}
	};

angular.module('fixhomeApp')
	.controller('timkiemCtrl',timkiemCtrl);
	function timkiemCtrl ($state,$mdDialog, fixhomeService, $log, $scope, $mdMedia, $rootScope, $cookies) {
		var vm = this;
		$scope.timkiem = $rootScope.timkiem;
		
		if(!$rootScope.user){
			$state.go('login');
		}
		
		$scope.modelNew = function (item) {
			$state.go('yeucau-new', {cmnd: item});
			$scope.hide();
		};
			
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	};

angular.module('fixhomeApp')
		.controller('loginCtrl',loginCtrl);
		function loginCtrl ($state,$mdDialog, fixhomeService, $log, $scope, $mdMedia, $rootScope, $cookies) {
			var vm = this;
			$rootScope.user;
			
			$scope.hide = function() {
				$mdDialog.hide();
			 };
			 $scope.cancel = function() {
				$mdDialog.cancel();
			 };
			
			
			vm.dangnhap = function() {
				if($scope.user){
					fixhomeService.login($scope.user).then(function(response) {
						if(!response){
							vm.message="Vui lòng kiểm tra lại Tên đăng nhập và Mật khẩu";
						}else {
							$rootScope.isLogin = true;
							$cookies.putObject('user', response);
							$rootScope.user = response;
							if(response.quyen === 'tho'){
								$rootScope.isTho = true;
								$state.go('canhan', {id: response.cmnd})
							}else if(response.quyen === 'admin'){
								$rootScope.isTho = false;
								$state.go('home');
							}
						}
					});
				}else {
					vm.message="Vui lòng kiểm tra lại Tên đăng nhập và Mật khẩu";
				}
				
			}
		};

angular.module('fixhomeApp')
		.controller('caNhanCtrl',caNhanCtrl);
		function caNhanCtrl ($state,$mdDialog, fixhomeService, $log, $scope, $mdMedia, $rootScope) {
			var vm = this;
			vm.select = true;
			vm.khuvuc = ["Trung tâm","Đông", "Tây", "Nam", "Bắc"];
			vm.trangthai = ["Bắt đầu", "Đang thực hiện", "Kết thúc"];
			if(!$rootScope.user){
				$state.go('login');
			}
			
			fixhomeService.getSkill().then(function(response){
				vm.dsdv = response;
			});

			fixhomeService.getDistrict().then(function(response) {
				vm.quans = response;
			})
			
			fixhomeService.getFixerbyID($rootScope.user.cmnd).then(function(response) {
				vm.tho = response;
				$log.info(vm.tho);
			})
			
			fixhomeService.requestOfFixer($rootScope.user.cmnd).then(function(response) {
				vm.requests = response;
			})
			
			vm.modelDetail = function (id) {
				$state.go('canhan-yeucau-chitiet', {mayc:id});
				fixhomeService.getRequestbyID($state.params.mayc).then(function(response){
					vm.yc = response;
				})
			}
			if($state.current.name === "canhan-yeucau-chitiet") {	
				fixhomeService.getRequestbyID($state.params.mayc).then(function(response){
					$log.info(response);
					vm.yc = response;
			    })
		   	}
			
			$scope.$watchGroup(['vm.yc.giobatdau', 'vm.yc.gioketthuc', 'vm.yc.dichvuyc'], function(value) {
				if(!value[0] || !value[1] || !value[2])
					return;
				var begin = (vm.yc.giobatdau.getHours() * 60) + vm.yc.giobatdau.getMinutes();
				var end = (vm.yc.gioketthuc.getHours() * 60) + vm.yc.gioketthuc.getMinutes();

				var kq = end - begin;
				if(kq%60 === 0){
					vm.isSave = true;
					var phidv = 0;
					for(var i = 0; i < vm.dsdv.length; i++){
						for(var j = 0; j < vm.yc.dichvuyc.length; j++){
							if(vm.dsdv[i].tenDichVu === vm.yc.dichvuyc[j]){
								phidv = vm.dsdv[i].phiTheoGio > phidv ? vm.dsdv[i].phiTheoGio : phidv;
							}
						}
					}
					$log.info('pdv: '+phidv);
					vm.yc.phidichvu = kq*phidv/60;
					vm.message = "";
					$log.info(vm.yc.phidichvu);
				} else {
					vm.message = 'Khoảng thời gian thự hiện được tính bằng giờ. Vui lòng kiểm tra lại!!';
					vm.isSave = false;
				}
			})
			
			vm.goHome = function() {
				$state.go('canhan');
			}
			vm.capnhatyc = function () {
				vm.yc.ngaydatyeucau = new Date(vm.yc.ngaydatyeucau);
				vm.yc.giobatdau = String((vm.yc.giobatdau.getHours()*60) + vm.yc.giobatdau.getMinutes());
				vm.yc.gioketthuc = String((vm.yc.gioketthuc.getHours()*60) + vm.yc.gioketthuc.getMinutes());

				$log.info(vm.yc);
				if(vm.isSave){
					fixhomeService.updateRequest(vm.yc).then(function(response) {
						vm.message = response;
						alert(response);
						$log.info("Cập nhật thành công!" + vm.giobatdau);
					})
					vm.modelDetail(vm.yc.mayc);
				}
			}
		
		};

angular.module('fixhomeApp').controller('dichvuCtrl', dichvuCtrl)
		function dichvuCtrl ($state, $mdDialog, fixhomeService, $log, $scope, $mdMedia, $rootScope) {
			
		}

/*angular.module('fixhomeApp').config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
    	return date ? moment(date).format('DD/MM/YYYY') : '';
    };
});*/