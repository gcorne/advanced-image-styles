<script type="text/html" id="tmpl-advanced-image-styles">
	<span class="group-label"><?php esc_html_e( 'Image Border', 'advanced-image-styles' ); ?></span>
	<div class="image-settings-group">
		<label class="border-width">
			<span><?php esc_html_e( 'Width', 'advanced-image-styles' ); ?></span>
			<input type="text" data-setting="borderWidth" value="{{ data.borderWidth }}" />
		</label>
		<label class="border-color">
			<span><?php esc_html_e( 'Color', 'advanced-image-styles' ); ?></span>
			<input type="{{ data.colorInputType }}" data-setting="borderColor" value="{{ data.borderColor }}" />
		</label>
	</div>
	<span class="group-label"><?php esc_html_e( 'Image Margins', 'advanced-image-styles' ); ?></span>
	<div class="image-settings-group margins">
		<label class="top">
			<span><?php esc_html_e( 'Top', 'advanced-image-styles' ); ?></span>
			<input type="text" data-setting="marginTop" value="{{ data.marginTop }}" />
		</label>
		<label class="bottom">
			<span><?php esc_html_e( 'Bottom', 'advanced-image-styles' ); ?></span>
			<input type="text" data-setting="marginBottom" value="{{ data.marginBottom }}" />
		</label>
		<label class="left">
			<span><?php esc_html_e( 'Left', 'advanced-image-styles' ); ?></span>
			<input type="text" data-setting="marginLeft" value="{{ data.marginLeft }}" />
		</label>
		<label class="right">
			<span><?php esc_html_e( 'Right', 'advanced-image-styles' ); ?></span>
			<input type="text" data-setting="marginRight" value="{{ data.marginRight }}" />
		</label>
	</div>
</script>
