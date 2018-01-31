<?php

/**
 * Plugin Name: Advanced Image Styles
 * Author: Gregory Cornelius
 * Author URI: http://gregorycornelius.com
 * Description: Adjust an image's margins and border with ease in the Visual editor.
 * Version: 0.4.1
 * License: GPL2+
 * Text Domain: advanced-image-styles
 * Domain Path: /languages/
 *
 */

class Advanced_Image_Styles {

	const VERSION = '0.4.1';

	public static function init() {
		add_action( 'wp_enqueue_editor', array( __CLASS__, 'enqueue' ), 10, 1 );
		add_action( 'print_media_templates', array( __CLASS__, 'template' ) );
	}

	public static function load_textdomain() {
		load_plugin_textdomain( 'jetpack', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	public static function enqueue( $options ) {

		if ( $options['tinymce'] ) {
			// Note: An additional dependency "media-views" is not listed below
			// because in some cases such as /wp-admin/press-this.php the media
			// library isn't enqueued and shouldn't be. The script includes
			// safeguards to avoid errors in this situation
			wp_enqueue_script( 'advanced-image-styles', plugins_url( 'js/advanced-image-styles.js', __FILE__ ), array( 'jquery' ), self::VERSION, true );
			wp_enqueue_style( 'advanced-image-styles', plugins_url( 'css/advanced-image-styles.css', __FILE__ ), array(), self::VERSION );
		}
	}

	public static function template() {
		include dirname( __FILE__ ) . '/_inc/advanced-image-styles-tmpl.php';
	}

}

add_action( 'init', array( 'Advanced_Image_Styles', 'init' ) );
add_action( 'plugins_loaded', array( 'Advanced_Image_Styles', 'load_textdomain' ) );
