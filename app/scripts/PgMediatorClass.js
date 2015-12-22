(function() {
	/**
	 ** File: PgMediatorClass.js
     ** dealing calls outside player(calls from player container pages)
	*/

	'use strict';

	var aa = {}; //debug purpose
	aa.refNameSelf = 'LIVE365PLAYER_PgMediator';

	LIVE365PLAYER  = (typeof LIVE365PLAYER === 'object') ? LIVE365PLAYER : {}; //dependency on GlobalSettings.js

	LIVE365PLAYER.PgMediator = function() {
		var that = this;
		that._setup();
	};

	//test purpose, for stand alone player, otherwise, it is passed from caller
	LIVE365PLAYER.sessionId='387EBE0BE8E64B0F83690C3A339F102F';

	var p = LIVE365PLAYER.PgMediator.prototype;

	//	================================================================
	//	PUBLIC METHODS:
	//{	called from container page with pkg
		p.receiveNotice = function(pkg) {
			var that = this;
			var vv = {};
			vv.handleNoticeReturn = that._handleNotice(pkg);
			return vv.handleNoticeReturn;
		};
	//}
	
	//	================================================================
	//	PRIVATE METHODS:
	//{
		p._setup = function(myName) {
			var that = this;
			that._config();
		};
		
		p._config = function() {
			var that = this;
			
			that.myTraceName = 'PLAYER-PG-MEDIATOR';
			that.cfg = {};
			that.cfg.getRef_ParentPgMediator_receiveNotice = function() {
				return parent.LIVE365PLAYER.pgMediator;
			};
		};

		p._handleNotice = function(pkg) {
			var that = this;
			var vv = {};
			vv.noticeName = pkg.notice.noticeName;	
				
			if (vv.noticeName === 'TrackPlay_requested') {
				vv.noticeName = 'PlayAnTrack';
			} else if (vv.noticeName === 'PlaylistPlay_requested') {
				vv.noticeName = 'PlayAnPlaylist';
			} else if (vv.noticeName === 'StationPlay_requested') {
				vv.noticeName = 'PlayAnStation';
			}

			pkg.fName = vv.noticeName;

			if (that['_run_' + vv.noticeName + '_Xnt'] ) { // external
				vv.noticeTransactionName = '_run_' + vv.noticeName + '_Xnt'; 
			}
			else if (that['_run_' + vv.noticeName + '_Nnt'] ) { // internal
				vv.noticeTransactionName = '_run_' + vv.noticeName + '_Nnt';
			}
			
			vv.transReturn = that[vv.noticeTransactionName](pkg); //call notice handler
			
			return vv.transReturn;
		};

		p._executeNgOnScope = function(targetSelector, targetCtrl, targetMethodName, methodArgs) {
			//var that = this;
			var vv = {};	
			if ( angular.element( document.querySelector( targetSelector ) ).scope() ) {
				//this is the communicate scope, commCtrl.broadcastData, commCtrl.execute_xtnl_command
				vv.scope = angular.element( document.querySelector( targetSelector ) ).scope();

				vv.method = vv.scope[targetCtrl][targetMethodName];
				vv.methodReturn = vv.method(targetSelector, targetCtrl, methodArgs);
			}
			else {
				console.log('>>> ' + aa.refNameSelf + ' -  COULD NOT EXECUTE NG.');
			}
			return vv.methodReturn;
		};

		p._executeTarget = function(targetMethod, methodArgs) {
			//var that = this;
			var vv = {};	
			if ( targetMethod ) {
				vv.method = targetMethod;
				vv.methodReturn = vv.method(methodArgs);
			}
			else {
				console.log('>>> ' + aa.refNameSelf + ' -  COULD NOT EXECUTE TARGET.');
			}
			return vv.methodReturn;
		};
		
		
		p._executeNg = function(targetSelector, targetMethodName, methodArgs) {
			//var that = this;
			var vv = {};	
			if ( angular.element( document.querySelector( targetSelector ) ).scope() ) {
				vv.thisc = angular.element( document.querySelector( targetSelector ) ).scope().thisc;
				vv.method = vv.thisc[targetMethodName];
				vv.methodReturn = vv.method.apply(vv.thisc, methodArgs);
			}
			else {
				console.log('>>> ' + aa.refNameSelf + ' -  COULD NOT EXECUTE NG.');
			}
			return vv.methodReturn;
		};

		
		p._genUniqueToken = function() {
			//var that = this;
			var vv = {};	
			
			/***Temporal ordinal prefix part */
			vv.milliesSince1970 = Date.now || function() { return  new Date(); }; 
			vv.milliPart = vv.milliesSince1970();
			
			/***Random suffix part */
			vv.minNum = 100000000;
			vv.maxNum = 999999999;
			vv.randomPart = Math.round( vv.minNum + ( Math.random() * (vv.maxNum - vv.minNum) ) );
			
			/***Combine the prefix parts and suffix parts into the final string */
			vv.uTkn = '_' + vv.milliPart + '_' + vv.randomPart;

			/***Return the unique token */
			return vv.uTkn;
		};
	//}
	
	
	//	================================================================
	//	E(X)TERNAL Notice Transactions: (Xnt)  
	//	These are for notices that originate *outide* of player. from container page.
	//{
		p._run_PlayAnStation_Xnt = function(pkg) {
			var that = this;
			var vv = {};
			
			//communicateDiv
			vv.rtnReturn = that['_'+pkg.fName](pkg);
			
			return vv.rtnReturn;
		};

		p._run_PlayAnPlaylist_Xnt = function(pkg) {
			var that = this;
			var vv = {};
			
			//communicateDiv
			vv.rtnReturn = that['_'+pkg.fName](pkg);
			
			return vv.rtnReturn;
		};

		p._run_PlayAnTrack_Xnt = function(pkg) {
			var that = this;
			var vv = {};
			
			//communicateDiv
			vv.rtnReturn = that['_'+pkg.fName](pkg);
			
			return vv.rtnReturn;
		};

		p._run_TrackInfo_requestedFromSPA_Xnt = function(pkg) {
			var that = this;
			var vv = {};
			
			//communicateDiv
			vv.rtnReturn = that['_'+pkg.fName](pkg);
			
			return vv.rtnReturn;
		};


		p._run_StopPlaying_Xnt = function(pkg) { // including stop play a station, playlist, and a track
			var that = this;
			var vv = {};
			
			//{	Params: 
				vv.transId = pkg.transId || that._genUniqueToken();
			//}
			return vv.rtnReturn;
		};
		
		p._run_PauseAnTrack_Xnt = function(pkg) {
			var that = this;
			var vv = {};
			
			//{	Params: 
				vv.transId = pkg.transId || that._genUniqueToken();
			//}
			return vv.rtnReturn;
		};
		
		p._run_StopAnTrack_Xnt = function(pkg) {
			var that = this;
			var vv = {};
			
			//{	Params: 
				vv.transId = pkg.transId || that._genUniqueToken();
			//}

			return vv.rtnReturn;
		};
		
		p._run_SkipAnTrack_Xnt = function(pkg) {
			var that = this;
			var vv = {};
			
			//{	Params: 
				vv.transId = pkg.transId || that._genUniqueToken();
			//}
			return vv.rtnReturn;
		};
	
	//}

	//	================================================================
	//	I(N)TERNAL Notice Transactions: (Nnt)  
	//	...These are for notices that originate *inside* of player mediator.
	//{
		p._run_verbPrepostionalObj_Nnt = function(pkg) {
			console.log(pkg);
		};
	//}
	
	//	================================================================
	//	ROUTINES: (Rtn)   
	//	...These are basically 'partial transactions', and/or 
	//	...simple transactions around executing just one method.
	//  these method are all eventually call a method in conmmunication controller
	//{
		p._verbName_Rtn = function() {
			var that = this;
			var vv = {};

			vv.exeReturn = that._executeNg.apply(that, 
				[ '.SomeVcc', 'someMethodInVcc', [ vv.arg1, vv.arg2, vv.argN ]]
			);
		};

		p._PlayAnStation = function(pkg){
			var that = this;
			var vv = {};

			//{	Params: 
				vv.noticeName = pkg.notice.noticeName; //noticeName is the method name
				vv.stationId = pkg.notice.stationId;
				vv.playlistId = pkg.notice.playlistId;
				vv.trackId = pkg.notice.trackId;
				vv.trackUsageId = pkg.notice.trackUid;
				vv.autoplay = pkg.notice.autoplay;
				vv.transId = pkg.notice.transId || that._genUniqueToken();
				vv.sessionId = pkg.notice.sessionId;
			//}

			// targetSelector, targetMethodName, methodArgs
			vv.exeReturn = that._executeNgOnScope.apply(that, [ '#communicateDiv', 'commCtrl', 'execute_xtnl_command', pkg ] );
            return vv.exeReturn;
		};

		p._PlayAnPlaylist = function(pkg){
			var that = this;
			var vv = {};
			//{	Params: 
				vv.noticeName = pkg.notice.noticeName; //noticeName is the method name
				vv.stationId = pkg.notice.stationId;
				vv.playlistId = pkg.notice.playlistId;
				vv.trackId = pkg.notice.trackId;
				vv.trackUsageId = pkg.notice.trackUid;
				vv.autoplay = pkg.notice.autoplay;
				vv.transId = pkg.notice.transId || that._genUniqueToken();
				vv.sessionId = pkg.notice.sessionId;
			//}

			// targetSelector, targetMethodName, methodArgs
			vv.exeReturn = that._executeNgOnScope.apply(that, [ '#communicateDiv', 'commCtrl', 'execute_xtnl_command', pkg ] );
            return vv.exeReturn;
		};

		p._PlayAnTrack = function(pkg){
			var that = this;
			var vv = {};

			//{	Params: 
				vv.noticeName = pkg.notice.noticeName; //noticeName is the method name
				vv.stationId = pkg.notice.stationId;
				vv.playlistId = pkg.notice.playlistId;
				vv.trackId = pkg.notice.trackId;
				vv.trackUsageId = pkg.notice.trackUid;
				vv.autoplay = pkg.notice.autoplay;
				vv.transId = pkg.notice.transId || that._genUniqueToken();
				vv.sessionId = pkg.notice.sessionId;
			//}

			// targetSelector, targetMethodName, methodArgs
			vv.exeReturn = that._executeNgOnScope.apply(that, [ '#communicateDiv', 'commCtrl', 'execute_xtnl_command', pkg ] );
            return vv.exeReturn;
		};

		p._TrackInfo_requestedFromSPA = function(pkg){
			var that = this;
			var vv = {};

			//{	Params: 
				vv.noticeName = pkg.notice.noticeName; //noticeName is the method name
				vv.stationId = pkg.notice.stationId;
				vv.playlistId = pkg.notice.playlistId;
				vv.trackId = pkg.notice.trackId;
				vv.trackUsageId = pkg.notice.trackUid;
				vv.autoplay = pkg.notice.autoplay;
				vv.transId = pkg.notice.transId || that._genUniqueToken();
				vv.sessionId = pkg.notice.sessionId;
			//}

			// targetSelector, targetMethodName, methodArgs
			vv.exeReturn = that._executeNgOnScope.apply(that, [ '#communicateDiv', 'commCtrl', 'getCurrentPlayingTrack', pkg ] );
            return vv.exeReturn;
		};

	//}

})();