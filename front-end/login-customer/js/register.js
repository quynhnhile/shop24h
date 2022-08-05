$(document).ready(function () {
    var gIsExistCustomer = false;
    var gDataSingUp = {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        passWord: "",
        confirmPassWord: "",
    };
    function setDataSingUp() {
        gDataSingUp.firstName = $("#firstNameInput").val();
        gDataSingUp.lastName = $("#lastNameInput").val();
        gDataSingUp.address = $("#addressInput").val();
        gDataSingUp.city = $("#cityInput").val();
        gDataSingUp.phone = $("#phoneInput").val();
        gDataSingUp.email = $("#emailRegister").val();
        gDataSingUp.passWord = $("#passwordRegister").val();
        gDataSingUp.confirmPassWord = $("#confirmPasswordRegister").val();
    }

    //clear field input
    function clearInput() {
        $("#firstNameInput").val("");
        $("#lastNameInput").val("");
        $("#emailRegister").val("");
        $("#passwordRegister").val("");
        $("#confirmPasswordRegister").val("");
        $("#addressInput").val("");
        $("#cityInput").val("");
        $("#phoneInput").val("");
        $("#registerError").text("");
    }

    function validateDataSignUp() {
        var vErrorCheck = false;
        try {
            if (gDataSingUp.firstName === "") throw ("chưa nhập Tên");
            if (gDataSingUp.lastName === "") throw ("chưa nhập Họ");
            if (gDataSingUp.address === "") throw ("chưa nhập địa chỉ");
            if (gDataSingUp.city === "") throw ("chưa nhập thành phố");
            if (gDataSingUp.phone === "") throw ("chưa nhập số điện thoại");
            if (gDataSingUp.email === "") throw ("chưa nhập email");
            if (!validateEmail(gDataSingUp.email)) throw ("email không hợp lệ");
            if (gDataSingUp.passWord === "") throw ("chưa nhập password");
            if (gDataSingUp.confirmPassWord === "") throw ("chưa nhập confirm password");
            if (gDataSingUp.confirmPassWord !== gDataSingUp.passWord) throw ("password confirm không giống nhau");
        } catch (error) {
            $("#registerError").html(error);
            vErrorCheck = true;
        }
        return vErrorCheck;

    }

    // Hàm validate email bằng regex
    function validateEmail(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    function checkEmailCustomerExist(pEmail) {
        $.ajax({
            url: "http://localhost:8080/customer/find?email=" + pEmail,
            type: 'GET',
            dataType: "json",
            success: function (pCustomerRes) {
                //trigger found customer ordered
                var vEmailExistCheck = true;
                signUpFunction(pCustomerRes, vEmailExistCheck);
            },
            error: function (pAjaxContext) {
                createCustomer();
            }
        });
    }

    $("#registerBtn").on("click", function (event) {
        event.preventDefault();
        setDataSingUp();
        checkEmailCustomerExist(gDataSingUp.email);
    })

    //create user for new or old customer
    function signUpFunction(pCustomer, pEmailExist) {
        var vSignUpData = {
            firstname: pCustomer.firstName,
            lastname: pCustomer.lastName,
            username: gDataSingUp.email,
            password: gDataSingUp.passWord
        }
        var vErrorInputCheck = validateDataSignUp();

        if (vErrorInputCheck == false) {
            // tạo ra tài khoản mới
            $.ajax({
                url: "http://localhost:8080/register",
                type: 'POST',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(vSignUpData),
                success: function (pUserRes) {
                    if (pEmailExist == true) {
                        clearInput();
                        $("#showInfo").html("Cảm ơn đã quay lại " + vSignUpData.firstname + " " + vSignUpData.lastname + "<br/>" + "Bạn đã đăng ký thành viên thành công");
                        $("#modalInfo").modal("show");
                        setRoleCustomerForUser(pUserRes.id);
                    }
                    if(pEmailExist == false){
                        clearInput();
                        $("#showInfo").html("Chào mừng " + vSignUpData.firstname + " " + vSignUpData.lastname + 
                                            " <br/> " + "Bạn đã đăng ký thành viên thành công" + " <br/> " +
                                            "Hãy đăng nhập để mua sản phẩm đầu tiên");
                        $("#modalInfo").modal("show");
                        setRoleCustomerForUser(pUserRes.id);
                    }
                },
                error: function (pAjaxContext) {
                    //if user name (email) in user table already exist, then show the error message
                    $("#registerError").html(pAjaxContext.responseText);
                }
            });





        }

    }

    //set role customer for new user
    function setRoleCustomerForUser(pUserId){
        console.log("user id: " + pUserId)
        $.ajax({
            url: "http://localhost:8080/user/" + pUserId + "/roleCustomer",
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            success: function (paramCustomerRes) {
                console.log(paramCustomerRes);
            },
        })
    }

    //create Customer
    function createCustomer() {

        var vCustomerObj = {
            firstName: gDataSingUp.firstName,
            lastName: gDataSingUp.lastName,
            email: gDataSingUp.email,
            city: gDataSingUp.city,
            address: gDataSingUp.address,
            phoneNumber: gDataSingUp.phone
        }

        var vErrorInputCheck = validateDataSignUp();
        if (vErrorInputCheck == false) {
            
            $.ajax({
                url: "http://localhost:8080/customer/create",
                //async: false,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(vCustomerObj),
                success: function (paramCustomerRes) {
                    var vEmailExistCheck = false;
                    signUpFunction(paramCustomerRes, vEmailExistCheck);
                },
                error: function (ajaxContext) {
                    console.log(ajaxContext.responseText);
                }
            })
        }
    }
})
