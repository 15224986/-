/**
 *
 * @effect          页面实现的方法
 * @author          作者
 * @param           参数
 * @example         例子
 * @link            链接
 * @namespace       命名空间
 * @requires        依赖
 * @return          返回值
 * @version         版本号
 * @date            时间
 *
 */
$(function () {
    /**
	 * 左导航的展开和关闭
	 */
    $(document).on('click', '.page-sidebar-toggle', function(event) {
        if( $("#page-container").hasClass('page-sidebar-hide') ){
			$("#page-container").removeClass('page-sidebar-hide');
		}else{
			$("#page-container").addClass('page-sidebar-hide');
		}
    });

	/**
	 * 在岗人员、记事栏
	 * 调用tab切换
	 */
	$(".moc-tabs").mocTabs({
		startBack:function(){
			$(".moc-tabs-body").animate({
			   scrollTop: 0
			}, 0);
		}
	});
	
	
	/**
	 * 调用放大缩小的插件
	 */
	smoothZoom();
	
	// toggle-btn
	$(document).on('click', '.toggle-btn', function(event) {
	    $(this).closest('.boxs').toggleClass('close');
	});
	
});


/**
 * 调用放大缩小的插件
 */
var ratio = 1;
function smoothZoom() {
	var mapBox = $('.map-box');
	var w = mapBox.width();
	var h = mapBox.height();
	var iw = '6480';
	var ih = '3443';
	var scale = 30;
	$('#image').width(iw).height(ih);
	$('#image').smoothZoom({
		width: w,   // 显示窗口的宽度
		height: h, // 显示窗口的高度
		initial_ZOOM: scale, // 初始化显示的大小
		zoom_MIN: w / iw * 50, // 最小可以缩放到
		zoom_MAX: 500, // 最大可以缩放到
		zoom_BUTTONS_SHOW: false, // 放大和缩小的按钮是否显示 （默认：true）
		pan_BUTTONS_SHOW: false, // 移动和关闭按钮的按钮是否显示 （默认：true）
		reset_ALIGN_TO: 'center center', // 图像可以在重置时对齐到期望的位置。例如:“ Top Left ”
		pan_LIMIT_BOUNDARY: false,
		mouse_DOUBLE_CLICK: false,
		background_COLOR: 'transparent',
		container: 'mapwrap', 						// 设置映像的容器元素(容器的id)
		button_ALIGN: 'center right',				// Button set can be aligned to any side or center
		button_MARGIN: 30,
		initial_POSITION: "3240 2000",						//Initial location to be focused in pixel value [150,150 or 150 150]
		on_ZOOM_PAN_COMPLETE: function (zoomData) {
			ratio = zoomData.ratio;
		}
	});
};


/**
 * 绘画股道
 */
function drawTrack(trackData){
	$.each( trackData, function(index, el) {
	    var $item = $('<div>', {
	        'class': "stock-market-item",
			'data-obj': JSON.stringify(el),
	        style: 'top:' + el.y + 'px;left:' + el.x + 'px;width:' + el.width + 'px;',
	    }).appendTo($(".stock-market"));
	});
}

/**
 * 全部火车显示的方法
 */
function showSpecialTrains(specialTrainArr) {
    // 调用火车的信息
    $.each(specialTrainArr, function (index, el) {
        showTrain(el);
    });
}

/**
 * 火车显示的方法
 *
 */
