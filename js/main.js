const trueLoginAndPass = {
    login: "admin@gmail.com",
    password: "qaz12345"
};

const btnSingIn = document.getElementById("singIn");

let validatorModule = new Validator();

let galleryModule = new ExtendedGallery();

let loginFormModule = new LoginForm(validatorModule, galleryModule);

loginFormModule.initComponent(trueLoginAndPass);