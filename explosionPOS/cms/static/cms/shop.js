"use strict";
var slcValue = document.getElementById('SelectValue');
var txtJan = document.getElementById('TxtJAN');
var spnPrice = document.getElementById('SpanPrice');
var spnCost = document.getElementById("SpanCost");
var spnThismonthcost = document.getElementById('SpanThismonthCost');
var btnBuy = document.getElementById('BtnBuy');
var cntQ2 = document.getElementById('ContainerQ2');
var msgQ2 = document.getElementById('SpanMsgQ2');
var cntQ3 = document.getElementById('ContainerQ3');
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
					$("#userinfo_student_id").val(student_id);
					$("#userinfo_name").val(data.student_info.name);
					var r = new XMLHttpRequest(); 
					r.open("GET", "../userinfo/?user=" + student_id, true);
					r.onreadystatechange = function () {
						if (r.readyState != 4 || r.status != 200) return; 
						var res = JSON.parse(r.responseText);
						var subtotal = res['subtotal'];
						if (isFinite(subtotal)){
							//存在しないユーザに対しては値を返さない(undefined)。ユーザの存在確認も兼ねる。
							spnThismonthcost.innerText = res['subtotal'];
							cntQ2.style.display = "block";
							cntQ3.style.display = "none";
						}else{
							spnThismonthcost.innerText = "---";
							cntQ2.style.display = "none";
							cntQ3.style.display = "none";
						}
					};		
					r.send(null);
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
	if(txtJan.value in itemPrice){
		spnCost.innerText = itemPrice[txtJan.value] * slcValue.options[slcValue.selectedIndex].value;
	}else{
		spnCost.innerText = "---";
	}
};
txtJan.addEventListener('input',function(e){
	if(txtJan.value in itemPrice){
		var janVal = txtJan.value;
		slcValueRemoveChildAll();
		if(itemStock[janVal]<1){
			msgQ2.innerText = "It is sold out.";
			return;
		} 
		msgQ2.innerText = "";
		cntQ3.style.display = "block";
		var f = document.createDocumentFragment();
		for(var i=1;i<=itemStock[janVal]&&i<=10;++i){
			var option = document.createElement('option');
			option.textContent = i;
			option.setAttribute('value',i);
			f.appendChild(option);
		}	
		btnBuy.style.display = "block";
		slcValue.appendChild(f);
		spnPrice.innerText = itemPrice[janVal];
		costUpdateValue();
	}else{
		spnPrice.innerText = "---";
		msgQ2.innerText = "";
		btnBuy.style.display = "none";
		slcValueRemoveChildAll();
	}
});
slcValue.addEventListener('change',function(e){
	costUpdateValue();
});
btnBuy.addEventListener('click',function(e){
	document.getElementById('mainForm').submit();
});