function showTrain(object) {
    /**
	 * 找到所在股道的信息
	 */
	var track = '';
	$.each(trackData, function (index, el) {
	    if( object.track == el.id ){
			track = el;
		}
	});
	
    /**
	 * 生成火车信息
	 */
    var train = $('<div>', {
        'id': 'train_' + object.id,
        'style': "top:" + track.y + "px; left:" + track.center + "px;",
        'class': "stock-train-item ",
        'data-train-id': object.id,
        'data-train-thing': object.thing,
        'data-stock-id': object.track,
		'data-step-length': object.step ? object.step.length : 0,
    }).appendTo($(".stock-train"));
    if (object.state == 'n') {
        $(train).addClass('stock-train-item-warning');
    }
    // 中间信息
    var trainInfo = $('<div>', {
        'class': "train-info"
    }).appendTo(train);
    $('<span>', {
        'text': object.numberWest || '',
        'class': "train-info-item"
    }).appendTo(trainInfo);
    $('<span>', {
        'text': object.number || '',
        'class': "train-info-item train-info-number"
    }).appendTo(trainInfo);
    $('<span>', {
        'text': object.numberEast || '',
        'class': "train-info-item"
    }).appendTo(trainInfo);

    /**
	 * 防溜工具的盒子
	 */
    // 左侧
    var trainLeft = $('<div>', {
        'class': "stock-train-step-box stock-train-left"
    }).appendTo(train);
	// 左侧顶部
	var trainLeftTop = $('<div>', {
	    'class': "stock-train-step-box stock-train-left-top"
	}).appendTo(train);
    // 右侧
    var trainrRight = $('<div>', {
        'class': "stock-train-step-box stock-train-right"
    }).appendTo(train);
    // 右侧顶部
    var trainRightTop = $('<div>', {
        'class': "stock-train-step-box stock-train-right-top"
    }).appendTo(train);
	
    /**
     * 循环生成防溜措施
     */
    object.step && $.each(object.step, function (index, el) {
        // 类型 shoes：铁鞋  fastener：紧固器  brake：手闸
        if (el.type === "shoes") {
            if (el.direction === "l") {
                var step = $("<div>", {
                    class: 'stock-train-step stock-train-shoes'
                }).prependTo(trainLeft);
            } else {
                var step = $("<div>", {
                    class: 'stock-train-step stock-train-shoes'
                }).appendTo(trainrRight);
            }
        }
		if (el.type === "fastener") {
		    if (el.direction === "l") {
		        var step = $("<div>", {
		            class: 'stock-train-step stock-train-fastener'
		        }).prependTo(trainLeftTop);
		    } else {
		        var step = $("<div>", {
		            class: 'stock-train-step stock-train-fastener'
		        }).appendTo(trainRightTop);
		    }
		}
        if (el.type === "brake") {
            if (el.direction === "l") {
                var step = $("<div>", {
                    class: 'stock-train-step stock-train-brake'
                }).appendTo(trainLeftTop);
            } else {
                var step = $("<div>", {
                    class: 'stock-train-step stock-train-brake'
                }).prependTo(trainRightTop);
            }
        }
        

        // 添加文字
        if (el.name) {
            $("<span>", {
                class: 'top-name',
                text: el.name
            }).appendTo(step);
        }
        if (el.text) {
            $("<span>", {
                class: 'top-text',
                text: el.text
            }).appendTo(step);
        }
		step.attr('data-step-id', el.id);
        // 添加状态
        if (el.state == 'n') {
            step && step.addClass('questions');
        }
    });
}


/**
 * 清空选中的值
 */
function clearValue($form){
	$form.find('select').select2("val", "");
	$form.find('input.text').val("");
	$form.find('.self-is-clone').remove();
};

/**
 * 磁贴 相关的方法
 */
var dragStartX = 0,
	dragStartY = 0;
function dragStart(ev){
	// console.log(ev);
	dragStartX = ev.pageX - $(ev.target).offset().left;
	dragStartY = ev.pageY - $(ev.target).offset().top;
}
function dragEnd(ev){
	ev.preventDefault(); //阻止默认行为
	/**
	 * 计算出位置
	 */
	var ofX = (ev.pageX - dragStartX - $("#stockToolBox").offset().left)/ratio,
		ofY = (ev.pageY - dragStartY - $("#stockToolBox").offset().top)/ratio;
	/**
	 * 所需数据
	 */
	var id = guid();
	var text = $(ev.target).text();
	var type = $(ev.target).data('type');
	var system = $(ev.target).data('system');
	appData.stockToolList.push({
	    "id": id,
	    "x": ofX,
	    "y": ofY,
	    "type": type,
	    "text": text,
	    "system": system
	});
	drawTool(appData.stockToolList);
}
function drawTool(data){
	// 清空
	$("#stockToolBox").empty();
	// 生成dom
	$.each( data, function(index, el) {
	    var train = $('<a>', {
	    	'text': el.text,
	    	'data-type': el.type,
	    	'data-system': el.system,
	        'style': "top:" + el.y + "px; left:" + el.x + "px;",
			'id': el.id,
	        'class': "tool-item",
	    }).appendTo($("#stockToolBox"));
	});
}
$(function(){
	var $container = $('#image');
	$('#stockToolBox').livequery('.tool-item', function () {
	    $(this).draggable({
			appendTo: '#stockToolBox',
			start: function (e, ui) {
				$container.smoothZoom('pause');
			},
			drag: function (e, ui) {
				var point = {
					'x': ui.position.left / ratio,
					'y': ui.position.top / ratio
				};
				ui.position.left = point.x;
				ui.position.top = point.y;
			},
			stop: function (e, ui) {
				$container.smoothZoom('resume');
				var tool = appData.stockToolList.find(function (n) {
					return n.id == ui.helper.attr('id');
				});
				tool.x = ui.position.left;
				tool.y = ui.position.top;
			}
		});
	});
	
	/**
	 * 重置已拖入磁贴
	 */
	$(document).on('click', '.tool-item-reset', function(event) {
	    appData.stockToolList = [];
	    $("#stockToolBox").empty();
	});
	
	/**
	 * 双击删除
	 */
	$(document).on('dblclick', '#stockToolBox .tool-item', function(event) {
		var id = $(this).attr('id');
	    var index = appData.stockToolList.findIndex(function (n) {
	        return n.id == id
	    });
	    appData.stockToolList.splice(index, 1);
		drawTool(appData.stockToolList);
	});
	
	
});





	
	
	
/**
 * 获取当前时间
 */
