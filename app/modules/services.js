angular.module('fixhomeApp')
.service('fixhomeService',fixhomeService);

function fixhomeService ($http, $log) {
	this.login =  function(user){
		return $http.get('/login?username='+user.name+'&passwork='+user.pass).then(function(response) {
			return response.data;
		})
	}
	
	/*Fixer*/
	this.loadListFixer = function () {
		return $http.get('/tho').then(function(response) {
			var dstho = response.data;
			
			return dstho;
		})
	}
	
	
	this.saveFixer = function(data) {
		return $http.post('/tho', data).then(
             function successCallback(response) {
                 	return "Thêm thành công."
                  }, function errorCallback(response) {
                    	return "Vui lòng kiểm tra lai các thông tin."
                  })
	}
	
	this.updateFixer = function(data) {
		return $http.put('/tho/'+data.cmnd, data).then(
             function successCallback(response) {
                 	return "Cập nhật thành công."
                  }, function errorCallback(response) {
                    	return "Vui lòng kiểm tra lai các thông tin."
                  })
	}
	
	this.getFixerbyID = function(item) {
		return $http.get('/tho/'+item).then (
			function successCallback(response){
				//response.data.ngaysinh = new Date(response.data.ngaysinh);
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	this.deleteFixerbyID = function(item) {
		return $http.delete('/tho/'+item).then (
			function successCallback(response){
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	this.searchFixer = function(condition) {
		return $http.get('/timkiemtho?cmnd=' + condition.cmnd + '&hoten=' + condition.hoten + '&sotruong=' + condition.sotruong).then(
			function successCallback(response){
				var data = response.data;
				var sotruong = condition.sotruong;
				var result = [];
				if(sotruong.length > 0) {
					for(var i=0; i< data.length; i++){
						for(var j=0; j<sotruong.length ; j++){
							if(data[i].sotruong.indexOf(sotruong[j]) > -1) {
								result.push(data[i]);
								i++;
								j= -1;
								if(i == data.length){
									break;
								}
							}
						}
					}
				} else {
					result = data;
				}
				return result;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	/*YEU CAU*/
	this.loadListRequest = function () {
		return $http.get('/yeucau').then(function(response) {
			var dsGio = [
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
				];
				
			var findTimebyValue = function(value){
				for(var i = 0; i< dsGio.length; i++){
					if(dsGio[i].value === value){
						return dsGio[i].time;
					}
				}
			}

			var result = [];
			for(var j=0; j<response.data.length; j++){
				var data = response.data[j];
				data.ngaydatyeucau = new Date(moment(data.ngaydatyeucau).format('YYYY-MM-DD HH:mm'))
				var day = data.ngaylam;
				if(day){
					var parts = day.split('/');
					$log.info(parts+ " - "+data.ngaylam);
					data.ngaylam = new Date(parts[2],parts[1]-1,parts[0]); 
				}
				
				/*data.ngaylam = new Date(moment(data.ngaylam).format('YYYY-MM-DD HH:mm'));*/
				data.ngaylam = new Date(data.ngaylam);
				data.giobatdau = new Date(moment('2016-08-28 '+findTimebyValue(data.giobatdau)).format('YYYY-MM-DD HH:mm'));
				data.gioketthuc = new Date(moment('2016-08-28 '+findTimebyValue(data.gioketthuc)).format('YYYY-MM-DD HH:mm'));
				
				response.data[j] = data;
			}
				
			return response.data;
		})
	}
	
	this.loadRequestNew = function () {
		return $http.get('/notification').then(function(response) {
			return response.data;
		})
	}
	
	this.saveRequest = function(data) {
		data.ngaydatyeucau = new Date(data.ngaydatyeucau);
		data.ngaylam = data.ngaylam.getDate() + "/"+(data.ngaylam.getMonth()+1) +"/"+data.ngaylam.getFullYear();
		$log.info("day: "+data.ngaylam);
		return $http.post('/yeucau', data).then(
             function successCallback(response) {
                 	return "Thêm thành công."
                  }, function errorCallback(response) {
                    	return "Vui lòng kiểm tra lai các thông tin."
                  })
	}
	
	this.updateRequest = function(data) {
		data.ngaydatyeucau = new Date(data.ngaydatyeucau);
		/*data.ngaylam = new Date(data.ngaylam);*/
		data.ngaylam = data.ngaylam.getDate() + "/"+(data.ngaylam.getMonth()+1) +"/"+data.ngaylam.getFullYear();
		return $http.put('/yeucau/'+data.mayc, data).then(
             function successCallback(response) {
                 	return "Cập nhật thành công."
                  }, function errorCallback(response) {
                    	return "Vui lòng kiểm tra lai các thông tin."
                  })
	}
	
	this.getRequestbyID = function(item) {
		return $http.get('/yeucau/'+item).then (
			function successCallback(response){
				var dsGio = [
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
				];
				
				var findTimebyValue = function(value){
					for(var i = 0; i< dsGio.length; i++){
						if(dsGio[i].value === value){
							return dsGio[i].time;
						}
					}
				}
				
				var data =  response.data;
				data.ngaydatyeucau = new Date(moment(data.ngaydatyeucau).format('YYYY-MM-DD HH:mm'))
				var day = data.ngaylam;
				if(day){
					var parts = day.split('/');
					$log.info(parts+ " - "+data.ngaylam);
					data.ngaylam = new Date(parts[2],parts[1]-1,parts[0]); 
				}
				
				/*data.ngaylam = new Date(moment(data.ngaylam).format('YYYY-MM-DD HH:mm'));*/
				data.ngaylam = new Date(data.ngaylam);
				data.giobatdau = new Date(moment('2016-08-28 '+findTimebyValue(data.giobatdau)).format('YYYY-MM-DD HH:mm'));
				data.gioketthuc = new Date(moment('2016-08-28 '+findTimebyValue(data.gioketthuc)).format('YYYY-MM-DD HH:mm'));
				return data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	
	
	this.getRequestID = function() {
		return $http.get('/getid').then (
			function successCallback(response){
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	this.deleteRequestbyID = function(item) {
		return $http.delete('/yeucau/'+item).then (
			function successCallback(response){
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	/*Skill*/
	this.getSkill = function() {
		return $http.get('/dichvu').then (
			function successCallback(response){
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	/*District*/
	this.getDistrict = function() {
		return $http.get('/quan').then (
			function successCallback(response){
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	/*Fixer Personal*/
	this.requestOfFixer = function(value){
		return $http.get('/yeucautho/'+value).then (
			function successCallback(response){
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
	
	this.requestOfFixerNew = function(value){
		return $http.get('/notification/'+value).then (
			function successCallback(response){
				return response.data;
			}, function errorCallback(response) {
				return response.error;
			}
		)
	}
};