var CursorDrawing = ( function( $ ) {
	var my = {};
	var size = {};

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
		var width = 0, height = 0;

		/** initalisation */
		function init(){
			onResize();
			x = width / 2;
			y = height / 2;
			$cursor = $( '#cursor' );
			window.requestAnimationFrame( draw );
			$( window ).on( 'resize', onResize );
		}
		$( init ); // onReady

		function onResize(){
			var $win = $( window );
			width = $win.width();
			height = $win.height();
		}

		function draw( timestamp ) {
			x += speedX * speed;
			y += speedY * speed;
			constrainToCanvas();

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
			constrainToCanvas();
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

		function constrainToCanvas(){
			if( x > width ){
				x = width;
			}
			if( x < 0 ){
				x = 0;
			}
			if( y > height ){
				y = height;
			}
			if( y < 0 ){
				y = 0;
			}
		}

		return my;
	} ( $ ) );


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
	} ( $ ) );


	/*******************************
	*.        CANVAS
	* *****************************/

	var Canvas = ( function( $ ) {
		var my = {};
		var colors = [ '#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000' ];
		var curCol = 0;
		var color;// = colors[ curCol ];

		var size = 20;
		var $canvas = $( "canvas" );
		var canvas = $("canvas").get(0);
		var context = canvas.getContext("2d");
		var draw = false;

		/** initalisation */
		function init(){
			my.setColor( colors[ curCol ] );
			onResize();
			$( window ).resize( onResize );
			my.clear( false );
		}
		$( init ); // onReady

		function onResize(){
			var rect = canvas.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;

		}

		my.setColor = function( col ){
			color = col;
			$( '.line' ).css( 'backgroundColor', col );
		};

		my.nextColor = function(){
			curCol = ( curCol + 1 ) % colors.length;
			my.setColor( colors[ curCol ] );
		}

		my.nextSize = function(){
			size += 10;
			if( size > 100 ) size = 1;
			my.setSize( size );
		}

		my.setSize = function( s ){
			size = s;
			$( '.line' ).css({
				'width': s + 'px',
				'height': s + 'px'
			})
		};

		my.clear = function ( download ){
			if( download ) my.download();
			context.clearRect( 0, 0, canvas.width, canvas.height );
			context.fillStyle = '#ff00ff';
			context.fillRect(0, 0, canvas.width, canvas.height);
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

		my.incSize = function( val ){
			size += val;
			if( size < 1 ) size = 1;
			if( size > 100 ) size = 100;
		}

		return my;
	} ( $ ) );


	/*******************************
	*          KEYBOARD
	*******************************/

	var Keyboard = ( function( $ ) {
		var my = {};

		/** initalisation */
		function init(){
			// $( window ).keypress( onKeyPressed );
			$( window ).keydown( onKeyDown );
			$( window ).keyup( onKeyUp );
		}
		$( init ); // onReady

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
			console.log( e.keyCode, e.key );
			switch( e.key ){
				case 'a':
				Canvas.nextColor();
				break;

				case 'b':
				Canvas.nextSize();
				break;

				case 'c':
				case 'q': // q for backward compatibilty (or the guitar wont work...)
				Canvas.clear( true );
				break;

				case 's':
				Canvas.download();
				break;

			}
		}

		return my;
	} ( $ ) );

	my.Cursor = Cursor;
	my.Canvas = Canvas;
	my.Keyboard = Keyboard;
	my.Mouse = Mouse;
	return my;

} ( jQuery ) );
