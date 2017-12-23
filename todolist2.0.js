//时间小于十前面加0
function ten(num){
    if(parseInt(num)<10){
        return "0"+num;
    }else{
        return num;
    }
}
//输入检查
function inputCheck(){
    if(!input.value) {
        alert('请输入有效值！');
        return false;
    }else{
        return input.value;
    }
}
//删除提醒
function comfirm(){
    comfirm("确定删除？");
}
//添加到本地存储
function addData(object,key){
    var jsonObj = JSON.stringify(object);
    localStorage.setItem(key,jsonObj);
}
//从本地存储删除
function removeData(key){
    if(localStorage.hasOwnProperty(key)){
        localStorage.removeItem(key)
    }
}
//增加项目
function addItem(value){
    var myDate = date = new Date();
    var time = myDate.toLocaleDateString()+' '+ ten(myDate.getHours())+":"+ten(myDate.getMinutes())+":"+ten(myDate.getSeconds());
    var str =`<label><input type="checkbox" >${value}</label><img src="./images/delete.png" alt="delete"><img src="./images/edit.png" alt="edit"><span>${time}</span>`;
    var newElement = document.createElement('li');
    newElement.innerHTML=str;

    //添加事件监听
    listenItem(newElement);

    //插入item
    if(ulElement.children[0]){
        ulElement.insertBefore(newElement,ulElement.children[0]);
    }else{
        ulElement.appendChild(newElement);
    }

    countDisplay();
    //声明对象
    var item = {
        completed:false,
        text:value
    }
    //用time作为key，存入本地
    addData(item,time);
}
//元素事件监听
function listenItem(element){
    var buttonDele = element.getElementsByTagName('img')[0];
    var buttonEdit = element.getElementsByTagName('img')[1];
    var tem = element.innerHTML;
    var time = element.getElementsByTagName('span')[0].innerText;
    var text = element.childNodes[0].childNodes[1].nodeValue;
    var checkbox = element.getElementsByTagName('input')[0];


    //删除
    buttonDele.onclick=function(){
        confirm("确认删除？");
        if (checkbox.checked){
            completeCount--;
            localStorage.completeCount=completeCount;
        };
         countDisplay();
        ulElement.removeChild(element);//删除元素
        removeData(time);//删除本地存储

    }
    //edit编辑
    buttonEdit.onclick=function(){
        element.innerHTML = `<input type='text' value='${text}'> <img src="./images/cancel.png" alt="cancel"><img src="./images/enter.png" alt="enter">`;
        element.getElementsByTagName('img')[0].onclick=function(){
            element.innerHTML = tem;
            listenItem(element);//重新监听
        }
        element.getElementsByTagName('img')[1].onclick=function(){
            var text2 = element.getElementsByTagName('input')[0].value;
            ulElement.removeChild(element);//删除旧元素
            removeData(time);//删除本地存储
            addItem(text2);//添加新元素
        }
    }

    //是否选中
    checkbox.onclick=function(){
        var completed = null;
        if(checkbox.checked) {
            completeCount++;
            completed = true;
           // console.log(checkbox.checked);
           // console.log(completed);
        }
        else{
            completed = false;
            completeCount--;
          //  console.log(checkbox.checked);
          //  console.log(completed);
        }
        localStorage.completeCount=completeCount;
        countDisplay();
        var item ={
            completed:completed,
            text:text
        }
        addData(item,time);
    }
}
//显示item数量
function countDisplay(){
    if(ulElement.children.length!==0) {
        document.getElementById('count').innerText = ulElement.children.length;
        document.getElementById('complete').innerText = completeCount;
    }else{
        completeCount =0;
        document.getElementById('count').innerText = 0;
        document.getElementById('complete').innerText = 0;
    }
}
//初始化
function init(){
    var data=[];
    //读取数据
    for(let i=0;i<localStorage.length;i++){
        var tem=[];
        var key = localStorage.key(i);
        if(key==='completeCount')continue;
        var tem2 = localStorage[key];
        tem[0]=key;
        obj = JSON.parse(tem2);
        tem[1]=obj;
        data.push(tem);
    }
    //按日期排序
    data.sort(function(a,b){
        return Date.parse(a[0])> Date.parse(b[0]);
        }
    );
    console.log(data);
    //展示数据
    for(let i=0;i<data.length;i++){
        var str =`<label><input type="checkbox" >${data[i][1].text}</label><img src="./images/delete.png" alt="delete"><img src="./images/edit.png" alt="edit"><span>${data[i][0]}</span>`;
        var newElement = document.createElement('li');
        newElement.innerHTML=str;

        if(data[i][1].completed){
            newElement.getElementsByTagName('input')[0].checked=true;
        }
        //添加事件监听
        listenItem(newElement);

        //插入item
        if(ulElement.children[0]){
            ulElement.insertBefore(newElement,ulElement.children[0]);
        }else{
            ulElement.appendChild(newElement);
        }

    }
    completeCount = localStorage.completeCount;
    countDisplay();
}

//全局变量
var completeCount = 0;
var input = document.getElementById('input');
var ulElement = document.getElementById('ul');
var addB = document.getElementById('add'), searB = document.getElementById('search');
window.onload=function(){
    init();
    addB.onclick = function () {
        var value = inputCheck();
        if(!value)return;
        addItem(value);
        input.value = null;
    }
}


