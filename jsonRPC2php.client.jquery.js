/*
					COPYRIGHT

Copyright 2012 Stijn Van Campenhout <stijn.vancampenhout@gmail.com>

This file is part of JSON-RPC2PHP.

JSON-RPC2PHP is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

JSON-RPC2PHP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with JSON-RPC2PHP; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

/*
 * jsonrpcphp client for javascript
 * jquery extension
 * for use with http://github.com/subutux/jsonrpc2php
 * @author Stijn Van Campenhout <stijn.vancampenhout@gmail.com>
 * @version 1.0
 */
 (function ( $ ) {
 $.fn.jsonrpcphp(host){
 	that = this;
 	this.host = host;
 	/**
 	 * Main rpc function, wrapper for $.ajax();
 	 *
 	 * @param string method
 	 * @param string,array,object params
 	 * @param function callback
 	 */
 	this.__rpc__ = function(method,params,callback){
 		request = {};
 		request.jsonrpc = "2.0";
 		request.method = method;
 		if (typeof params == "string"){
 			request.params = new Array();
 			request.params[0] = params;
 		} else {
	 		request.params = params;
	 	}
 		if (typeof(callback) != "undefined"){
 			request.id = 447;
 		}
 		$.ajax({
		  url:host,
		  type:"POST",
		  data:JSON.stringify(request),
		  contentType:"application/json",
		  dataType:"json",
		  error: function(jqXHR,textStatus){
		  	alert('error:' + textStatus);
		  	return false;
		  },
		  success: function(r){
		  	console.log("success");
 			if (r.error != null){
 				alert(r.error.code + "::" + r.error.message + "::" + r.error.data.fullMessage);
 				//console.log(r.error);
 				return false;
 			} else if (typeof r.id != "undefined"){
 				callback(r);
 			} else {
 				return true;
 			}
 		 }
		});

 	}
 	/**
 	 * Build the function to execute a this.rpc call for the given object method
 	 *
 	 * @param string method
 	 * @return function
 	 */
 	this.buildFunction = function(method) {
 		return function (params,callback){
 			that.__rpc__(method,params,callback);
 		}
 	}
 	
 	/**
 	 * Build object for each method available like so:
 	 * rpc.[extension].[method](params,callback);
 	 *
 	 */
 		this.__rpc__('rpc.listMethods','',function(system){
 			$.each(system.result,function(ext,methods){
 				that[ext] = {};
 				for (method in methods){
					m = system.result[ext][method];
 					that[ext][m] = that.buildFunction(ext + "." + m);
 				};
 			});
 		});
}
})( jQuery );