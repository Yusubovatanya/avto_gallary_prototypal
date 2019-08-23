 const valueFieldEmail = document.getElementById("inputEmail");
 const valueFieldPassword = document.getElementById("inputPassword");
 const boxSignIn = document.getElementById("formSignIn");
 const boxUser = document.getElementById("userPage");
 const btnVisiblePass = document.getElementById('showPassword');
 const btnBack = document.getElementById("back");
 const msgAlertFullFields = document.querySelector("#myAlert");
 const userMenu = document.getElementById("menu");
 const main_toolbar = document.getElementById("main_toolbar");
 const btnGallery = document.getElementById("go_gallery");
 const btnAboutUser = document.getElementById("go_about_user");
 const btnExit = document.getElementById("go_exit");
 const boxGallery = document.getElementById("gallery");

 let LoginForm = function (validatorModule, galleryModule) {

     this.validator = validatorModule;
     this.gallery = galleryModule;
     this.listBtn = [btnGallery, btnAboutUser, btnExit];
     this.boxes = [boxGallery, boxSignIn, boxUser];
     this.pwShown = true;
     this.email = "";
     this.password = "";
 }

 LoginForm.prototype = {

     initComponent: function ({
         login: email,
         password: password
     }) {
         localStorage.setItem("login", email);
         localStorage.setItem("password", password);
         this.email = email;
         this.password = password;
         if (localStorage.getItem('status') === "authorization") {
             this.init();
         } else {
             btnSingIn.addEventListener("click", (event) => {
                 event.preventDefault();
                 this.validateUserData();
             });
         }
     },

     hidePassword: function () {
         document.getElementById("getPassword").type = "password";
     },

     showPassword: function () {
         document.getElementById("getPassword").type = "text";
     },

     showBox: function (status) {
         let box = "";
         let btn = "";
         switch (status) {
             case "gallery":
                 btn = btnGallery;
                 box = boxGallery;
                 break;
             case "aboutUser":
                 btn = btnAboutUser
                 box = boxUser;
                 break;
             case "exit":
                 box = boxSignIn;
                 break;
             default:
         }
         this.listBtn.forEach(element => {
             if (element === btn) {
                 element.classList.remove("btn-outline-primary");
                 element.classList.add("btn-primary");
             } else {
                 element.classList.remove("btn-primary");
                 element.classList.add("btn-outline-primary");
             }

         });

         this.boxes.forEach(element => {
             if (element === box) {
                 element.style.display = "block";
             } else {
                 element.style.display = "none";
             }

         })
     },

     initPageAboutUser: function () {

         document.getElementById("getEmail").value = this.email;
         document.getElementById("getPassword").value = this.password;

         btnVisiblePass.addEventListener("click", (e) => {
             if (this.pwShown) {
                 this.pwShown = !(this.pwShown);
                 this.showPassword();
                 btnVisiblePass.innerHTML = "Скрыть пароль";
             } else {
                 this.pwShown = !(this.pwShown);
                 this.hidePassword();
                 btnVisiblePass.innerHTML = "Показать пароль";
             }
         });

     },

     initListenersUserMenu: function () {

         btnGallery.addEventListener("click", (event) => {
             this.showBox("gallery");
         })

         btnAboutUser.addEventListener("click", (event) => {
             this.pwShown = true;
             this.hidePassword();
             btnVisiblePass.innerHTML = "Показать пароль";
             this.showBox("aboutUser");
         })

         btnExit.addEventListener('click', (event) => {
             this.exitFromUserPage();
             this.hideUserMenu();
         })
     },

     showUserMenu: function () {
         userMenu.style.display = "block";
         this.showOrHideToolbar("hide");
     },

     hideUserMenu: function () {
         userMenu.style.display = "none";
         this.showOrHideToolbar("show");
         this.validator.showOrHideAlert("show");
     },

     showOrHideToolbar: function (status) {
         switch (status) {
             case "show":
                 main_toolbar.style.display = "block";
                 break;
             case "hide":
                 main_toolbar.style.display = "none";
                 break;
             default:
         }
     },

     validateUserData: function () {
         let result = this.validator.isValid(valueFieldEmail.value, valueFieldPassword.value);
         this.email = result.email;
         this.password = result.password;
         if (result.status) {
             this.authorization(result.email, result.password);
         }
     },

     authorization: function (emailValue, passwordValue) {
         if (this.compareFields(emailValue, passwordValue)) {
             localStorage.setItem("status", "authorization");
             this.init();
         } else {
             return false;
         }
     },

     init: function () {
         this.initListenersUserMenu();
         this.gallery.initComponentListener();
         this.initPageAboutUser();
         this.showUserMenu();
         this.showBox("gallery");
         this.validator.showOrHideAlert("none");
     },

     compareFields: function (emailValue, passwordValue) {
         if ((localStorage.getItem("login") === emailValue) & (localStorage.getItem("password") === passwordValue)) {
             return true;
         } else {
             this.validator.showOrHideAlert("visible", "Введен неверный логин или пароль !");
             setTimeout(this.showOrHideAlert, 3000, "hide");
             return false;
         }
     },

     exitFromUserPage: function () {
         this.showBox("exit");
         this.hideUserMenu();
         valueFieldEmail.value = "";
         valueFieldPassword.value = "";
         localStorage.clear();
     },
 }


 function Validator() {

 };

 Validator.prototype = {

     checkTrimFields: function (valueTrim) {
         return valueTrim.trim();
     },

     showOrHideAlert: function (status, information) {
         switch (status) {
             case "visible":
                 msgAlertFullFields.style.visibility = 'visible';
                 msgAlertFullFields.innerHTML = information;
                 break;
             case "hide":
                 msgAlertFullFields.style.visibility = 'hidden';
                 break;
             case "show":
                 msgAlertFullFields.style.visibility = 'hidden';
                 msgAlertFullFields.style.display = "";
                 break;
             case "none":
                 msgAlertFullFields.style.visibility = "";
                 msgAlertFullFields.style.display = "none";
                 break;
             default:
         }
     },

     checkFullField: function (emailValue, passwordValue) {
         if (emailValue.length == 0 || passwordValue.length == 0) {
             this.showOrHideAlert("visible", "Заполните все поля логина и пароля !");
             setTimeout(this.showOrHideAlert, 5000, "hide");
             return false;
         } else {
             return true;
         }
     },

     validateEmail: function (status, emailValue) {
         if (status == true) {
             var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
             if (reg.test(emailValue) == false) {
                 this.showOrHideAlert("visible", "Пожалуйста, введите корректный адрес электронной почты !");
                 setTimeout(this.showOrHideAlert, 5000, "hide");
                 return false;
             } else {
                 return true;
             }
         }
         return;
     },

     validatePassword: function (status, passwordValue) {
         if (status == true) {
             if (passwordValue.length < 8) {
                 this.showOrHideAlert("visible", "Пароль должен содержать не менее 8 символов. Пожалуйста, введите корректный пароль!");
                 setTimeout(this.showOrHideAlert, 3000, "hide");
                 return false;
             } else {
                 return true;
             }
         }
     },

     isValid: function (validateEmail, validatePassword) {
         let email = this.checkTrimFields(validateEmail); //make
         let password = this.checkTrimFields(validatePassword);
         let resultValidFields = this.checkFullField(email, password);
         let resultValidateEmail = this.validateEmail(resultValidFields, email);
         let resultValidatePassword = this.validatePassword(resultValidateEmail, password);
         let res = {
             status: resultValidatePassword,
             email: email,
             password: password
         };
         return res;
     }
 }