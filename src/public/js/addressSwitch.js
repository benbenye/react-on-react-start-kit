var findAddById = function(id){
    var returnList = null;

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: "/Index/getAddrListById",
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        data: {id: id},
        success: function (returnData){returnList = returnData;}
    });

    return returnList[0];
}
var findProNameAndParent = function(id){
    var obj = {tid:id, name:"",isParent:false};

  $.ajax({
      type: 'post',
      dataType: 'json',
      url: "/Index/getAjaxAddrList",
      async: false,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      success: function (returnData){
        for(var i = 0, l = returnData.length; i<l; ++i){
            if(returnData[i].tid == id || returnData[i].parent_id == id){
                obj.name = returnData[i].name;
                obj.isParent = returnData[i].parent_id?true:false;
                break;
            }
        }
      }
  });
  if(!obj.name) obj = {tid:110000,name:'北京',isParent:true}
  return obj;
}

var findListById = function(id,testId){
    var obj = {};

    $.ajax({
        type: 'post',
        dataType: 'json',
        url: "/Index/getAddrListById",
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        data: {id: id},
        success: function (returnData){
            for(var i = 0, l = returnData.length; i < l; ++i){
                if(returnData[i].tid == testId){
                    obj.tid = testId;
                    obj.name = returnData[i].name;
                }
            }
        }
    });

    return obj;
}
// 默认地址
var _one = findProNameAndParent($.cookie('cb_province_id')||110000);
var _two = $.cookie('cb_address_city')?findListById(_one['tid'],$.cookie('cb_address_city')):findAddById(_one['tid']);
var _three = $.cookie('cb_address_district')?findListById(_two['tid'],$.cookie('cb_address_district')):findAddById(_two['tid']);
var _four = $.cookie('cb_address_street')?findListById(_three['tid'],$.cookie('cb_address_street')):findAddById(_three['tid']);

var _textArr = [_one['name'],_one.isParent? _three['name']:_two['name'],_one.isParent?_four['name']:_three['name']];

var _addObj = {
    one:_one,
    two:_two,
    three:_three,
    four:_four,
    text:$.cookie('cb_address_text')||_textArr.join(''),
    isParent:_one.isParent
}
$('input[name="city"]').val(_addObj.two['tid']);
$('input[name="district"]').val(_addObj.three['tid']);
$('input[name="street"]').val(_addObj.four['tid']);


