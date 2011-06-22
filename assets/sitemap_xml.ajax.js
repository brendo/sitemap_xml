Symphony.Language.add({
	'Request failed. Try again.': false,
	'Complete!': false
});

jQuery(function($){
	var _ = Symphony.Language.get;
	var fieldset = $('.pin_to_page, .sitemap_data'),
	//var fieldset = $('.add_pagetype, .pin_to_page'),
		status = $('<span />').attr('class', 'status'),
		gif = $('<img />'),
		form = $('form');
		
	if (!fieldset.length) return;
	
	/*@group show/hide pinned datasources*/
	var sitemap_data = $('.sitemap_data');
	
	if (fieldset.length > 0) {
		sitemap_data.hide();
	} 
	
	$('input[name="view[pinned]"]').live('change', function() {
		self = $(this).attr('checked');
		if(self == true) {
			sitemap_data.show();
		}else{
			sitemap_data.hide();
		}
	});
	/*end*/
	
				
	fieldset.append(status)
	fieldset.find('button').click(function(e){
		var parent = $(this).closest('fieldset');
		var status = parent.find('span.status');
		status.text('');
		
		if(parent.attr('class') == 'settings add_pagetype') {
			var page_type = parent.find('input').val(),
				self = $(this),
				page = parent.find('select').val();
			
			if (page_type == false || page == null) {
				alert('Please fill out both fields');
				return false;
			}
			var data = {addtype: {page_type: page_type, page: page}, 'action[add_pagetype]': 'run'};
		}
		if(parent.attr('class') == 'settings pin_to_page') {
			var datasource = parent.find('select[name="pin[datasource]"]').val(),
				relative_url = parent.find('input[name="pin[relative_url]"]').val(),
				self = $(this),
				page = parent.find('select[name="pin[page]"]').val();
				
			if (page == false || datasource == false || relative_url == false) {
				alert('Please fill out all fields.');
				return false;
			}
			
			var data = {pin: {relative_url: relative_url, datasource: datasource, page: page}, 'action[pin]': 'run'};
		}
				
				
		if(parent.attr('class') == 'settings sitemap_data') {
			var item = new Array();
			$.each(parent.find('tr.selected #item'), function() {
				item.push($(this).val());
			});
			var	self = $(this);
			
			console.log(item);

			var data = {row: {item: item}, 'action[removeRow]': 'run'};			
		}
				
		self.attr('disabled', 'disabled');
		status.prepend(gif.attr('src', Symphony.WEBSITE + '/extensions/sitemap_xml/assets/ajax-loader.gif'));
		
		$.ajax({
			url: window.location.href,
			data: data,
			success: function(html){
				self.attr('disabled', null);
				status.find('img').remove;
				status.text(Symphony.Language.get('Complete!'));
				
				if(parent.attr('class') == 'settings pin_to_page') {
					if(parent.find('label.view_pinned').length == 0) {
						parent.find('span.frame').after('<label class="view_pinned">Show pinned datasources <input type="checkbox" value="yes" name="view[pinned]"></label>');
					}
				}
				
				$('fieldset .container').load(window.location.href + ' fieldset.sitemap_data table');
			},
			error: function(){
				self.attr('disabled', null);
				status.find('img').remove;
				status.text(Symphony.Language.get('Request failed. Try again.'));
			}
		});
		
		return false;	
	});
});