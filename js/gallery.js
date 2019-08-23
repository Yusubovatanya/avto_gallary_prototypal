const btn = document.getElementById("add");
const result = document.querySelector("#result");
const count = document.querySelector("#count");
const changeSelect = document.getElementById("line-selector");


$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip(); //Tooltips (всплывающие подсказки)
});

function inheritance(parent, child) {
    let tempChild = child.prototype;
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;

    for (let key in tempChild) {
        if (tempChild.hasOwnProperty(key)) {
            child.prototype[key] = tempChild[key];
        }
    }
}

let BaseGallery = function () {
    this.visibleItem = [];
    this.newArr = [];
};

BaseGallery.prototype = {

    changeName: function (oldName) {
        oldName = oldName.trim();
        return oldName = ((oldName)[0]).toUpperCase() + ((oldName).slice(1)).toLowerCase();
    },

    changeUrl: function (oldUrl) {
        return oldUrl = (oldUrl.startsWith("http://")) ?
            oldUrl :
            "http://" + oldUrl;
    },

    changeDescription: function (oldDescription) {
        if ((oldDescription).length > 15) {
            return oldDescription = oldDescription.substr(0, 15) + "...";
        }
        return oldDescription;
    },

    changeDate: function (oldDate) {
        oldDate = parseInt(oldDate);
        if (Number.isNaN(oldDate) === true) {
            list = +new Date(oldDate);
        }
        if (window.moment) {
            // return oldDate = moment(oldDate).format('YYYY/MM/DD hh:mm');
            return oldDate = moment(oldDate).format('DD.MM.YYYY hh:mm');
        } else {
            return oldDate = `${oldDate.getFullYear()}/\
            ${formatValueDate(oldDate.getMonth(), 1)}/\
            ${formatValueDate(oldDate.getDate())} \
            ${oldDate.getHours()}:\
            ${oldDate.getMinutes()}`;

            function formatValueDate(item, value = 0) {
                item = (item < 10 - value) ?
                    `0${item + value}` :
                    `${item}`;
            }
        }
    },

    transformList: function (data) {
        return data.map(item => {
            return {
                url: this.changeUrl(item.url),
                name: this.changeName(item.name),
                id: item.id,
                description: this.changeDescription(item.description),
                timeStamp: item.date,
                date: this.changeDate(item.date)
            }
        })
    },

    sortGallery: function (visibleItem) {
        let key;
        let direction = 1;

        function sortMethod(a, b) {

            if (a[key] > b[key]) {
                return direction;
            } else if (a[key] < b[key]) {
                return -direction;
            } else {
                return 0;
            }
        }

        switch (changeSelect.value) {
            case "1":
                key = "name";
                direction = 1;
                return visibleItem.sort(sortMethod);
            case "2":
                key = "name";
                direction = -1;
                return visibleItem.sort(sortMethod);
            case "3":
                key = "timeStamp";
                direction = -1;
                return visibleItem.sort(sortMethod);
            case "4":
                key = "timeStamp";
                direction = 1;
                return visibleItem.sort(sortMethod);
        }
    },

    countItems: function (item) {
        count.innerHTML = item.length;
    },

    renderGallery: function (list) {

        let secondItemTemplate = "";

        list.forEach(item => {
            secondItemTemplate += `<div class="card card-avto box-shadow text-center py-2 px-1">\
                <img src="${item.url}" alt="${item.name}" class="img-thumbnail">\
                <div class="info-wrapper">\
                <h5 class="text-muted text-center card-title pt-2">${item.name}</h5>\
                <div class="text-muted text-center">${item.id}</div>\
                <div class="text-muted top-padding text-center">${item.description}</div>\
                <div class="text-muted text-center">${item.date}</div>\
                <button class="btn btn-danger delete_btn" data-id="${item.id}" style="margin-top: 10px;">Удалить</button>\
                </div>\
                </div>`;
        });
        result.innerHTML = secondItemTemplate;
    },

    changeStateBtn: function () {
        if (this.visibleItem.length < data.length) {
            btn.style.backgroundColor = "";
            btn.removeAttribute("readonly");
        } else {
            btn.setAttribute("readonly", "readonly");
            btn.style.backgroundColor = "#D3D3D3";
        }
    },

    stopAddImg: function () {
        this.changeStateBtn();
        this.showModal();
    },

    showModal: function () {
        $("#myModal").modal('show');
        $('[data-toggle="tooltip"]').tooltip("destroy");
    },

    setSortValueToLocalStorage: function () {
        localStorage.setItem("valueOfMethodSort", changeSelect.value);
    },

    setSortValueFromLocalStorage: function () {
        changeSelect.value = (localStorage.getItem("valueOfMethodSort")) ?
            localStorage.getItem("valueOfMethodSort") :
            "1";
    },

    initComponent: function () {
        this.setSortValueFromLocalStorage();
        this.newArr = this.transformList(data.slice());
        this.visibleItem = this.newArr.splice(0);
        this.renderGallery(this.visibleItem);
        this.countItems(this.visibleItem);
        this.changeStateBtn();
        this.initListener();
    },

    initListener: function () {
        changeSelect.addEventListener("change", () => {
            this.sortGallery(this.visibleItem);
            this.renderGallery(this.visibleItem);
            this.setSortValueToLocalStorage();
        });
    },
}

let ExtendedGallery = function () {
    BaseGallery.apply(this, arguments);
}

ExtendedGallery.prototype = {

    initComponentListener: function () {
        BaseGallery.prototype.initComponent.apply(this, arguments);

        btn.addEventListener("click", (e) => {
            this.addImage();
        });

        result.addEventListener("click", (event) => {
            this.deleteItemGallery();
        });
    },

    addImage: function () {
        if (this.visibleItem.length == data.length) {
            this.stopAddImg();
        } else {
            this.visibleItem.push(this.newArr.shift());
            this.visibleItem = this.sortGallery(this.visibleItem);
            this.countItems(this.visibleItem);
            this.renderGallery(this.visibleItem);
            this.changeStateBtn();
        }
        if (this.visibleItem.length == data.length) {
            this.showModal();
        }
    },

    deleteItemGallery: function () {
        if (!event.target.getAttribute("data-id")) {
            return;
        }
        let indexDelItem = -1;
        const idValue = event.target.getAttribute("data-id");
        this.visibleItem.forEach((item, index) => {
            if (item.id == idValue) {
                indexDelItem = index;
            }
        })
        this.newArr = this.newArr.concat(this.visibleItem.splice(this.newArr[indexDelItem], 1));
        this.visibleItem = this.sortGallery(this.visibleItem);;
        this.countItems(this.visibleItem);
        this.renderGallery(this.visibleItem);
        this.changeStateBtn();
    },
}

inheritance(BaseGallery, ExtendedGallery);