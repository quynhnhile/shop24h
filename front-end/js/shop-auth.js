$(document).ready(function(){
    const token = getCookie("token");
    
    var headers = {
        Authorization: "Token " + token
    };

    var urlInfo = "http://localhost:8080/auth/user/me";

    $.ajax({
        url: urlInfo,
        method: "GET",
        headers: headers,
        success: function (responseObject) {
            console.log(responseObject);
            if(responseObject == ""){
                $("#loginPage").css("display","initial");
                $("#dropDownUser").css("display","none");
                $("#userInfo").css("display","none");
            }else{
                $("#userInfo").append(responseObject.username);
                $("#loginPage").css("display","none");
                $("#dropDownUser").css("display","initial");
                $("#profileCustomer").attr("href", "profile.html");
                $("#orderCustomer").attr("href","order-tracking.html?email=" + responseObject.username);
                for(i = 0; i < responseObject.authorities.length; i++){
                    if(responseObject.authorities[i].search("ROLE") !== -1){
                        showAdminPage(responseObject.authorities[i])
                    }
                }
            }
        },
        error: function (xhr) {
            
        }
    });


    //show admin page
    function showAdminPage(pUserRole){
        if(pUserRole == "ROLE_CUSTOMER"){
            $("#adminPage").css("display","none");
        }
        if(pUserRole == "ROLE_ADMIN" || pUserRole == "ROLE_MANAGER" || pUserRole == "ROLE_EMPLOYEE"){
            $("#adminPage").css("display","initial");
        }
    }

    $("#logoutBtn").on("click", function () {
        redirectToLogin();
    });

    function redirectToLogin() {
        setCookie("token", "", 1);
        window.location.href = "login-customer/login.html";
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

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
})