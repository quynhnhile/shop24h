$(document).ready(function () {
    //khai báo biến
    var gActionBtn = "";

    $("#userTable").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "excel", "pdf", "print"],
        columns: [
            { "data": "id" },
            { "data": "username" },
            { "data": "firstname" },
            { "data": "lastname" },
            { "data": "roles.0.roleName" },
            { "data": "Action Button" },
        ],
        columnDefs: [
            {
                "targets": -1,
                "defaultContent":
                    '<a class="btn user-editBtn" title="Sửa"><i class="fas fa-pencil-alt"></i></a>'
                    + '<a class="btn user-deleteBtn" title="Xoá"><i class="fas fa-trash"></i></a>'
            }
        ]

    }).buttons().container().appendTo('#userTable_wrapper .col-md-6:eq(0)');

    function getAllUserData() {
        $.ajax({
            url: "http://localhost:8080/users/all",
            type: "GET",
            success: function (pUserRes) {
                console.log("Response text: ", pUserRes);
                loadAllUserDataHandle(pUserRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        });
    }
    getAllUserData();


    //Hàm hiển thị dữ liệu ra table
    function loadAllUserDataHandle(pUserRes) {
        //Xóa toàn bộ dữ liệu đang có của bảng
        $("#userTable").DataTable().clear();
        //Cập nhật data cho bảng 
        $("#userTable").DataTable().rows.add(pUserRes);
        //Cập nhật lại giao diện hiển thị bảng
        $("#userTable").DataTable().draw();
    }

    /*
        CRUD user
    */

    //action edit user
    $("#userTable").on("click", "tbody .user-editBtn", function () {
        var vUserTable = $("#userTable").DataTable();
        var vUserData = vUserTable.row($(this).closest("tr")).data();
        gActionBtn = "Sửa";
        showUserToModal(vUserData);

    })

    //action delete user
    $("#userTable").on("click", "tbody .user-deleteBtn", function () {
        var vUserTable = $("#userTable").DataTable();
        var vUserData = vUserTable.row($(this).closest("tr")).data();
        gActionBtn = "Xoá";
        showUserToModal(vUserData);
    })

    //action confirm delete user
    $("#delUserBtn").on("click", function(){
        var vUserId = $("#userIdInfo").val();
        deleteUserAPI(vUserId);
    })

    //show user data to modal
    function showUserToModal(pUser) {
        console.log(gActionBtn);
        var vRoleId = convertRoleName2RoleId(pUser.roles[0].roleName);
        $("#infoModal").modal("show");
        $("#userIdInfo").val(pUser.id);
        $("#usernameInfo").val(pUser.username);
        $("#userLastnameInfo").val(pUser.lastname);
        $("#userFirstnameInfo").val(pUser.firstname);
        $("#userRoleSelect").val(vRoleId);
        if(gActionBtn == "Xoá"){
            $("#delUserBtn").css("display", "initial");
        }
        if(gActionBtn == "Sửa"){
            $("#delUserBtn").css("display", "none");
        }
    }

    //convert role name to role Id
    function convertRoleName2RoleId(pRoleName) {
        var vRoleId = 0;
        if (pRoleName == "Quản lý") {
            return vRoleId = 1;
        }
        if (pRoleName == "Khách hàng") {
            return vRoleId = 2;
        }
        if (pRoleName == "Admin") {
            return vRoleId = 3;
        }
        if (pRoleName == "Nhân viên") {
            return vRoleId = 4;
        }
    }

    //action button change user role
    $("#changeRoleBtn").on("click", function(event){
        event.preventDefault();
        var vUserId = $("#userIdInfo").val();
        var vRoleId = $("#userRoleSelect option:selected").val();
        changeUserRole(vUserId, vRoleId)
    });

    //change user role api
    function changeUserRole(pUserId, pRoleId) {
        var vHeaders = createHeaderForAuth();

        $.ajax({
            url: "http://localhost:8080/user/" + pUserId + "/role/" + pRoleId,
            type: "PUT",
            headers:vHeaders,
                contentType: "application/json;charset=UTF-8",
            success: function (paramProductRes) {
                toastInfo("success", "Sửa quyền thành công");
                $("#infoModal").modal("hide");
                getAllUserData();
            },
            error: function (ajaxContext) {
                toastInfo("error", "Bạn không có quyền sửa thông tin này");

            }
        })
    }

    //delete user api
    function deleteUserAPI(pUserId){
        var vHeaders = createHeaderForAuth();
        $.ajax({
            url: "http://localhost:8080/user/delete/" + pUserId,
            type: "DELETE",
            headers:vHeaders,
            success: function (pUserRes) {
                toastInfo("success","Xoá user thành công");
                $("#infoModal").modal("hide");
                getAllUserData();
            },
            error: function (ajaxContext) {
                toastInfo("warning","Bạn khônng có quyền xoá user");
            }
        });
    }


    //Auth User
    function createHeaderForAuth() {
        var vToken = getCookie("token");
        var vHeaders = {
            Authorization: "Token " + vToken
        };
        return vHeaders;
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

    //Toast
    function toastInfo(pToastType, pToastInfo) {
        if (pToastType == "success") {
            $.toast({
                heading: 'Success',
                text: pToastInfo,
                showHideTransition: 'plain',
                icon: 'success'
            })
        }
        if (pToastType == "warning") {
            $.toast({
                heading: 'Warning',
                text: pToastInfo,
                showHideTransition: 'plain',
                icon: 'warning'
            })
        }
        if (pToastType == "error") {
            $.toast({
                heading: 'Error',
                text: pToastInfo,
                showHideTransition: 'plain',
                icon: 'error'
            })
        }
    }
})