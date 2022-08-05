
$(document).ready(function () {
    var gToken = "";
    var gDataSignIn = {
        email: "",
        passWord: "",
    };
    function setDataSignIn() {
        gDataSignIn.email = $("#emailLogin").val();
        gDataSignIn.passWord = $("#passwordLogin").val();

    }

    function validateDataSignIn() {
        var vCheck = false;
        try {
            if (gDataSignIn.email === "") throw ("nhập email");
            if (!validateEmail(gDataSignIn.email)) throw ("email không hợp lệ");
            if (gDataSignIn.passWord === "") throw ("nhập password");
        } catch (error) {
            $("#loginError").html(error);
            console.log(error);
            vCheck = true
        }
        return vCheck
    }
    // Hàm validate email bằng regex
    function validateEmail(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }
    function signInFunction() {
        var vLoginData = {
            username: gDataSignIn.email,
            password: gDataSignIn.passWord
        }
        var vCheck = validateDataSignIn();
        if (vCheck == false) {
            $.ajax({
                url: "http://localhost:8080/login",
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(vLoginData),
                success: function (pTokenRes) {
                    gToken = pTokenRes;
                    responseHandler(pTokenRes);
                },
                error: function (pAjaxContext) {
                    $("#loginError").html(pAjaxContext.responseText);
                }
            });
        }
    }

    $("#loginBtn").on("click", function () {
        setDataSignIn();
        validateDataSignIn();
        signInFunction();
    })

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function responseHandler(pTokenData) {
        //Lưu token vào cookie trong 1 ngày
        setCookie("token", pTokenData, 1);
        window.location.href = "../index.html";
    }
})
