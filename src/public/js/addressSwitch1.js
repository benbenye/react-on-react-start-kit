// {htmlTabOne:"",htmlTabTwo:"",htmlTabThree:"",htmlContentOne:"",htmlContentTwo:"",htmlContentThree:""}
function AddressSwitch(pageFlag,options){
	var that = this;

	// site-站点， product-商品页， address-收货地址(暂不考虑)
	that.pageFlag = pageFlag || 'site';

	// dom
	that.htmlTabOne       = options.htmlTabOne;
	that.htmlTabTwo       = options.htmlTabTwo;
	that.htmlTabthree     = options.htmlTabThree;

	that.htmlContentOne   = options.htmlContentOne;
	that.htmlContentTwo   = options.htmlContentTwo;
	that.htmlContentYhree = options.htmlContentThree;

	if(that.pageFlag == 'product'){
		that.htmlShowText = options.htmlShowText;// 用于初始化收货地址
	}
	that.defaultAddObj = that.getDefaultAddObj();

}

AddressSwitch.prototype.initAddress = function() {
	
};

AddressSwitch.prototype.getDefaultAddObj = function() {
	var that       = this,
			addObj     = {},
			addAllList = that.getAddAllList();

	var getOneObj  = function(id,isOne){
		var obj = {tid:id, isParent: false};

		for(var i = 0, j = addAllList.length; i < j; ++i){
			if(addAllList[i].tid == id || addAllList[i].parent_id == id){
					obj.name = addAllList[i].name;
			    (obj.isParent = addAllList[i].parent_id?true:false)
			    break;
			}
		}
		return obj;
	}

	addObj.one     = getOneObj($.cookie('cb_province_id') || 110000);
	addObj.two     = that.pageFlag == 'site' ? {tid:""} : ($.cookie('cb_address_city')? {tid:$.cookie('cb_address_city')}:that.getAddById(addObj.one.tid)[0]);
	addObj.three   = that.pageFlag == 'site' ? {tid:""} : ($.cookie('cb_address_district')? {tid:$.cookie('cb_address_district')}: that.getAddById(addObj.two.tid)[0]);
	addObj.four    = that.pageFlag == 'site' ? {tid:""} : ($.cookie('cb_address_street')? {tid:$.cookie('cb_address_street')}: that.getAddById(addObj.three.tid)[0]);
	addObj.text = $.cookie('cb_address_text')||[
		addObj.one.name,
		addObj.one.isParent?addObj.three.name:addObj.two.name,
		addObj.one.isParent?addObj.four.name:addObj.three.name
	].join('');

	return addObj;
};

AddressSwitch.prototype.getAddAllList = function() {
	var data = [];
	$.ajax({
    type: 'post',
    dataType: 'json',
    async: false,
    url: "/Index/getAjaxAddrList",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    success: function (returnData){data = returnData}
	});
	return data;
};

AddressSwitch.prototype.getAddById = function(id) {
	var data = {};
	$.ajax({
    type: 'post',
    dataType: 'json',
    url: "/Index/getAddrListById",
    async: false,
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: {id: id},
    success: function (returnData){data = returnData;}
	});
	return data;
};