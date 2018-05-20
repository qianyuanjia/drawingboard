window.onload=function(){
	//获取画布对象以及绘图对象
	var oCan=document.getElementById('can');
	var oCtx=oCan.getContext('2d');
	//获取工具对象
	var aTools=document.querySelectorAll('.tools>li');
	//获取橡皮擦遮罩
	var oErase=document.getElementById('erase');
	//选择工具，画笔or橡皮擦
	var penOn=true;
	//橡皮擦尺寸
	var eraseSize=30;
	//画笔粗细
	var lw=2;
	for(var i=0;i<aTools.length;i++){
		if(i==0){			
			aTools[0].onclick=function(){
				this.children[0].classList.add('active1');
				aTools[1].children[0].classList.remove('active1');
				penOn=true;
			}
		}else if(i==1){		
			aTools[1].onclick=function(){
				this.children[0].classList.add('active1');
				aTools[0].children[0].classList.remove('active1');
				penOn=false;
			}
		}else if(i==2){
			aTools[i].onclick=function(){
				this.children[0].classList.add('active2');
				var _this=this;
				setTimeout(function(){
					_this.children[0].classList.remove('active2');
				},300);
				oCtx.fillStyle="#fff";
				oCtx.fillRect(0,0,oCan.width,oCan.height);
				aTools[0].click();
			}
		}else if(i==3){
			aTools[i].onclick=function(){
				this.children[0].classList.add('active2');
				var _this=this;
				setTimeout(function(){
					_this.children[0].classList.remove('active2');
				},300);
				
				var oA=document.createElement('a');
				oA.href=oCan.toDataURL('image/png');
				oA.download="mypic";
				oA.click();
				oCtx.fillStyle="#fff";
				oCtx.fillRect(0,0,oCan.width,oCan.height);
			}
		}
	}
	//根据窗口尺寸动态调整画布大小
	setCanSize(oCan);
	//初始化窗口，填充白色背景
	oCtx.fillStyle="#fff";
	oCtx.fillRect(0,0,oCan.width,oCan.height);
	//根据特性选择相应的触发事件，实现画笔功能以及橡皮擦功能。
	if(oCan.ontouchstart === null){
		drawAction(['touchstart','touchmove','touchend'],true);
	}else{
		drawAction(['mousedown','mousemove','mouseup'],false);
	}

	//选择画笔的粗细
	var oBtn=document.getElementById('setLw');
	var oLineStyle=document.getElementById('lineStyle');
	var lwFlag=true;
	var aLi=oLineStyle.getElementsByTagName('li');
	var oShowLw=document.querySelector('.show_lw .line');
	oBtn.onclick=function(){
		if(lwFlag){
			oLineStyle.style.display='block';
		}else{
			oLineStyle.style.display='none';
		}
		lwFlag=!lwFlag;
	}
	for(var i=0;i<aLi.length;i++){
		aLi[i].index=i;
		aLi[i].onclick=function(){
			lw=this.index+2;
			oLineStyle.style.display='none';
			oShowLw.style.height=this.index+2+'px';
		}
	}

	//画笔取色
	var newImg=new Image();
	var newCan=document.createElement('canvas');
	var newCtx=newCan.getContext('2d');
	newImg.onload=function(){
		newCan.width=newImg.width;
		newCan.height=newImg.height;
		newCtx.drawImage(this,0,0,newCan.width,newCan.height);
	}
	newImg.src='../drawingboard/images/color.png';//为了githubpages预览
	 // newImg.src='../images/color.png';//本地测试

	var oColor=document.getElementById('color');
	oColor.onclick=function(ev){
		if(oColor.className==''){
			oColor.className='active';

		}else{
			
			var ev= ev || window.event;
			var pX=ev.clientX-this.offsetLeft;
			var pY=ev.clientY-this.offsetTop;
			
			var oImgData=newCtx.getImageData(pX,pY,1,1);
			var data=oImgData.data;
			var color='rgba('+data[0]+','+data[1]+','+data[2]+','+data[3]/100+')';
			oCtx.strokeStyle=color;
			oShowLw.style.background=color;
				
			oColor.className='';
			aTools[0].click();
			penOn=true;
		}
		
	}

	function drawAction(doArr,flag){
		oCan['on'+doArr[0]]=function(ev){
			var ev= ev || window.event;
			var pX=flag?ev.touches[0].clientX:ev.clientX;
			var pY=flag?ev.touches[0].clientY:ev.clientY;
			oLineStyle.style.display='none';
			lwFlag=true;
			oColor.className='';
			if(penOn){
				oCtx.lineWidth=lw;
				oCtx.beginPath();
				oCtx.moveTo(pX,pY);
			}else{
				oCtx.fillStyle="#fff";
				oErase.style.display='block';
				oErase.style.left=pX-oErase.offsetWidth*0.5+'px';
				oErase.style.top=pY-oErase.offsetHeight*0.5+'px';
				oCtx.fillRect(pX-eraseSize*0.5,pY-eraseSize*0.5,eraseSize,eraseSize);
			}	
			document['on'+doArr[1]]=function(ev){
				var ev= ev || window.event;
				var pX=flag?ev.touches[0].clientX:ev.clientX;
				var pY=flag?ev.touches[0].clientY:ev.clientY;
				if(penOn){				
					oCtx.lineTo(pX,pY);
					oCtx.stroke();
				}else{
					oErase.style.left=pX-oErase.offsetWidth*0.5+'px';
					oErase.style.top=pY-oErase.offsetHeight*0.5+'px';
					oCtx.fillRect(pX-eraseSize*0.5,pY-eraseSize*0.5,eraseSize,eraseSize);
				}
				return false;
			}
			document['on'+doArr[2]]=function(){
				oErase.style.display='none';
				document['on'+doArr[1]]=document['on'+doArr[2]]=null;
			}
			return false;
		}
	}
}



function getClientSize(){
	var width=document.documentElement.clientWidth || document.body.clientWidth;
	var height=document.documentElement.clientHeight || document.body.clientHeight;
	return {
		width:width,
		height:height
	}
}
function setCanSize(oCan){
	oCan.width=getClientSize().width;
	oCan.height=getClientSize().height;
	window.onresize=function(){
		oCan.width=getClientSize().width;
		oCan.height=getClientSize().height;
	}
}