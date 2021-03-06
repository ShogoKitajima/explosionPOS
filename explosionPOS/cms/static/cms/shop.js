;"use strict";
var slcValue = document.getElementById('SelectValue');
var txtJan = document.getElementById('TxtJAN');
var spnCost = document.getElementById("SpanCost");
var spnThismonthcost = document.getElementById('userinfo_ThismonthCost');
var spnLastmonthcost = document.getElementById('userinfo_LastmonthCost');
var currentUserId = -1;
var btnBuy = document.getElementById('BtnBuy');
var cntQ2 = document.getElementById('ContainerQ2');
var msgQ2 = document.getElementById('SpanMsgQ2');
var cntQ3 = document.getElementById('ContainerQ3');
var cntQ4 = document.getElementById('ContainerQ4');
var sliderContainer = document.getElementById('product_slider');
var lastUserTime = new Date();
var reload = function(){
	var now = new Date();
	if(now.getTime() - lastUserTime.getTime() > 1000*30*60){
		location.reload();
	}
	return;
};
setInterval(reload,10000);
//
// slider animation
//
var slider_animation = function(){
	$('li.product_item').addClass("pi_trans_init").addClass("pi_trans");
};
var slider_init = function(callback){
	while($("li.product_item").length <=5){
		for(var i=0;i<elem_length;++i){
			var t = $("li.product_item").eq(i);
			var c = t.clone(true).attr("id",t.attr("id")+"_c"+Math.random());
			sliderContainer.appendChild(c.get(0));
		}
	}
	var width = $('li.product_item').outerWidth(true);
	$('li.product_item').each(function(i,elem){
		$(elem).css("left",width*i);
	});
	callback();
};
var width = $('li.product_item').outerWidth(true);
var elem_length = $("li.product_item").length;
$(sliderContainer).on('transitionend','li.product_item',function(){
	$(this).removeClass("pi_trans_init").removeClass("pi_trans");
	if($(this).position().left == 0){
		$(this).css("left",width*($("li.product_item").length-1));
	}else{
		$(this).css("left",$(this).position().left - width);

	}
	/*
	if($(this).position().left > width * 7){
		$(this).addClass("visibility_hidden");
	}else{
		$(this).removeClass("visibility_hidden");
	}
	*/
	if((--elem_length) == 0){
		elem_length = $("li.product_item").length;
		slider_animation();
	}
});
slider_init(slider_animation);
//
//EO slider_animation
//
	var containerShow = function(i){
			cntQ2.style.display = i>=2?"inline-block":"none";
			cntQ3.style.display = i>=3?"inline-block":"none";
			cntQ4.style.display = i>=4?"inline-block":"none";
	};
	containerShow(1);
	var userinfoUpdate = function(student_id){
		if(currentUserId != student_id){
			currentUserId = student_id;
			$("#userinfo_student_id").text(student_id);
			
			var r = new XMLHttpRequest(); 
			r.open("GET", "../userinfo/?user=" + student_id, true);
			r.onreadystatechange = function () {
				if (r.readyState != 4 || r.status != 200) return; 
				var res = JSON.parse(r.responseText);
				var name = res["name"]==""?"----":res["name"];
				$("#userinfo_name").text(name);
				var subtotal = res['this_month'];
				if (isFinite(subtotal)){
					spnThismonthcost.innerText = "￥" + res['this_month'];
					spnLastmonthcost.innerText = "￥" + res['last_month'];
					containerShow(2);
					txtJan.focus();
				}else{
					spnThismonthcost.innerText = "---";
					spnLastmonthcost.innerText = "---";
					containerShow(1);
				}
			};	
			r.send(null);	
		}	
	};
	var userinfoGet = function(){
		console.log("send");
		$.getJSON("http://localhost:10080/?callback=?",{}).done(
			function(data,status){
				console.log("suc");
				if(data.student_info!=null){
					var student_id = data.student_info.number;
					lastUserTime = new Date();
					console.log(student_id);
					userinfoUpdate(student_id);
				}
			}
		).always(function(){
					setTimeout(userinfoGet,3000);
		});
	};
	userinfoGet();

$("#btnUserinfoReset").on("click",function(){
	console.log("a");
	$("#userinfo_student_id").text("");
	$("#userinfo_name").text("");
	currentUserId = -1;
	spnThismonthcost.innerText = "---";
	spnLastmonthcost.innerText = "---";
	containerShow(1);
});
$("#btnGuest").on("click",function(){
	userinfoUpdate(999);
});
var slcValueRemoveChildAll = function(){while (slcValue.firstChild) slcValue.removeChild(slcValue.firstChild);};
var costUpdateValue = function(){
	if(txtJan.value in items){
		spnCost.innerText ="￥" + items[txtJan.value].price * slcValue.options[slcValue.selectedIndex].value + "-";
	}else{
		spnCost.innerText = "￥---";
	}
};
txtJan.addEventListener('input',function(e){
	if(txtJan.value in items){
		var janVal = txtJan.value;
		slcValueRemoveChildAll();
		if(items[janVal].stock<1){
			msgQ2.innerText = "It is sold out.";
			return;
		} 
		msgQ2.innerText = "";
		console.log($("#userinfo_student_id").text());
		$("#PreviewQ2Img").attr("src",items[janVal].img);
		$("#PreviewQ2JAN").text("JAN:"+janVal);
		$("#PreviewQ2Name").text(items[janVal].name);
		$("#PreviewQ2Price").text("￥"+items[janVal].price+"-");
		containerShow(4);
		var f = document.createDocumentFragment();
		for(var i=1;i<=items[janVal].stock&&i<=10;++i){
			var option = document.createElement('option');
			option.textContent = i;
			option.setAttribute('value',i);
			f.appendChild(option);
		}	
		btnBuy.style.display = "block";
		slcValue.appendChild(f);
		costUpdateValue();
	}else{
		msgQ2.innerText = "";
		btnBuy.style.display = "none";
		$("#PreviewQ2Img").attr("src",$("#PreviewQ2Img").attr("default"));
		$("#PreviewQ2JAN").text("JAN:null");
		$("#PreviewQ2Name").text("");
		$("#PreviewQ2Price").text("￥---");
		slcValueRemoveChildAll();
	}
});
slcValue.addEventListener('change',function(e){
	costUpdateValue();
});
btnBuy.addEventListener('click',function(e){
	$("#userinfo_student_id_form").val($("#userinfo_student_id").text());
	document.getElementById('mainForm').submit();
});

