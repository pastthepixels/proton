if ( typeof document == "undefined" ) {
	
	window = {}
	document = {}
	document.createElement = function ( elem_type ) {
		return {
			type: "element",
			elemType: elem_type,
			style: {}
		}
	}
	document.sendElement = function ( elem ) {
		postMessage( elem )
	}
	window.addEventListener = function ( name, callback ) {
		postMessage( {
			type: "eventListener",
			name: name,
			callback: callback
		} )
	}
	
} else {
	
	proton3d.addEventListener( "message", function ( msg ) {
		switch ( msg.data.type ) {
			
			case "eventListener":
				window.addEventListener( msg.data.name, function () {
					proton3d.postMessage( {
						type: "event",
						callback: msg.data.callback
					} )
				} )
				break
			
		}
	} )
	
}