/*
DLG.layout
*/

if (typeof DLG == "undefined") {var DLG = {};}

DLG.Layout = {
	init: function() {
		//$("ul.select").jScrollPane({showArrows:true, scrollbarWidth: 15, arrowSize: 16, scrollbarMargin: 0});
		$("ul#views").tabs();
		$("input:checkbox").checkbox({cls:'jquery-safari-checkbox'});
		DLG.Layout.doTabs();
	},
	doTabs: function() {
		var intHeight = 0;
		$("#nav > ul").tabs({
			show: function(ui) {
				var panelHeight = $(ui.panel).height();
				$(ui.panel).height(intHeight);
				$(ui.panel).animate({ 
					height: panelHeight
				}, {
					step: function() {
						window.nativeWindow.height = $(ui.panel).height() + 145;
					},
					complete: function() {
						intHeight = window.nativeWindow.height - 145;
					},
					duration: "normal"
				});
				//$("ul.select", ui.panel).jScrollPane({showArrows:true, scrollbarWidth: 15, arrowSize: 16, scrollbarMargin: 0});
			}
		});
		var intHeight = window.nativeWindow.height - 145;
	}
}

$(document).ready(DLG.Layout.init);