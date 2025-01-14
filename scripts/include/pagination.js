/**
 * @name pagination分页插件 1.5.1
 * @version 1.5.1
 * @author mss
 * @url https://github.com/Maxiaoxiang/jQuery-plugins
 *
 * 
 * @调用方法
 * $(selector).pagination(option, callback);
 * -此处callback是初始化调用，option里的callback是点击页码后调用
 * -- example --
 * $(selector).pagination({
 *     ... // 配置参数
 *     callback: function(api) {
 *         console.log('点击页码调用该回调'); //切换页码时执行一次回调
 *     }
 * }, function(){
 *     console.log('初始化'); //插件初始化时调用该方法，比如请求第一次接口来初始化分页配置
 * });
 */
;
(function(factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define(["jquery"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
}(function($) {
    //配置参数
    var defaults = {
        totalData: false,                       // 数据总条数
        showData: false,                        // 每页显示的条数  可以根据数据的总条数和每页显示的条数，计算出一共有多少条
        pageCount: 9,                           // 总页数,默认为9  当 totalData && showData 成立的时候，pageCount 失去作用
        current: 1,                             // 当前第几页
        prevCls: 'pagination-prev',             // 上一页class
        nextCls: 'pagination-next',             // 下一页class
        prevContent: '上一页',                     // 上一页节点内容
        nextContent: '下一页',                     // 下一页节点内容
        activeCls: 'active',                    // 当前页选中状态class名
        isHide: true,                           // 总页数为0或1时隐藏分页控件
        coping: true,                           // 是否开启首页和末页，值为boolean
        homePage: '首页',                         // 首页节点内容,如果为""则显示为1
        endPage: '尾页',                          // 尾页节点内容,如果为""则显示总页数
        keepShowPN: false,                      // 是否一直显示上一页下一页
        mode: 'unfixed',                        // 分页模式，unfixed：不固定页码数量，fixed：固定页码数量
        count: 3,                               // 分页模式，unfixed：当前页前后分页个数，fixed：总共显示的分页数量+1 
        jump: true,                             // 是否开启跳转到指定页数，值为boolean类型
        jumpIptCls: 'pagination-ipt',           // 文本框的 class
        jumpIptTxt: '',                         // 文本框的 placeholder
        jumpBtnCls: 'pagination-btn',           // 跳转按钮的 class
        jumpBtn: '确定',                          // 跳转按钮的 text
        showTotalSize: false,                   // 是否显示总条数的信息  showTotalSize && totalData 同时存在 显示总条数
        showTotalSizeText: '记录',                    // 显示总条数附加的文字
        callback: function() {}                 // 回调
    };

    var Pagination = function(element, options) {
        //全局变量
        var opts = options, //配置
            current, //当前页
            $document = $(document),
            $obj = $(element); //容器

        /**
         * 设置总页数
         * @param {int} page 页码
         * @return opts.pageCount 总页数配置
         */
        this.setPageCount = function(page) {
            return opts.pageCount = page;
        };

        /**
         * 获取总页数
         * 如果配置了总条数和每页显示条数，将会自动计算总页数并略过总页数配置，反之
         * @return {int} 总页数
         */
        this.getPageCount = function() {
            return opts.totalData && opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
        };

        /**
         * 获取当前页
         * @return {int} 当前页码
         */
        this.getCurrent = function() {
            return current;
        };

        /**
         * 填充数据
         * @param {int} 页码
         */
        this.filling = function(index) {
            var html = '';
            current = parseInt(index) || parseInt(opts.current); //当前页码
            var pageCount = this.getPageCount(); //获取的总页数
            switch (opts.mode) { //配置模式
                case 'fixed': //固定按钮模式
                    html += '<a href="javascript:;" class="' + opts.prevCls + '">' + opts.prevContent + '</a>';
                    if (opts.coping) {
                        var home = opts.coping && opts.homePage ? opts.homePage : '1';
                        html += '<a class="pagination-first" href="javascript:;" data-page="1">' + home + '</a>';
                    }
                    var firstNumber = Math.floor(opts.count/2);
                    var start = current > opts.count - 1 ? current + opts.count - 1 > pageCount ? current - (opts.count - (pageCount - current)) : current - firstNumber : 1;
                    var end = current + opts.count - 1 > pageCount ? pageCount : start + opts.count;
                    for (; start <= end; start++) {
                        if (start != current) {
                            html += '<a href="javascript:;" data-page="' + start + '">' + start + '</a>';
                        } else {
                            html += '<span class="' + opts.activeCls + '">' + start + '</span>';
                        }
                    }
                    if (opts.coping) {
                        var _end = opts.coping && opts.endPage ? opts.endPage : pageCount;
                        html += '<a class="pagination-last" href="javascript:;" data-page="' + pageCount + '">' + _end + '</a>';
                    }
                    html += '<a href="javascript:;" class="' + opts.nextCls + '">' + opts.nextContent + '</a>';
                    break;
                case 'unfixed': //不固定按钮模式
                    if (opts.keepShowPN || current > 1) { //上一页
                        html += '<a href="javascript:;" class="' + opts.prevCls + '">' + opts.prevContent + '</a>';
                    } else {
                        if (opts.keepShowPN == false) {
                            $obj.find('.' + opts.prevCls) && $obj.find('.' + opts.prevCls).remove();
                        }
                    }
                    if (current >= opts.count + 2 && current != 1 && pageCount != opts.count) {
                        var home = opts.coping && opts.homePage ? opts.homePage : '1';
                        html += opts.coping ? '<a class="pagination-first" href="javascript:;" data-page="1">' + home + '</a><span>...</span>' : '';
                    }
                    var start = (current - opts.count) <= 1 ? 1 : (current - opts.count);
                    var end = (current + opts.count) >= pageCount ? pageCount : (current + opts.count);
                    for (; start <= end; start++) {
                        if (start <= pageCount && start >= 1) {
                            if (start != current) {
                                html += '<a href="javascript:;" data-page="' + start + '">' + start + '</a>';
                            } else {
                                html += '<span class="' + opts.activeCls + '">' + start + '</span>';
                            }
                        }
                    }
                    if (current + opts.count < pageCount && current >= 1 && pageCount > opts.count) {
                        var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
                        html += opts.coping ? '<span>...</span><a class="pagination-last" href="javascript:;" data-page="' + pageCount + '">' + end + '</a>' : '';
                    }
                    if (opts.keepShowPN || current < pageCount) { //下一页
                        html += '<a href="javascript:;" class="' + opts.nextCls + '">' + opts.nextContent + '</a>';
                    } else {
                        if (opts.keepShowPN == false) {
                            $obj.find('.' + opts.nextCls) && $obj.find('.' + opts.nextCls).remove();
                        }
                    }
                    break;
                case 'easy': //简单模式
                    break;
                default:
            }
            html += opts.jump ? '<p class="pagination-txt">共<span>' + pageCount + '</span>页，到第</p><input type="text" class="' + opts.jumpIptCls + '" placeholder="' + opts.jumpIptTxt + '"><p class="pagination-txt">页</p><a href="javascript:;" class="' + opts.jumpBtnCls + '">' + opts.jumpBtn + '</a>' : '';

            html += opts.showTotalSize && opts.totalData ? '<p class="pagination-total">共<span>' + opts.totalData + '</span>条'+ opts.showTotalSizeText +'</p>' : '';
            $obj.empty().html(html);
        };

        //绑定事件
        this.eventBind = function() {
            var that = this;
            var pageCount = that.getPageCount(); //总页数
            var index = 1;
            $obj.off().on('click', 'a', function() {
                if ($(this).hasClass(opts.nextCls)) {
                    if ($obj.find('.' + opts.activeCls).text() >= pageCount) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) + 1;
                    }
                } else if ($(this).hasClass(opts.prevCls)) {
                    if ($obj.find('.' + opts.activeCls).text() <= 1) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) - 1;
                    }
                } else if ($(this).hasClass(opts.jumpBtnCls)) {
                    if ($obj.find('.' + opts.jumpIptCls).val() !== '') {
                        index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                    } else {
                        return;
                    }
                } else {
                    index = parseInt($(this).data('page'));
                }
                that.filling(index);
                typeof opts.callback === 'function' && opts.callback(that);
            });
            //输入跳转的页码
            $obj.on('input propertychange', '.' + opts.jumpIptCls, function() {
                var $this = $(this);
                var val = $this.val();
                var reg = /[^\d]/g;
                if (reg.test(val)) $this.val(val.replace(reg, ''));
                (parseInt(val) > pageCount) && $this.val(pageCount);
                if (parseInt(val) === 0) $this.val(1); //最小值为1
            });
            //回车跳转指定页码
            $document.keydown(function(e) {
                if (e.keyCode == 13 && $obj.find('.' + opts.jumpIptCls).val()) {
                    var index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                    that.filling(index);
                    typeof opts.callback === 'function' && opts.callback(that);
                }
            });
        };

        //初始化
        this.init = function() {
            this.filling(opts.current);
            this.eventBind();
            if (opts.isHide && this.getPageCount() == '1' || this.getPageCount() == '0') {
                $obj.hide();
            } else {
                $obj.show();
            }
        };
        this.init();
    };

    $.fn.pagination = function(parameter, callback) {
        if (typeof parameter == 'function') { //重载
            callback = parameter;
            parameter = {};
        } else {
            parameter = parameter || {};
            callback = callback || function() {};
        }
        var options = $.extend({}, defaults, parameter);
        return this.each(function() {
            var pagination = new Pagination(this, options);
            callback(pagination);
        });
    };

}));