// 直辖市 134，省市县 123
(function (window) {
// 借用_addObj
    function Address(isProduct,options) {
        var that = this;

        that.provinceListHTML = isProduct ? $('#product-address .provinceList') : $("#provinceList");
        that.cityListHTML = isProduct ? $('#product-address .cityList') : $("#cityList");
        that.districtListHTML = isProduct ? $('#product-address .districtList') : $("#districtList");
        that.tabProvince = isProduct ? $('#product-address .tabProvince') : $("#tabProvince");
        that.tabCity = isProduct ? $('#product-address .tabCity') : $("#tabCity");
        that.tabDistrict = isProduct ? $('#product-address .tabDistrict') : $("#tabDistrict");

        that.isProductPage = isProduct;
        that.addressObj = {
            isParent:options.isParent,
            one:{tid: options.one['tid'], name: options.one['name']},
            two:{tid: options.two['tid'], name: options.two['name']},
            three:{tid: options.three['tid'], name: options.three['name']},
            four:{tid: options.four['tid'], name: options.four['name']}
        };
    }

    Address.prototype.setProductPage = function () {
        this.isProductPage = true;
    }

    Address.prototype.loadAddressFromCookie = function () {
        var that = this;

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Index/getAjaxAddrList",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (returnData)
            {
                that.provinceListHTML.empty();
                $.each(returnData, function (idx, province) {
                    var myClass = that.getCityNameClass(province.name);
                    that.provinceListHTML.append('<li class="' + myClass + '" data-province="' + province.tid + '" data-parent-id="' + province.parent_id + '" data-site-id="' + province.site_id + '"><span>' + province.name + '</span></li>');
                });

                that.bindProvinceListClick();

                that.setAddressInfoFromCookie();
            }
        });

        that.tabProvince.unbind("click").bind('click', function () {
            that.showProvinceTab();
        });
        that.tabCity.unbind("click").bind('click', function () {
            that.showCityTab();
        });
        that.tabDistrict.unbind("click").bind('click', function () {
            that.showDistrictTab();
        });
    };

    Address.prototype.bindProvinceListClick = function () {
        var that = this;
        that.provinceListHTML.find('li').each(function () {
            var li = $(this);
            li.unbind("click").bind('click', function () {
                var provinceId = li.attr('data-province');
                var parentId = li.attr('data-parent-id');
                var siteId = li.attr('data-site-id');
                var provinceName = li.find('span').text();

                var isParent = that.checkIsParentId(parentId);
                if(isParent){
                    that.addressObj.isParent = true
                    that.addressObj.one = {
                        tid: parentId,
                        name: provinceName
                    }
                    that.addressObj.two = {
                        tid: provinceId,
                        name: provinceName
                    }
                }else{
                    that.addressObj.isParent = false
                    that.addressObj.one = {
                        tid: provinceId,
                        name: provinceName
                    }
                }


                if (isParent && !that.isProductPage) {
                    that.addressObj.three = {tid:'',name:''}
                    that.addressObj.four = {tid:'',name:''}
                    that.writeHotCityToCookie(siteId, provinceId, provinceName, parentId);
                    window.location.reload();
                    return;
                }
                else {
                    that.showCityTab();
                    that.tabProvince.find('span').text(li.text());
                    li.addClass('on').siblings().removeClass('on');

                    var cityList = that.getAddrListById(provinceId);
                    that.showCityList(cityList, provinceId);
                    that.tabCity.find('span').text('请选择');
                }

            });
        });
    };

    Address.prototype.showProvinceTab = function () {
        var that = this;
        that.provinceListHTML.show();
        that.cityListHTML.hide();
        that.districtListHTML.hide();
        
        that.tabProvince.addClass('on');
        that.tabCity.removeClass('on');
        that.tabDistrict.removeClass('on');
        
    };

    Address.prototype.showCityTab = function () {
        var that = this;
        that.provinceListHTML.hide();
        that.cityListHTML.show();
        that.districtListHTML.hide();
        
        that.tabProvince.removeClass('on');
        that.tabCity.show().addClass('on');
        that.tabDistrict.removeClass('on');
    };
    
    Address.prototype.showDistrictTab = function () {
        var that = this;
        that.provinceListHTML.hide();
        that.cityListHTML.hide();
        that.districtListHTML.show();
        
        that.tabProvince.removeClass('on');
        that.tabCity.show().removeClass('on');
        that.tabDistrict.show().addClass('on');
    };


    Address.prototype.showCityList = function (cityList, provinceId) {
        var that = this;

        that.cityListHTML.empty();
        $.each(cityList, function (idx, city) {
            var myClass = that.getCityNameClass(city.name);
            that.cityListHTML.append('<li class="' + myClass + '" data-city="' + city.tid + '" data-site-id="' + city.site_id + '"><span>' + city.name + '</span></li>');
        });

        that.bindCityListClick(that.cityListHTML, provinceId);
    };

    Address.prototype.bindCityListClick = function (cityListHTML, provinceId) {
        var that = this;
        that.cityListHTML.find('li').each(function () {
            var liCity = $(this);
            liCity.unbind("click").bind('click', function () {
                var siteId = liCity.attr('data-site-id');
                var cityId = liCity.attr('data-city');
                var cityName = liCity.text();
                
                that.tabCity.find('span').text(cityName);

                if(that.addressObj.isParent){
                    that.addressObj.three = {
                        tid: cityId,
                        name: cityName
                    }
                }else{
                    that.addressObj.two = {
                        tid: cityId,
                        name: cityName
                    }
                }

                if (that.isProductPage) {
                    that.showDistrictTab();
                    that.tabDistrict.find('span').text('请选择');
                    
                    var districtList = that.getAddrListById(cityId);
                    that.showDistrictList(districtList, cityId, provinceId);
                }
                else {
                    that.addressObj.four = {tid:'',name:''}
                    that.writeHotCityToCookie(siteId, cityId, cityName, provinceId);
                    window.location.reload();
                }
            });
        });
    };


    Address.prototype.showDistrictList = function (districtList, cityId, provinceId) {
        var that = this;

        that.districtListHTML.empty();
        $.each(districtList, function (idx, district) {
            var myClass = that.getCityNameClass(district.name);
            that.districtListHTML.append('<li class="' + myClass + '" data-district="' + district.tid + '" data-site-id="' + district.site_id + '"><span>' + district.name + '</span></li>');
        });

        that.bindDistrictListClick(that.districtListHTML, provinceId, cityId);
    };

    Address.prototype.bindDistrictListClick = function (districtListHTML, provinceId, cityId) {
        var that = this;
        that.districtListHTML.find('li').each(function () {
            var liDistrict = $(this);
            liDistrict.unbind("click").bind('click', function () {
                var siteId = liDistrict.attr('data-site-id');
                var districtId = liDistrict.attr('data-district');
                var districtName = liDistrict.text();
                
                that.tabDistrict.find('span').text(districtName);

                if(that.addressObj.isParent){
                    that.addressObj.four = {
                        tid: districtId,
                        name: districtName
                    }
                }else{
                    that.addressObj.three = {
                        tid: districtId,
                        name: districtName
                    }
                }
                // 
                $('#address-text span').text($('#product-address  .tabProvince').text()+$('#product-address .tabCity').text()+districtName);
                that.writeHotCityToCookie(siteId, cityId, districtName, provinceId, districtId);
                window.location.reload();
            });
        });
    };



    Address.prototype.getCityNameClass = function (txt) {
        var that = this;
        var className = ' ';
        if (txt.length > 6) {
            className = 'mid-long';
        }
        if (txt.length > 12) {
            className = 'big-long';
        }

        return className;
    };

    Address.prototype.setAddressInfoFromCookie = function () {
        var that = this;
        that.showProvinceTab();

        var provinceId = $.cookie("cb_province_id");
        if (!isNaN(provinceId) && provinceId > 0) {
            var currentLiParent = that.provinceListHTML.find('li[data-parent-id="' + provinceId + '"]');

            if (currentLiParent.length > 0) {//北京，上海等
                currentLiParent.addClass('on');
                currentLiParent.siblings().removeClass('on');
                that.tabProvince.find('span').text(currentLiParent.text());

                return;
            }
            else {
                var currentLiProvince = that.provinceListHTML.find('li[data-province="' + provinceId + '"]');
                currentLiProvince.addClass('on');
                currentLiProvince.siblings().removeClass('on');
                that.tabProvince.find('span').text(currentLiProvince.text());
            }


            that.showCityTab();

            var cityId = $.cookie("cb_address_city");
            if (!isNaN(cityId) && cityId > 0) {
                that.setCityInfoFromCookie(provinceId, cityId);
                
                
                if(that.isProductPage){
                    var districtId = $.cookie("cb_address_district");
                    if (!isNaN(districtId) && districtId > 0) {
                        that.setDistrictInfoFromCookie(provinceId,cityId,districtId);
                    }
                }
                
            }
        }

    };

    Address.prototype.setCityInfoFromCookie = function (provinceId, cityId) {
        var that = this;
        var cityList = that.getAddrListById(provinceId);
        that.showCityList(cityList, provinceId);

        //设置
        var currentLi = that.cityListHTML.find('li[data-city="' + cityId + '"]');
        currentLi.addClass('on');
        currentLi.siblings().removeClass('on');
        that.tabCity.find('span').text(currentLi.text());
    };
    
    Address.prototype.setDistrictInfoFromCookie = function (provinceId,cityId, districtId) {
        var that = this;
        that.showDistrictTab();
        
        var districtList = that.getAddrListById(cityId);
        that.showDistrictList(districtList, cityId,provinceId);

        //设置
        var currentLi = that.districtListHTML.find('li[data-district="' + districtId + '"]');
        currentLi.addClass('on');
        currentLi.siblings().removeClass('on');
        that.tabDistrict.find('span').text(currentLi.text());
    };


    Address.prototype.checkIsParentId = function (parentId) {
        var that = this;
        if (typeof parentId != 'undefined' && parentId > 0) {
            return true;
        }

        return false;
    };

    Address.prototype.getAddrListById = function (id) {
        var that = this;
        var returnList = null;

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: "/Index/getAddrListById",
            async: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {id: id},
            success: function (returnData)
            {
                returnList = returnData;
            }
        });

        return returnList;
    };

    Address.prototype.setSelectHotCity = function () {
        var that = this;
        var cityId = $.cookie('cb_address_city');
        if (cityId > 0) {
            $('.hot-city-list').find('li').each(function () {
                var liObj = $(this);
                if (liObj.attr("data-city-id") == cityId) {
                    liObj.addClass('on');
                }
            });
        }
    };

    Address.prototype.writeHotCityToCookie = function (siteId, cityId, cityName, provinceId, districtId) {
        var that = this;

        var cookieDomain = '.yejing.com';

        if (siteId == null || siteId == 'null') {
            siteId = 4;
        }
        var date_history = new Date();
        date_history.setTime(date_history.getTime() + (365 * 24 * 60 * 60 * 1000));
        
        if(!that.addressObj.isParent){
            that.addressObj.four = {
                tid: that.getAddrListById(that.addressObj.three.tid)[0]['tid'],
                name: that.getAddrListById(that.addressObj.three.tid)[0]['name']
            }
        }

        $.cookie("cb_site_id", siteId, {expires: date_history, path: "/", domain: cookieDomain});
        $.cookie("cb_province_id", that.addressObj.one.tid, {expires: date_history, path: "/", domain: cookieDomain});
        $.cookie("cb_site_name", (that.addressObj.isParent ? that.addressObj.one.name : that.addressObj.two.name), {expires: date_history, path: "/", domain: cookieDomain});


        $.cookie("cb_address_city", that.addressObj.two.tid, {expires: date_history, path: "/", domain: cookieDomain});
        $.cookie("cb_address_district", that.addressObj.three.tid, {expires: date_history, path: "/", domain: cookieDomain});
        $.cookie("cb_address_street", that.addressObj.four.tid, {expires: date_history, path: "/", domain: cookieDomain});
        
        // var streetList = 0;
        // if(that.addressObj.isParent){
        //  streetList = that.addressObj.three.tid;
        // }else{
        //  streetList =  that.getAddrListById(that.addressObj.three.tid)[0]['tid'];
        // }
        $.cookie("cb_address_text", (that.addressObj.two.name+that.addressObj.three.name+that.addressObj.four.name), {expires: date_history, path: "/", domain: cookieDomain});

        
    };

    window.AddressSwitch = Address;
    window.writeHotCityToCookiePolyfill = function(siteId, cityId, cityName, provinceId){
        var cookieDomain = '.chunbo.com';

        if (siteId == null || siteId == 'null') {
            siteId = 4;
        }

        var date_history = new Date();
        date_history.setTime(date_history.getTime() + (365 * 24 * 60 * 60 * 1000));
        $.cookie("cb_address_city", cityId, {expires: date_history, path: "/", domain: cookieDomain});
        $.cookie("cb_site_id", siteId, {expires: date_history, path: "/", domain: cookieDomain});
        
        $.cookie("cb_site_name", cityName, {expires: date_history, path: "/", domain: cookieDomain});

        if (typeof provinceId != 'undefined') {
            $.cookie("cb_province_id", provinceId, {expires: date_history, path: "/", domain: cookieDomain});
        }

        $.cookie("cb_address_district", '', {expires: -1, path: "/", domain: cookieDomain});
        $.cookie("cb_address_street", '', {expires: -1, path: "/", domain: cookieDomain});

        $.cookie("cb_address_text", '', {expires: -1, path: "/", domain: cookieDomain});
    }
})(window);



var s = new AddressSwitch(true,_addObj)
s.loadAddressFromCookie();
$('.content').removeClass('hide')