function startCurrentTime(date){
	var nowTime = date || moment().format('YYYY-MM-DD HH:mm:ss'); //当前时间
	setCurrentTime(nowTime);
	setInterval(function () {
		nowTime = moment(nowTime).add(1, 'seconds');
		setCurrentTime(nowTime);
	}, 1000);
};
function setCurrentTime(nowTime){
	var day = moment(nowTime).format("YYYY年MM月DD日");
	var week = getWeek(nowTime);
	var hour = moment(nowTime).hour()>9?moment(nowTime).hour():'0'+moment(nowTime).hour();
	var minute = moment(nowTime).minute()>9 ? moment(nowTime).minute():'0'+moment(nowTime).minute();
	var second = moment(nowTime).second()>9 ? moment(nowTime).second():'0'+moment(nowTime).second();
	
	$("#currentDay").text(day);
	$("#currentWeek").text(week);
	$("#currentHour").text(hour);
	$("#currentMinute").text(minute);
	$("#currentSecond").text(second);
};
function getWeek(date) {
	var week = moment(date).day();
	switch (week) {
		case 1:
			return '星期一'
		case 2:
			return '星期二'
		case 3:
			return '星期三'
		case 4:
			return '星期四'
		case 5:
			return '星期五'
		case 6:
			return '星期六'
		case 0:
			return '星期日'
	}
};



function S4() {
    return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
}
function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
}

/**
 *
 * @effect          常用插件的调用
 * @author          作者
 * @param           参数
 * @example         例子
 * @link            链接
 * @namespace       命名空间
 * @requires        依赖
 * @return          返回值
 * @version         版本号
 * @date            时间
 *
 */
