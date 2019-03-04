/*******************************
*            CURSOR
*******************************/

var Cursor = ( function( $ ) {
	var my = {};
	var x = 0, y = 0;
	var speedX = 0, speedY = 0;
	var speed = 5;
	var $cursor;
	var drawing = false;

	/** initalisation */
	function init(){
		var $win = $( window );
		var w = $win.width();
		var h = $win.height();
		x = w / 2;
		y = h / 2;
		$cursor = $( '#cursor' );
		window.requestAnimationFrame( draw );
	}
	$( init ); // onReady

	function draw( timestamp ) {
		x += speedX * speed;
		y += speedY * speed;

		$cursor.css( {
			'transform': 'translate(' + x + 'px, ' + y + 'px)'
		} );
		if( drawing ) {
			Canvas.addLine();
		}
		window.requestAnimationFrame( draw );
	}

	my.setCursor = function( _x, _y ){
		x = _x;
		y = _y;
	};

	my.getCursor = function(){
		return { x: x, y: y };
	};

	my.setSpeedX = function( sp ){
		speedX = sp;
	};

	my.setSpeedY = function( sp ){
		speedY = sp;
	};

	my.setDraw = function( b ){
		drawing = b;
		if( b ){
			Canvas.startLine();
		} else {
			Canvas.stopLine();
		}
	};

	return my;
} ( jQuery ) );


/*******************************
*            MOUSE
*******************************/

var Mouse = ( function( $ ) {
	var my = {};
	var $el;

	/** initalisation */
	function init(){
		$el = $( window );
		setupHandlers();
	}
	$( init ); // onReady

	my.setElement = function( element ){
		$el = element;
	};

	function setupHandlers(){
		$el
			.mousedown( mouseDown )
			.mousemove( mouseMove )
			.mouseup( mouseUp )
			.mouseleave( mouseLeave );
	}

	function mouseDown( e ){
		Cursor.setDraw( true );
	}

	function mouseUp( e ){
		Cursor.setDraw( false );
	}

	function mouseMove( e ){
		e = e || window.event;
		Cursor.setCursor( e.clientX, e.clientY );
	}

	function mouseLeave( e ){
		mouseUp();
	}

	return my;
} ( jQuery ) );


/*******************************
*.        CANVAS
* *****************************/

var Canvas = ( function( $ ) {
	var my = {};
	var color = '#ff0000';
	var size = 20;
	var $canvas = $( "canvas" );
	var canvas = $("canvas").get(0);
	var context = canvas.getContext("2d");
	var draw = false;

	/** initalisation */
	function init(){
		onResize();
		$( window ).resize( onResize );
	}
	$( init ); // onReady

	function onResize(){
		var rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
	}

	my.setColor = function( col ){
		color = col;
	};

	my.setSize = function( s ){
		size = s;
	};

	my.clear = function (){
		context.clearRect( 0, 0, context.canvas.width, context.canvas.height );
	};

	my.startLine = function (){
		context.beginPath();
		context.lineWidth = size;
		context.lineCap = "round";
		context.lineJoin = "round";
		context.miterLimit = 10;
		draw = true;
	};

	my.addLine = function (){
		if( draw ){
			var pos = Cursor.getCursor();
			context.lineTo( pos.x, pos.y );
			context.strokeStyle = color;
			context.stroke();
		}
	};

	my.stopLine = function(){
		draw = false;
	};

	my.download = function() {
		var link = document.createElement('a');
		link.download = 'toyhack.png';
		link.href = canvas.toDataURL( "image/png" ).replace( "image/png", "image/octet-stream" );
		link.click();
	};

	return my;
} ( jQuery ) );


/*******************************
*          KEYBOARD
*******************************/

var Keyboard = ( function( $ ) {
	var my = {};

	/** initalisation */
	function init(){
		$( window ).keypress( onKeyPressed );
		$( window ).keydown( onKeyDown );
		$( window ).keyup( onKeyUp );
	}
	$( init ); // onReady

	function onKeyPressed( e ){
		e = e || window.event;
		switch( e.key ){
			case 'a':
			Canvas.setColor( '#FF0000' );
			break;

			case 'b':
			Canvas.setColor( '#00ff00' );
			break;

			case 'c':
			Canvas.setColor( '#0000ff' );
			break;

			case 'd':
			Canvas.setColor( '#000000' );
			break;

			case 'e':
			Canvas.setColor( '#ffffff' );
			break;

			case '1':
			Canvas.setSize( 1 );
			break;

			case '2':
			Canvas.setSize( 10 );
			break;

			case '3':
			Canvas.setSize( 20 );
			break;

			case '4':
			Canvas.setSize( 40 );
			break;

			case '5':
			Canvas.setSize( 80 );
			break;

			case '6':
			Canvas.setSize( 120 );
			break;

			case 'q':
			Canvas.clear();
			break;

			case 's':
			Canvas.download();
			break;

		}
	}

	function onKeyDown( e ){
		e = e || window.event;
		// console.log( e.keyCode );
		switch( e.keyCode ){
			case 38: // up
			Cursor.setSpeedY( -1 );
			break;
			case 40: // down
			Cursor.setSpeedY( 1 );
			break;
			case 37: // left
			Cursor.setSpeedX( -1 );
			break;
			case 39: // right
			Cursor.setSpeedX( 1 );
			break;
			case 32: // space
			Cursor.setDraw( true );
			break;
		}
	}

	function onKeyUp( e ){
		e = e || window.event;
		switch( e.keyCode ){
			case 38: // up
			case 40: // down
			Cursor.setSpeedY( 0 );
			break;
			case 37: // left
			case 39: // right
			Cursor.setSpeedX( 0 );
			break;
			case 32: // space
			Cursor.setDraw( false );
			break;
		}
	}

	return my;
} ( jQuery ) );
