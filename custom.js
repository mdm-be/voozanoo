/**
 * This library makes it possible to improve the UX / UI of the Voozanoo interphase.
 * It can change the method of displaying subforms 
 * perform automatic editing of date fields and more.
 *
 * @summary   Customize the Voozanoo application interface.
 *
 * @author		Sébastien Batteur
 * @link      batteur.be
 * @requires jquery.js
 */

MdmConst = {
	url : "newrec.php",
	urlonform : "interface.php?index=",
	debug : false,
	txt : {
		error_connection : 'An error occurred during the execution of your application'
	}

};
MdmFct = {
	hiddenSubForm : function(){
		blockHide = $('[id^="hb_"]')
		if(blockHide.length){
			blockHide.each(function(index, IdSubForm){
				$(this).closest(".ques_down.panel.panel-primary").hide(); 
			})
		}
		if($("#ques_list .ques_down:visible").length==0){
			$('#content #bloc_page').css('width', '100%')
		}
	},
	moveSubForm : function(){
		main = this
		$('[id^="onform_"]').each(function() {
			self=$(this)
			if(typeof self.data('info') ==='undefined') self.data('info', false)
			if(typeof self.data('info-visible') ==='undefined') self.data('info-visible', false)
			if(typeof self.data('info-white-field') ==='undefined') self.data('info-white-field', false)
			i=$(this).attr('id').replace("onform_", "");
			blockHide = $('#hb_'+i).closest('.ques_down.panel.panel-primary')
			a=blockHide.find('.ques_down_head_action input[name^=" add"]')
			calendar=$('.yui-panel-container.yui-dialog.shadow')

			colIdData=self.find('td.listing_head:contains("id_data")')
			if(colIdData)
				indexColIdData = colIdData.parent().find('td').index(colIdData)
			else
				indexColIdData = -1
			var rowsTable = {}
			if(indexColIdData>=0){
				blockHide.find('button.info.btn').each(function(){
					info = $(this).data('content')
					if(info.indexOf('id_data')==-1){
						return false
					}
					dataRow = { info: $(info),
											deletButton : $(this).parent().siblings().find('input[name^="remove"]')
										}
					idData = $.trim(dataRow.info.find('td:contains("id_data")').siblings().first().text())
					dataRow.info.find(':contains("id_data")').closest('tr').remove();
					rowsTable[idData]=dataRow
				})

			}
			currentColor = self.data('info-color')
			if(typeof currentColor ==='undefined' || currentColor == false){
				currentColor=''
			}else{
				currentColor=' highlight-'+currentColor.replace(/ /g,"_").replace(/[#@$.&]/g,"")
			}
			
			self.find('tr').each(function(){
				row=$(this)
				cell = row.find('td')
				// cell.find('input.btn.btn-success').value('').each(function(){
				// 	$(this).replaceWith( $(this).html().replace(/<button([^]*)<\/button>/g, "<input$1</input>"))
				// })
				if(indexColIdData>=0){
					cellIdData = cell.eq(indexColIdData)
					cellIdData.hide()
					if(!cellIdData.hasClass('listing_head') && Object.keys(rowsTable).length){
						idData = $.trim(cellIdData.text())
						if(rowsTable[idData].deletButton.length)
							cell.first().append(rowsTable[idData].deletButton)
						cell.first().detach().appendTo(row)
						if(self.data('info')){
							row.data('id', idData)
							
							infoVisible=rowsTable[idData].info.find('td:contains("**show**")')
							if(typeof infoVisible !== 'undefined' && infoVisible.length){
								highlight = (($.trim(infoVisible.parent().find('td').last().text()) == "1")? true : false )
								infoVisible.closest('tr').remove();
							}else{
								highlight = false
							}
							if(!self.data('info-white-field')){
								rowsTable[idData].info.find('tr').each(function(){
									infoRow = $(this)
									if($.trim(infoRow.find('td').last().text())=="") infoRow.remove()
								})
							}

							visible = self.data('info-visible') || highlight
							if(rowsTable[idData].info.find('tr').length){
								dartClick = ' dart-click';
							}else{
								dartClick=' dart-no-click';
								visible = false;
							}

							row.addClass(((highlight)?' highlight'+currentColor:'')+((visible) ? ' highlight-down' : ' highlight-up') ).find('td').first().prepend('<div class="dart'+((visible) ? ' dart-down' : ' dart-up')+dartClick+'">&nbsp;</div>')
							row.after('<tr id="listing-row-'+idData+'" class="'+((highlight)? 'highlight highlight-info'+currentColor:'')+'"'+((visible) ? '' : ' style="display:none;"')+'><td class="'+cell.first().attr('class')+'" colspan="'+cell.length+'" style="padding: 0px !important;">'+rowsTable[idData].info.wrap('<p/>').parent().html()+'</td></tr>')
						}
					}else{
						cell.first().detach().appendTo(row)
					}
				}else{
					cell.first().detach().appendTo(row)
				}
			})

			self.on('click', '.dart.dart-click', function(){
				dart = $(this)
				row = dart.closest('tr')
				idRow = row.data('id')
				if(dart.hasClass('dart-up')){
					row.siblings( '#listing-row-'+idRow ).slideDown()
					dart.removeClass( 'dart-up').addClass('dart-down')
					row.removeClass('highlight-up').addClass('highlight-down')
				}else{
					row.siblings( '#listing-row-'+idRow ).slideUp(function(){
						dart.removeClass( 'dart-down').addClass('dart-up')
						row.removeClass('highlight-down').addClass('highlight-up')						
					})
				}
			})

			if(a.length){
				button= a.wrap('<p/>').parent().html().replace('type="submit"', 'type="button"').replace('data-toggle="tooltip"', 'data-toggle="modal" data-tooltip="tooltip" data-target="#myModal" data-backdrop="static" data-keyboard="false"');
				a.unwrap();
				$(this).prepend(button);
			}
	
			saveButton = self.find('button[name=save]')
			saveButton.each(function(){
				thisSaveButton = $(this)
				thisSaveButton.replaceWith(
					$('<input class="btn btn-success" type="button" name="save" value="" \
						data-toggle="modal" data-tooltip="tooltip" data-target="#myModal" \
						data-backdrop="static" data-keyboard="false" data-placement="bottom" >')
						.attr('title', thisSaveButton.attr('title'))
						.attr('onclick', thisSaveButton.attr('onclick')).wrap('<p/>').parent().html()
					)
			})

			$('[data-tooltip="tooltip"]', $(this)).tooltip()

		}); 

		modal = $('#myModal')	
		modal.on('show.bs.modal', function (e) {
			var modal = $(this);
			var button = $(e.relatedTarget);
			modal.find('.modal-body').html("Loading...<i class='fa fa-spinner fa-spin '>");
			$("body").css('overflow', 'hidden');
			main.zIndexCalendar = calendar.css('z-index');
			calendar.css('z-index', '1041')
			attrOnclick = button.attr('onclick');
			main.idParent = button.closest('fieldset').attr('id')
			form = button.closest('form')
			data = form.serializeArray();
			substring="SetIndexValue"
			if(typeof attrOnclick !== "undefined" && attrOnclick.indexOf(substring) !== -1){
				data.push( {
					name: 'save',
					value: 'Modify'
				})

			}else{
				data.push( {
					name: button.attr("name"),
					value: button.val()
				})
			}
			$.post( main.urlScript+MdmConst.url, data , function( data ) {
				htmlForm = main.getform(data, true)
				if(form.find('[name=form_id_questionnaire]').val() == htmlForm.find('[name=form_id_questionnaire]').val()){
					modal.modal('hide')
					$('body').find('#content').first().html($(data).find('#content'))

						if (!MdmConst.debug){
							mdm.hiddenSubForm();
							mdm.moveSubForm();
						} 
				}else{
					modal.find('.modal-body').html(htmlForm)
				}
			}).fail(function(xhr, status, error) {
				modal.modal('hide')
			});
		}).on('shown.bs.modal', function(e){
		}).on('hide.bs.modal', function (e) {
			$("body").css('overflow', '');
			calendar.css('z-index', main.zIndexCalendar)
		}).on('click', ":submit", function(e){
			modal.find("form").data('click',$(this))
		}).on('submit', 'form', function(e){
			e.preventDefault();
			form =modal.find("form")
			nameClick = form.data('click').attr("name")
			if(nameClick !='cancel'){
				data = form.serializeArray();
				MdmFct.loadingForm(form, true)
				data.push({ name: nameClick, value : form.data('click').val() })
				$.post( MdmConst.url, data, function(data) {
					htmlForm = MdmFct.getform(data)
					form_id=htmlForm.find('[name=form_id_screen]').val()
					$('#myModal #bloc_page').find('input').prop('disabled', false);
					if(form.find('[name=form_id_questionnaire]').val() == htmlForm.find('[name=form_id_questionnaire]').val()){
						modal.find('.modal-body #content').replaceWith(htmlForm)
						if(htmlForm.find('.alert').length){
							setTimeout(MdmFct.cleanAlert, 100, htmlForm.find('.alert'));
						}
						MdmFct.loadingForm(form, false)
					}else{
						main.setCookie('mdm_'+main.form_id_screen ,main.idParent ,2*60*1000)
						main.cleanScript(htmlForm)
						htmlForm=htmlForm.wrap("<div id='tmp_redirect' class='hide'></div>").parent();
						$("body").append(htmlForm)
						$('#tmp_redirect input[name="jump'+main.surveyId+main.form_id_screen+'"]').click()
					}
				}).fail(function(xhr, status, error) {
					MdmFct.loadingForm(form, false)
					MdmFct.message(MdmConst.txt.error_connection);
  			});
			}
		}).on('closed.bs.alert', '.alert', function () {
			$(this).hide()
		});
		dataSubform = $('[data-subform-min]')
		if(dataSubform.length){
			$('#page>#content>form').on('submit',function(e){
				$('.error_message, .error_table').remove()
				$('.error').removeClass('error')
				error = false
				error_msg = ''
				dataSubform.each(function(){
					subform = $(this)
					numberSubForm =$(this).data('subform-min')
					if(numberSubForm>0){
						id=$(this).attr('id').replace("onform_", "");
						currentNumberSubForm = $('#hb_'+i).siblings( ".badge" )
						if(currentNumberSubForm.length){
							if(currentNumberSubForm.text()<numberSubForm)
								error=true
						}else{
							error=true
						}
					}
					if(error){
						fieldset=subform.closest('fieldset')
						msg='You must have minimum '+numberSubForm+' recordings!'
						error_msg=error_msg+'<tr><td class="error_label">'+msg+'</td><td class="error_field">[<a href="#'+fieldset.attr('id')+'">'+fieldset.attr('id')+'</a>]</td></tr>'
						fieldset.addClass('error').append('<div class="error_message">Error : '+msg+'</div>')
					}
				})
				if(error){					
					e.preventDefault();
					$('#bloc_page').prepend('<div class="error_table"><table><tbody>\
						<tr><td colspan="2" class="error_head">Errors were found on current screen</td></tr>\
						'+error_msg+'</tbody></table></div>')
				}
			})
		}
	},
	cleanAlert : function(alert){
		alert.each(function(){
			if($(this).hasClass('fade-out2'))
				$(this).remove()
		})		
		alert = $(alert.selector)
		if(alert.length)
			setTimeout(MdmFct.cleanAlert, 100, alert);
	},
	message : function(msg, type, title){
		if(typeof type === 'undefined')
			type='danger'
		if(typeof title === 'undefined')
			title='Error! '
		alert=$('<div class="alert-custom alert alert-'+type+'" id="'+type+'-alert" style="margin: 0 auto 10px;width: 400px;">\
    <strong>'+title+'</strong>'+msg+'\
</div>').appendTo("#message")
		alert.alert();
	  alert.fadeTo(2000, 500).fadeIn(500, function(){
	  	alert.delay(2000).fadeOut(500,function(){
	  		alert.remove()
	  	});
	  });   
	},
	initModal : function(){
		main = this
		$("body").append('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> \
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-body">\
        ...\
      </div>\
    </div>\
  </div>\
</div>\
<div id="message" style="top: 50px; position: fixed; width: 100%; z-index: 9999; text-align: center;"></div>');

		main.form_id_questionnaire = $("#content [name=form_id_questionnaire]").val()
		main.form_id_screen = $("#content [name=form_id_screen]").val()
		main.form_id_data = $("#content [name=form_id_data]").val()
		main.urlScript = window.location.href.substr(0,window.location.href.lastIndexOf('/')+1)
		$('body').find('[name^="modify"], [name^=" add"]').each(function(){
			surveyId = $(this).attr('name').match(/(modify| add)([^_]*)_[0-9]*/)
			if(surveyId!= null){
				main.surveyId = surveyId[2]
				return false;
			}
		})

		$( document ).ajaxError(function( event, jqxhr, settings, thrownError ) {
			main.message(MdmConst.txt.error_connection);
		});
		modal = $('#myModal .modal-body')
	},
	getform : function(html, initializa, delbootstarp){
		data =$(html).find('#content')
		data.find('ul.list-group').remove()
		data.find('input[name=cancel]').remove()
		data.find('script[src*="bootstrap-table.js"]').remove()
		data.find('#ques_list').remove()
		data.find('#bloc_page').css('width', '100%')
		data.find('form').css('position', 'relative')
		data.find('script[src*="/custom"]').remove()
		if(delbootstarp){
			this.cleanScript(data)
		}
		if(initializa){
			initYahoo=''
			if(typeof YAHOO.showdiv ==='undefined' ){
				data.append('<link rel="stylesheet" type="text/css" href="https://mdmdpi-belgique.voozanoo.net//javascript/voo3/meta-3.4.5/assets/calcul_variable_engine_module.css">\
					<script type="text/javascript" src="https://mdmdpi-belgique.voozanoo.net//javascript/voo3/meta-3.4.5/calcul_variable_engine_module.js"></script>')
			}
			if(typeof YAHOO.showdiv ==='undefined' ){
				initYahoo=initYahoo+'YAHOO.namespace("showdiv.container");\
global_cal_var_objects = new Object();\
global_cal_var_objects[\'blurfunc\'] = new Object();\
global_cal_var_objects[\'obj_var\'] = new Object();\
global_cal_var_objects[\'obj_test\'] = new Object();\
'
			}
			ICVEM=html.match(/(function[\s]*InitializeCalculVariableEngineModule[^]*)YAHOO.util.Event.addListener.*InitializeCalculVariableEngineModule\);/)[1]
			data.append('<script type="text/javascript">\
	MdmFct.updateData();\
	MdmFct.hideWhiteFields();\
	'+initYahoo+ICVEM+'\
	InitializeCalculVariableEngineModule();\
</script>')
		}

		return(data)
	},
	cleanScript : function(html){
		html.find('script').remove()
	},
	loadingForm : function(form, status){
		form.find('input, textarea, button, select').prop('disabled', status);
		if(status)
			form.append('<div class="loading" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; background-color: #FFF;">\
				<span style="position: absolute; top: 50%; transform: translateY(-50%); font-size: 20px; width: 100%; text-align: center;">Loading... <i class="fa fa-spinner fa-spin "></i></span></div>' );
		else
			form.find('.loading').remove()
	}, 
	updateData : function(){
		main = this
		main.dataNow($('.dua'))
		$('.du').each(function(){
			fieldset = $(this).closest('fieldset')
			if( fieldset.find('input[id$="[d]"]').val()+fieldset.find('input[id$="[m]"]').val()+fieldset.find('input[id$="[y]"]').val()==''){
				main.dataNow($(this))
			}
		})
	},
	dataNow : function( field){
		var n=new Date();
		field.each(function(){
			fieldset = $(this).closest('fieldset')

			fieldset.find('input[id$="[d]"]').val(('0'+n.getDate()).slice(-2)).focus()
			fieldset.find('input[id$="[m]"]').val(('0'+(n.getMonth()+1)).slice(-2))
			fieldset.find('input[id$="[y]"]').val(n.getFullYear()).focus()
		})
	},
	hideWhiteFields : function(){
		$('.hide_white').closest('fieldset').find('input').not(':button, :submit, :reset, :hidden').filter('[value=""]').closest('.column_content').hide()
		$('.hide_white').closest('fieldset').find('select').each(function(){
			select=$(this)
			if (select.find('option').length==0 || select.find(':selected').length==0 || select.find(':selected').val()==""){
 				select.closest('.column_content').hide();
 			}
		})
		$('.hide_white').closest('fieldset').on('change', 'input', function(){
			field = $(this).not(':button, :submit, :reset, :hidden')
			if(field.length){
				if(field.val()=="")
					field.closest('.column_content').hide()
			}
		} )
		$('.hide_white').closest('fieldset').on('change', 'select', function(){
			select=$(this)
			if (select.find(':selected').length==0 || select.find(':selected').val()==""){
 				select.closest('.column_content').hide();
 			}
		} )
	},
	setCookie : function(cname,cvalue,duration) {
    var d = new Date();
    d.setTime(d.getTime() + duration);
    // d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	},
	getCookie : function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
	},
	scrollTo : function(){
		main=this
		tagToScrool = main.getCookie('mdm_'+main.form_id_screen)
		if(tagToScrool){
			if($('#'+tagToScrool).offset()){
				$('html, body').animate({
	            scrollTop: $('#'+tagToScrool).offset().top + 'px'
	        }, 'fast');
			}
		}
	},
	initInputValue : function(){
		main=this
		$('.init-value').each(function(){
			destination = $('#'+$(this).data('destination'))
			if (destination.length > 0 && destination.val()=="")
				destination.val($(this).data('value')) 
		})
	},
	addCss : function(){
		main=this
		cssTexte=''
		cssBorderColor=[]

		$('[id^="onform_"]').each(function(){
			onform=$(this)
			currentColor = $(this).data('info-color')
			if(typeof currentColor !=='undefined' && currentColor != false){
				currentColor=currentColor.replace(/ /g,"_")
				currentColorName = currentColor.replace(/[#@$.&]/g,"")
				if(cssBorderColor.indexOf(currentColor) <0){
					cssBorderColor.push(currentColor)
					cssTexte=cssTexte+'.table > tbody > tr.highlight.highlight-'+currentColorName+'>td {\
    border-bottom: solid 4px '+currentColor+';\
    border-top: solid 4px '+currentColor+';\
}\
.table > tbody > tr.highlight.highlight-'+currentColorName+'>td:first-child {\
    border-left: solid 4px '+currentColor+';\
}\
.table > tbody > tr.highlight.highlight-'+currentColorName+'>td:last-child {\
    border-right: solid 4px '+currentColor+';\
}\
'
				}
			}
		})

		$('head').append('<style type="text/css">\
.alert-custom{\
    font-size: 30px;\
    width: 400px;\
    padding: 30px;\
    text-align: center;\
    top: 30%;\
    border-width: 2px;\
}\
textarea{\
	    width: 69%;\
}\
.yui-skin-sam div.yui-ac {\
    width: 100% !important;\
}\
.yui-skin-sam input.yui-ac-input {\
    width: 69%;\
}\
.yui-skin-sam div.yui-ac-container {\
    width: 69%;\
}\
#content .listing .btn { \
    padding: 0;\
    min-width: 26px;\
    margin: 0 !important;\
    min-height: 27px;\
}\
.modal .modal-body {\
    max-height: 90vh;\
    overflow-y: scroll;\
    overflow-x: hidden;\
}\
.dart {\
    display: inline-block;\
    width: 24px;\
    height: 24px;\
    opacity: 0.25;\
}\
.dart.dart-up:after {\
    content: "▲";\
}\
.dart.dart-down:after {\
    content: "▼";\
}\
.dart.dart-click {\
    cursor: pointer;\
    opacity: 1;\
}\
'+cssTexte+'.table > tbody > tr.highlight.highlight-down td{\
    border-bottom: none;\
}\
.table > tbody > tr.highlight.highlight-info td {\
    border-top: none;\
}\
.table > tbody > tr.highlight table {\
    border: none;\
}\
</style>')

	}
};

function l() {

	if(typeof mdm === 'undefined')
		mdm = MdmFct
	if (!MdmConst.debug) mdm.hiddenSubForm();
	if(typeof mdm.urlScript === 'undefined'){
		mdm.addCss()
		mdm.initModal();
		if (!MdmConst.debug) mdm.moveSubForm();
	}
	mdm.initInputValue();
	mdm.updateData();
	mdm.hideWhiteFields();
	mdm.scrollTo();
};  
if (window.addEventListener)  
	window.addEventListener("load", l, false);  
else if (window.attachEvent) 
	window.attachEvent("onload", l); 
else 
	window.onload = l;