$(function () {
	
	
	/**
	 * 下拉的美化
	 */
	if ($('.select-2').select2) {
	    // 正常调用
	    $('.select-2').select2({
	        placeholder:"请选择"
	    });
	    // 不带搜索框 select-2-no-seach
	    $('.select-2ns').select2({
	        minimumResultsForSearch: Infinity,
	        placeholder:"请选择"
	    });
	    // 多选时选中不关闭继续选择 select-2-no-close
	    $('.select-2nc').select2({
	        closeOnSelect: false,
	        placeholder:"请选择"
	    });
	    // 多选时选中不关闭继续选择，且可以自定义选项 select-2-no-close-tag
	    $('.select-2nc-tag').select2({
	        tags: true,
	        closeOnSelect: false,
	        placeholder:"请选择"
	    });
	    // 添加自定义选项
	    $('.select-2tag').select2({
	        tags: true,
	        placeholder:"请选择"
	    });
	}
	
	/**
	 * 单选and多选用iCheck美化
	 */
	if ($(".icheck-primary").iCheck) {
	    // iCheck美化
	    $(".icheck-primary").iCheck({
	        checkboxClass: 'checkbox-primary',
	        radioClass: 'radio-primary'
	    });
	
	    $(".icheck-success").iCheck({
	        checkboxClass: 'checkbox-success',
	        radioClass: 'radio-success'
	    });
	
	    /**
	     * 给多选按钮添加全选和不全选事件
	     */
	    var checkAll = $('[ichecked-for][type="checkbox"]');
	    // 1 通过全选按钮的状态，改变负责的多选框的状态
	    $(document).on('ifChecked ifUnchecked', '[ichecked-for][type="checkbox"]', function(event) {
	        var txt = $(this).attr('ichecked-for');
	        var checkboxes = $('[ichecked-val="'+txt+'"]');
	        if (event.type === 'ifChecked') {
	            checkboxes.not('[disabled]').iCheck('check');
	        } else {
	            checkboxes.not('[disabled]').iCheck('uncheck');
	        }
	    });
	
	    // 2 通过全点击事件，实现不同的方法
	    $(document).on('ifChecked ifUnchecked', '[ichecked-val][type="checkbox"]', function(event) {
	        // 判断有没有在table的固定表头里面
	        if ($(this).attr('old-name') && $(this).attr('old-name')!=" " ) {
	            var oldName = $(this).attr('old-name');
	            var fixedtableId = $(this).closest('td,th').attr('fixedtable-clone-id');
	            var item = $('[fixedtable-id="'+fixedtableId+'"]');
	            if (event.type == 'ifChecked') {
	                item.find('[name="'+oldName+'"]').iCheck('check');
	            } else {
	                item.find('[name="'+oldName+'"]').iCheck('uncheck');
	            }
	        }
	        // 通过点击多选框，改变全选框的状态
	        if (checkAll.length>0) {
	            var val = $(this).attr('ichecked-val');
	            var Allcheck = $('[ichecked-for="'+val+'"]');
	            if ( Allcheck.length==1 && Allcheck.attr('ichecked-for')!=undefined ) {
	                var checkboxs = $('[ichecked-val="'+val+'"]');
	                if( checkboxs.not('[disabled]').filter(':checked').length == checkboxs.not('[disabled]').length ) {
	                    Allcheck.iCheck('check');
	                } else {
	                    Allcheck.prop('checked',false);
	                    Allcheck.parent().removeClass('checked').attr('aria-checked', 'false');
	                }
	                Allcheck.iCheck('update');
	            }
	        }
	    });
	}
	
	
	if ( $("form").Validform ) {
	    
	    // 给form标签配上 data-Validform="Validform" 启动表单验证插件
	    // 给form标签配上 data-beforeCheck="" 传入方法名，不用带()，Validform 在表单提交执行验证之前执行的函数，curform参数是当前表单对象。
	    // 给form标签配上 data-beforeSubmit="" 传入方法名，不用带()，Validform 在验证成功后，表单提交前执行的函数，curform参数是当前表单对象。
	    // 给form标签配上 data-callback="" 传入方法名，不用带()，Validform 返回数据data是json格式，{"info":"demo info","status":"y"}
	    // 给form标签配上 ignoreHidden="false"  true忽略验证隐藏的元素，false则验证隐藏的元素
	    // 
	    // 
	    // 
	    // nullmsg      当表单元素值为空时的提示信息，不绑定，默认提示"请填入信息！"。
	    // sucmsg       当表单元素通过验证时的提示信息，不绑定，默认提示"通过信息验证！"。
	    // errormsg     输入内容不能通过验证时的提示信息，默认提示"请输入正确信息！"。
	    // ignore       绑定了ignore="ignore"的表单元素，在有输入时，会验证所填数据是否符合datatype所指定数据类型，没有填写内容时则会忽略对它的验证；
	    //              绑定了ignore="yes"的表单元素，会忽略对它的验证；
	
	    var ValidformDom = $('[data-Validform="Validform"]');
	    var ignoreHidden = ValidformDom.attr('ignoreHidden')==="false" ? false : true;
	    ValidformDom.Validform({
	        btnSubmit: "#validFormSubmit",  // 可选项 #ValidformSubmit是该表单下要绑定点击提交表单事件的按钮;如果form内含有submit按钮该参数可省略;
	        btnReset: "#validFormReset",    // 可选项 #ValidformReset是该表单下要绑定点击重置表单事件的按钮;如果form内含有reset按钮该参数可省略;
	        ignoreHidden: ignoreHidden,     // 可选项 true | false 默认为false，当为true时对:hidden的表单元素将不做验证;
	        dragonfly: false,               // 可选项 true | false 默认false，当为true时，值为空时不做验证；
	        tipSweep: false,                // 可选项 true | false 默认为false，true:时提示信息将只会在表单提交时触发显示，各表单元素blur时不会触发信息提示；
	        showAllError: true,             // 可选项 true | false 默认为false，true：提交表单时所有错误提示信息都会显示；false：一碰到验证不通过的对象就会停止检测后面的元素，只显示该元素的
	        label: ".Validform_label",      // 可选项 选择符，在没有绑定nullmsg时查找要显示的提示文字，默认查找".Validform_label"下的文字;
	        postonce: false,                // 可选项 表单是否只能提交一次，true开启，不填则默认关闭;
	        ajaxPost: false,                // 可选项 使用ajax方式提交表单数据，默认false，提交地址就是action指定地址;
	        tiptype: function (msg, o, cssctl) {
	            // 找到提示文字的输出位置
	            var parentDom = o.obj.closest('.form-content');
				if( parentDom.find(".form-checktip").length <= 0 ){
					var tipDom = $("<p>", {
					    class: 'form-checktip'
					}).appendTo(parentDom);
				}else{
					var tipDom = parentDom.find(".form-checktip");
				}
	            cssctl(tipDom, o.type);
	            tipDom.text(msg);
	
	            /**
	             * 根据验证的状态不同，添加不同的类名
	             */
	            // if ( o.type==1 ) {
	            //     parentDom.removeClass("has-passed has-ignore has-wrong").addClass("has-loading");;
	            // }else if ( o.type==2 ) {
	            //     parentDom.removeClass("has-loading has-ignore has-wrong").addClass('has-passed');
	            // }else if ( o.type==4 ) {
	            //     parentDom.removeClass("has-passed has-loading has-wrong").addClass('has-ignore');
	            // }else {
	            //     parentDom.removeClass("has-passed has-ignore has-loading").addClass('has-wrong');
	            // }
	
	            /**
	             * 下面写法是成功不提示
	             */
	            if(o.type != 2){
	                tipDom.text(msg);
	            }else{
	                tipDom.text('');
	                tipDom.removeClass('Validform_right');
	            }
	        },
	        beforeCheck:function(curform){
	            // 在表单提交执行验证之前执行的函数，curform参数是当前表单对象。
	            // 这里明确return false的话将不会继续执行验证操作;
	            var beforeCheckFn = eval( ValidformDom.attr('data-beforeCheck') );
	            if (typeof beforeCheckFn === 'function' ) {
	                var flag = beforeCheckFn(curform); 
	                if ( flag === false ) {
	                    return false;
	                }
	            }  
	        },
	        beforeSubmit:function(curform){
	            // 在验证成功后，表单提交前执行的函数，curform参数是当前表单对象。
	            // 这里明确return false的话表单将不会提交;
	            var beforeSubmitFn = eval( ValidformDom.attr('data-beforeSubmit') );
	            if (typeof beforeSubmitFn === 'function' ) {
	                var flag = beforeSubmitFn(curform); 
	                if ( flag === false ) {
	                    return false;
	                }
	            }  
	        },
	        callback:function(data){
	            // 返回数据data是json对象，{"info":"demo info","status":"y"}
	            // info: 输出提示信息;
	            // status: 返回提交数据的状态,是否提交成功。如可以用"y"表示提交成功，"n"表示提交失败，在ajax_post.php文件返回数据里自定字符，主要用在callback函数里根据该值执行相应的回调操作;
	            // 你也可以在ajax_post.php文件返回更多信息在这里获取，进行相应操作；
	            // ajax遇到服务端错误时也会执行回调，这时的data是{ status:**, statusText:**, readyState:**, responseText:** }；
	     
	            // 这里执行回调操作;
	            // 注意：如果不是ajax方式提交表单，传入callback，这时data参数是当前表单对象，回调函数会在表单验证全部通过后执行，然后判断是否提交表单，如果callback里明确return false，则表单不会提交，如果return true或没有return，则会提交表单。
	            var callbackFn = eval( ValidformDom.attr('data-callback') );
	            if (typeof callbackFn === 'function' ) {
	                var flag = callbackFn(data); 
	                if ( flag === false ) {
	                    return false;
	                }
	            }
	        }
	    }).ignore('[disabled="true"],[ignore="yes"]'); // 对disabled="true"的不验证, 如果想验证disabled状态的，可以使用disabled、disabled="true"等
	    // 表单验证兼容select2
	    $('.select-2, .select-2ns, .select-2nc, .select-2-template, .select-2ns-template, .select-2nc-template, .select-2-call, .select-2ns-call, .select-2nc-call').on('change', function(e){
	        $(this).blur();
	    });
	    // 表单验证兼容iCheck
	    $('.icheck-primary, .icheck-primary-template, .icheck-primary-call').on('ifChanged', function(event){
	        $(this).blur();
	    });
	}
	
	
	
	/**
	 * 左导航的调用
	 */
	$('[data-toggle="left-nav"]').mocLeftNav({
	    activeCls:'active'
	});
	
	/**
	 * 调用下拉按钮
	 */
	$('[data-toggle="dropdown"]').dropdown();


	/**
	 * bootstrap 中modal可以拖动
	 * 调用的jquery ui 的拖动方法
	 */
	if ($(document).draggable) {
	    $(".modal-draggable").draggable({
	        handle: ".modal-header"
	    });
	    $(".mocAlert").draggable({
	        handle: ".mocAlert_head"
	    });
	}

});