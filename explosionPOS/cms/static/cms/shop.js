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
	var width = $('.product_item').outerWidth(true);
	$('.product_item').animate({
		left: -width
	},
	{
		duration: 3000,
		queue: true,
	}).promise().done(function(){
		$('.product_item').css('left',0);
		sliderContainer.appendChild(sliderContainer.children[0]);
	}).done(slider_animation);
};
slider_animation();

	var userinfoUpdate = function(){
		console.log("send");
		$.getJSON("http://localhost:10080/?callback=?",{},
			function(data,status){
				console.log("suc");
				if(data.student_info!=null){
					var student_id = data.student_info.number;
					console.log(student_id);
					if(currentUserId != student_id){
						currentUserId = student_id;
						$("#userinfo_student_id").text(student_id);
						$("#userinfo_name").text(data.student_info.name);
						var r = new XMLHttpRequest(); 
						r.open("GET", "../userinfo/?user=" + student_id, true);
						r.onreadystatechange = function () {
							if (r.readyState != 4 || r.status != 200) return; 
							var res = JSON.parse(r.responseText);
							var subtotal = res['this_month'];
							if (isFinite(subtotal)){
								//存在しないユーザに対しては値を返さない(undefined)。ユーザの存在確認も兼ねる。
								spnThismonthcost.innerText = "￥" + res['this_month'];
								spnLastmonthcost.innerText = "￥" + res['last_month'];
								cntQ2.style.display = "inline-block";
								cntQ3.style.display = "none";
								cntQ4.style.display = "none";
								txtJan.focus();
							}else{
								spnThismonthcost.innerText = "---";
								spnLastmonthcost.innerText = "---";
								cntQ2.style.display = "none";
								cntQ3.style.display = "none";
								cntQ4.style.display = "none";
							}
						};	
						r.send(null);	
					}
					
					setTimeout(userinfoUpdate,12000);
				}else{
					setTimeout(userinfoUpdate,3000);
				}
			}
		);
	};
	userinfoUpdate();

var slcValueRemoveChildAll = function(){while (slcValue.firstChild) slcValue.removeChild(slcValue.firstChild);};
var costUpdateValue = function(){
	if(txtJan.value in items){
		spnCost.innerText = items[txtJan.value].price * slcValue.options[slcValue.selectedIndex].value;
	}else{
		spnCost.innerText = "---";
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
		$("#PreviewQ2Img").attr("src",items[janVal].img);
		$("#PreviewQ2JAN").text("JAN:"+janVal);
		$("#PreviewQ2Name").text(items[janVal].name);
		$("#PreviewQ2Price").text("￥"+items[janVal].price+"-");
		cntQ3.style.display = "inline-block";
		cntQ4.style.display = "inline-block";
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
	document.getElementById('mainForm').submit();
});