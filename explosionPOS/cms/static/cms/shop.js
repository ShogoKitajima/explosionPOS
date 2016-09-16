"use strict";
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

// slider animation

var slider_animation = function(){
	
	console.log("sl" );
	var width = $('.product_item').outerWidth(true);
	var elem_length = $(".product_item").length;
	$('.product_item').each(function(i,elem){
		$(elem).css("left",width*i);
	});
	
	$('.product_item').addClass("pi_trans_init").addClass("pi_trans").on('transitionend',function(){
		$(this).removeClass("pi_trans_init").removeClass("pi_trans");
		if((--elem_length) == 0){
			console.log(sliderContainer.children[0].id);
			sliderContainer.appendChild(sliderContainer.children[0]);
			slider_animation();
		}
	});
};
var slider_init = function(callback){
	var elem_length = $(".product_item").length;
	while($(".product_item").length <=5){
		for(var i=0;i<elem_length;++i){
			var t = $(".product_item").eq(i);
			var c = t.clone(true).attr("id",t.attr("id")+"_c"+Math.random());
			sliderContainer.appendChild(c.get(0));
		}
	}
	callback();
};
slider_init(slider_animation);
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
				$("#userinfo_name").text(res["name"]);
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

