/**
 * Author: Rastin Mehr
 * Email: rastin@anahitapolis.com
 * Copyright 2015 rmdStudio Inc. www.rmdStudio.com
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

;(function ($, window, document) {
	
	'use strict';
	
	//social graph
	$.fn.actorSocialgraph = function () {
		
		var elem = $( this );
		
		$.ajax({
			method : 'post',
			url : elem.attr('href'),
			data : {
				'action' : elem.data('action'),
				'actor' : elem.data('actor')
			}, 
			beforeSend : function () {
				elem.addClass('disabled');
			},
			success : function (response){
				
				var listEntity = elem.closest('.an-entity');
				
				if ( $(listEntity).is('.an-entity') ) {
					elem.closest('.an-entity').replaceWith($(response));
				} else {
					window.location.href = elem.attr('href');
				}
			}
		});
	};
	
	var socialgraphSelectors = 
		'[data-action="confirmrequest"],' +
		'[data-action="ignorerequest"],' +
		'[data-action="addrequest"],' +
		'[data-action="deleterequest"],' +
		'[data-action="follow"],' +
		'[data-action="unfollow"],' +
		'[data-action="block"],' +
		'[data-action="unblock"],' +
		'[data-action="lead"],' +
		'[data-action="unlead"]';
	
	$( 'body' ).on( 'click', socialgraphSelectors, function( event ) {
		event.preventDefault();
		$(this).actorSocialgraph();
	});
	
	
	//notifications settings
	$.fn.actorNotifications = function ( action ) {
		
		if ( action == 'read' )
		{
			var modal = $('#an-modal');
			var header = modal.find('.modal-header').find('h3');
			var body = modal.find('.modal-body');
			var footer = modal.find('.modal-footer'); 

			$.get(this.attr('href'), function ( response ) {

				header.html( $(response).filter('mheader').html() );
				body.html( $(response).filter('mbody').html() );
				footer.html( $(response).filter('mfooter').html() );
				modal.modal('show');
			});
		}	
		
	};
	
	$('body').on( 'click', '[data-action="notifications-settings"]', function ( event ) {
		event.preventDefault();
		$(this).actorNotifications('read');
	});

	//manage admins
	$.fn.actorTypeahead = function () {
		
		var form = this;
		var actors = [];
		var map = {};
		
		form.find('input:text').typeahead({
			minLength : 3,
			source : function ( query, process ) {

				var self = this;
				
				return $.ajax({
					method : 'get',
					url : form.attr('action'),
					headers: { 
	                    accept: 'application/json'
	                },
	                dataType : 'json',
					data : {
						get : 'candidates',
						value : query
					},
					beforeSend : function () {
						self.$element.fadeTo('fast', 0.3).addClass('uiActivityIndicator');
					},
					success : function ( response ) {
						
						var actors = [];

						$.each(response, function(i, actor) {
				            map[actor.value] = actor;
				            actors.push(actor.value);
				        });

						process(actors);
						
						self.$element.fadeTo('fast', 1).removeClass('uiActivityIndicator');
					}
				});
			},
			updater: function(item) {
		        form.find('[name="adminid"]').attr('value', map[item].id);
		        return item;
		    }
		});
	};
	
	$('form#an-actors-search').actorTypeahead();
	
	$('body').on('submit', 'form#an-actors-search', function( event ){
		event.preventDefault();
		
		var form = $(this);
		
		$.ajax({
			method : 'post',
			url : form.attr('action'),
			data : form.serialize(),
			beforeSend : function () {
				form.find(':submit').attr('disabled', true);
			},
			success : function ( response ) {
				console.log(response);
				form.trigger('reset');
				form.find(':submit').attr('disabled', false);
			}
		});
	});
	
}(jQuery, window, document));