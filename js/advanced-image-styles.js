(function( $, wp, _ ) {
	var AdvancedImageStylesView, frame, supportsColorInput;

	if ( ! wp.media.events ) {
		return;
	}

	supportsColorInput =  _.memoize( function() {
		var supported = false,
			elem;

		try {
			elem = document.createElement( 'input' );
			elem.type = 'color';
			if ( 'color' === elem.type ) {
				supported = true;
			}
		} catch( ex ) {}

		return supported;
	} );

	function addAdvancedStylesView( view ) {
		var advancedView;

		advancedView = new AdvancedImageStylesView( { model: view.model } );

		view.on( 'post-render', function() {
			view.views.insert( view.$el.find('.advanced-image'), advancedView.render().el );
		} );
	}

	wp.media.events.on( 'editor:image-edit', function( options ) {
		var dom = options.editor.dom,
			image = options.image,
			attributes;

		attributes = {
			borderWidth: dom.getStyle( image, 'borderWidth' ),
			marginTop: dom.getStyle( image, 'marginTop' ),
			marginLeft: dom.getStyle( image, 'marginLeft' ),
			marginRight: dom.getStyle( image, 'marginRight' ),
			marginBottom: dom.getStyle( image, 'marginBottom' )
		};

		_.each( attributes, function( val, key ) {
			if ( /\./.test( val ) ) {
				val = parseFloat( val, 10 );
			} else {
				val = parseInt( val, 10 );
			}

			attributes[ key ] = _.isNaN( val ) ? '' : val;
		} );

		attributes.borderColor = dom.toHex( dom.getStyle( image, 'borderColor' ) );
		options.metadata = _.extend( options.metadata, attributes );
	} );

	wp.media.events.on( 'editor:frame-create', function( options ) {
		frame = options.frame;
		frame.on( 'content:render:image-details', addAdvancedStylesView );
	} );

	wp.media.events.on( 'editor:image-update', function( options ) {
		var editor = options.editor,
			dom = editor.dom,
			image  = options.image,
			model = frame.content.get().model,
			borderWidth = model.get('borderWidth'),
			border = '',
			margin;

		if ( borderWidth ) {
			border = borderWidth + 'px solid ';
			border += model.get('borderColor') ? model.get('borderColor' ) : '#000';
		}

		dom.setStyle( image, 'border', border );

		margin = {
			top: model.get( 'marginTop' ),
			bottom: model.get( 'marginBottom' ),
			left: model.get( 'marginLeft' ),
			right: model.get( 'marginRight' )
		};

		_.each( margin, function( val, key ) {
			if ( val !== '' ) {
				val = parseInt( val, 10 );
				val = _.isNaN( val ) ? '' : val + 'px';
			}
			margin[ key ] = val;
		});

		dom.setStyle( image, 'marginTop', margin.top );
		dom.setStyle( image, 'marginBottom', margin.bottom );

		if ( 'center' !== model.get( 'align' ) ) {
			dom.setStyle( image, 'marginLeft', margin.left );
			dom.setStyle( image, 'marginRight', margin.right );
		} else {
			dom.setStyle( image, 'marginLeft', null );
			dom.setStyle( image, 'marginRight', null );
		}

	} );

	AdvancedImageStylesView = wp.Backbone.View.extend( {
		className: 'advanced-image-styles',
		template: wp.media.template('advanced-image-styles'),

		initialize: function() {
			wp.Backbone.View.prototype.initialize.apply( this, arguments );
			this.listenTo( this.model, 'change:align', this.toggleInputs );
		},

		prepare: function() {
			var data = this.model.toJSON();
			data.colorInputType = supportsColorInput() ? 'color' : 'text';
			return data;
		},

		render: function() {
			wp.Backbone.View.prototype.render.apply( this, arguments );
			this.toggleInputs( this.model, this.model.get( 'align' ) );
			return this;
		},

		toggleInputs: function( model, align ) {
			var $left = this.$el.find( '[data-setting="marginLeft"]' ),
				$right = this.$el.find( '[data-setting="marginRight"]' );

			if ( 'center' === align ) {
				$left.val( 'auto' );
				$right.val( 'auto' );
				$left.prop('disabled', true );
				$right.prop('disabled', true );
			} else {
				$left.val( model.get( 'marginLeft' ) );
				$right.val( model.get( 'marginRight' ) );
				$left.prop('disabled', false );
				$right.prop('disabled', false );
			}
		}
	} );

})( jQuery, wp, _ );
