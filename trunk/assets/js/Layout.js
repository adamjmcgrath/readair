/*
Layout
Responsible for the resizeables and custom scrollbars
*/

var Layout = function() {
	
	/* HTML elements 
	------------------------------------------ */
	
	// resizables
	var feeds_resize = null;
	var items_resize = null;
	var item_resize = null;
	
	// scrollers
	var feeds_scroll = null;
	var items_scroll = null;
	var item_scroll = null;
	
	return {
		init: function() {
			
			// Set HTML Elements
			feeds_resize = $("#feeds");
			items_resize = $("#items");
			item_resize = $("#item-inner");
			feeds_scroll = $("#feeds-scroll-wrap");
			items_scroll = $("#items-scroll-wrap");
			item_scroll = $("#item-inner-iframe");

			// set up resizables
			feeds_resize.resizable({handles: 'e', minWidth: 180, maxWidth: 240, resize: this.updateScrollBars});
			items_resize.resizable({handles: 's', minHeight: 25, resize: this.updateScrollBars});
			window.addEventListener("resize", this.updateScrollBars);
		},
		updateScrollBars: function() {
			Layout.updateTagScrollBar();
			Layout.updateItemsScrollBar();
			Layout.updateItemScrollBar();
		},
		updateTagScrollBar: function() {
			feeds_scroll.jScrollPane({showArrows:true, scrollbarWidth: 15, arrowSize: 16, scrollbarMargin: 0});
			var tagScrollBar = $(".jScrollPaneContainer:first", feeds_resize);
			tagScrollBar.css({
			  height: (feeds_resize.height() - 23) + "px",
			  width: (feeds_resize.width()) + "px"
			})
		},
		updateItemsScrollBar: function() {
			items_scroll.unbind("scroll");
			items_scroll.jScrollPane({showArrows:true, scrollbarWidth: 15, arrowSize: 16, scrollbarMargin: 0, animateTo: false});
			var itemsScrollBar = $(".jScrollPaneContainer:first", items_resize);
			itemsScrollBar.css({
				height: (items_resize.height() - 9) + "px",
				width: (items_resize.width()) + "px"
			})
			items_scroll.scroll(Application.itemsScrollHandler);
		},
		updateItemScrollBar: function() {
			item_scroll.jScrollPane({showArrows:true, scrollbarWidth: 15, arrowSize: 16, scrollbarMargin: 0});
			var itemScrollBar = $(".jScrollPaneContainer:eq(0)", item_resize);
			itemScrollBar.css({
			  height: (item_resize.height()) + "px",
			  width: (item_resize.width()) + "px"
			})
		},
		updateScroll: function(elm) {
			var pos = $(elm).offset();
			var yPos = pos.top;
			var tableBottom = items_resize.height() + 50;
			if (yPos > tableBottom) {
				items_scroll[0].scrollBy(100);
			}
		}
	}
}();


