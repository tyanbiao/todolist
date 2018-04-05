    var TodoList = function() {
        this.input = document.getElementById("text_input");
        this.search = document.getElementById('search_icon');
        this.add_icon = document.getElementById('add_icon');
        this.ul = document.getElementById('list');
        this.items = this.ul.getElementsByTagName('li');
        this.mask = document.getElementById('mask');
        this.icon_x = document.getElementById('icon_x');
        this.nothing = document.getElementById('nothing');
    };

    TodoList.prototype.init = function(){

        this.loadData();
        this.addEven();
    };

    //存储数据到localStorage
    TodoList.prototype.addData = function(key,value,completed){
        //存储格式,用时间作为key
        var item = {
            completed:completed, //是否完成
            content:value        //内容
        };
        var jsonItem = JSON.stringify(item);
        localStorage.setItem(key,jsonItem);
    };

    //从localStorage删除数据
    TodoList.prototype.removeData = function(key){
        if(localStorage.hasOwnProperty(key)){
            localStorage.removeItem(key);
        }
    };

    //从localStorage更新数据
    TodoList.prototype.changeData = function(key,completed){
        if(localStorage.hasOwnProperty(key)){
            var value = localStorage.getItem(key);
            localStorage.removeItem(key);
            obj = JSON.parse(value);
            obj.completed = completed;
            var jsonItem = JSON.stringify(obj);
            localStorage.setItem(key,jsonItem);
        }
        this.items = this.ul.getElementsByTagName('li');
    };

    //从localStorage载入数据
    TodoList.prototype.loadData = function() {

        var data = [];
        //读取数据
        for (let i = 0; i < localStorage.length; i++) {
            var tem = [];
            var key = localStorage.key(i);
            var tem2 = localStorage.getItem(key);
            tem[0] = key;
            obj = JSON.parse(tem2);
            tem[1] = obj;
            data.push(tem);
        }
        //按日期排序
        data.sort(function (a, b) {
                return Date.parse(a[0]) > Date.parse(b[0]);
            }
        );

        //展示数据
        for (let i = 0; i < data.length; i++) {
            if (data[i][1].completed) {
                var iconComplete_html = `<i class='far fa-check-square complete_icon'></i>`;
            } else {
                var iconComplete_html = `<i class='far fa-square complete_icon'></i>`;
            }

            var str = `<i class='far fa-calendar-alt'>${data[i][0]}</i>
                    <div class='item'>${iconComplete_html}<span>${data[i][1].content}</span>
                <i class='far fa-edit edit_icon'></i>
                <i class='far fa-trash-alt trash_icon'></i>
                </div>`;

            var newNode = document.createElement('li');
            newNode.innerHTML = str;

            if (this.ul.children[0]) {
                this.ul.insertBefore(newNode, this.ul.children[0]);
            } else {
                this.ul.appendChild(newNode);
            }


        }
        this.items = this.ul.getElementsByTagName('li');
    }

    //添加事件监听
    TodoList.prototype.addEven = function(){
        // input按下enter键
        this.input.addEventListener('keyup', function(event) {
            this.handleKeyup(event);
        }.bind(this),false);

        //点击add icon
        this.add_icon.addEventListener('click',function(){
            this.icon_addItem();
        }.bind(this));

        // 点击search
        this.search.addEventListener('click', function(event) {
            this.handleSearch(event);
        }.bind(this));

        //点击退出查找
        this.icon_x.addEventListener('click', function(event) {
            this.handleCancelSearch(event);
        }.bind(this));

        //事件委托
        this.ul.addEventListener('click', function(event) {
            this.handleList(event);
        }.bind(this));

        //给Element添加方法，用于匹配className
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        };
    };

    //增加一项
    TodoList.prototype.handleKeyup = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.addItem();
    };

    //调用searchItem(),查找
    TodoList.prototype.handleSearch = function(event) {
        event.preventDefault();
        event.stopPropagation();
        if(this.input.value.trim().length>0){
            this.searchItem(this.input.value.trim());
        }

    };

    //点击complete,调用completeItem(),完成该项
    // 点击edit,调用editItem()，编辑该项
    // 点击trash,调用removeItem()，删除该项
    TodoList.prototype.handleList = function(event) {
        var target = event.target;
        event.preventDefault();
        event.stopPropagation();
        if(target.matches('.complete_icon')){
            this.completeItem(target);
        }else if(target.matches('.edit_icon')){
            this.editItem(target);
        }else if(target.matches('.trash_icon')) {
            this.removeItem(target);
        };
    };

    //退出遮罩
    TodoList.prototype.handleCancelSearch = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.cancelSearch();
    };

    //按enter增加一项
    TodoList.prototype.addItem = function(keyCode, target) {
        if(event.keyCode == 13 && event.target.value.trim().length > 0){
            this.append(this.input.value.trim());
            this.clearInput();
            this.items = this.ul.getElementsByTagName('li');
        }
    };

    //点击icon增加一项
    TodoList.prototype.icon_addItem = function(event){
        if(this.input.value.trim().length > 0){
            this.append(this.input.value.trim());
            this.clearInput();
            this.items = this.ul.getElementsByTagName('li');
        };
    };

    //删除
    TodoList.prototype.removeItem = function(target){
        // 初始化执行的时候，不存在target
        if(target){
            if(target.matches('.trash_icon')||target.matches('.fa-check')) {
                var time = target.parentNode.parentNode.firstChild.innerText;
                target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
                this.removeData(time);
                this.items = this.ul.getElementsByTagName('li');
            }
        }

        console.log('removed');
    };

    //清空输入框
    TodoList.prototype.clearInput = function() {
        this.input.value = '';
    };

    //时间小于十前面加0
    TodoList.prototype.ten = function ten(num){
        if(parseInt(num)<10){
            return "0"+num;
        }else{
            return num;
        };
    };

    //complete
    TodoList.prototype.completeItem = function(target){
        var time = target.parentNode.parentNode.firstChild.innerText;
        if(target.matches('.fa-square')){
            target.className = "far fa-check-square complete_icon"
            this.changeData(time,true);

        }else{
            target.className = "far fa-square complete_icon"
            this.changeData(time,false);
        };
        this.items = this.ul.getElementsByTagName('li');
    }

    //为totolist append一个li标签
    TodoList.prototype.append = function(str) {
        var myDate = new Date();
        var time = myDate.toLocaleDateString()+' '+ this.ten(myDate.getHours())+":"+this.ten(myDate.getMinutes())+":"+this.ten(myDate.getSeconds());
        var newNode = document.createElement('li');
        newNode.innerHTML = `<i class='far fa-calendar-alt'>${time}</i>
                <div class='item'>
            <i class='far fa-square complete_icon'></i><span>${str}</span>
            <i class='far fa-edit edit_icon'></i>
            <i class='far fa-trash-alt trash_icon'></i>
            </div>`;

        //按时间排序
        if(this.ul.children[0]){
            this.ul.insertBefore(newNode,this.ul.children[0]);
        }else{
            this.ul.appendChild(newNode);
        }

        this.addData(time,str,false);
    };


    // 查找输入字符串是否存在
    // 如果不存在，就不显示
    //如果存在，就提示nothing
    TodoList.prototype.searchItem = function(value) {
        var find = false;
        // 隐藏所有
        for(let i = 0;i < this.items.length;i++) {
            this.items[i].className = 'hide';
        };
        //如果存在就显示
        for(let i = 0;i < this.items.length;i++) {
            var nowEl = this.items[i];
            var str = nowEl.children[1].children[1].innerText;
            if(str.indexOf(value) != -1) {
                nowEl.className = 'show';
                find  = true;
            }
        };

        //显示遮罩层
        this.icon_x.className = 'icon_x';
        this.mask.className = 'mask';
        // 如果都没有就提示nothing
        if(!find) {
            this.nothing.className = 'nothing';
        };
        this.clearInput();
        this.items = this.ul.getElementsByTagName('li');
    };

    //退出遮罩
    TodoList.prototype.cancelSearch = function(){
        //隐藏遮罩
        this.icon_x.className = 'hide';
        this.mask.className = 'hide';
        this.nothing.className='hide';
        //显示所有items
        for(var i = 0;i < this.items.length;i++) {
            this.items[i].className = 'show';
        }
    }

    //编辑edit
    TodoList.prototype.editItem = function(target){
        var li = target.parentNode.parentNode;
        var div = target.parentNode;
        var temp = li.innerHTML;
        var text = div.innerText;

        div.innerHTML = `<input value='${text}'><i class="fas fa-times"></i><i class="fas fa-check"></i>`;
        //对该item重新委托事件
        li.addEventListener('click', function(event) {
            var target = event.target;
            if(target.matches('.fa-times')){
                li.innerHTML = temp;

            }else if(target.matches('.fa-check')) {
                console.log(target);
                var text = target.parentNode.querySelector('input').value.trim();
                if(text.length > 0){
                    this.append(text);
                }
                this.removeItem(target);

            };
        }.bind(this));
        this.items = this.ul.getElementsByTagName('li');

    }

    var todo = new TodoList();
    todo.init();