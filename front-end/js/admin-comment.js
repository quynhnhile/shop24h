$(document).ready(function () {
    //khai báo biến
    var gActionBtn = "";
    var gProductByComment = {
        id: 0,
        product_name: "",
        product_code: "",
        quantity_in_stock: 0
    }

    $("#commentData").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "excel", "pdf", "print"],
        columns: [
            { "data": "id" },
            { "data": "commentName" },
            { "data": "commentDetail" },
            { "data": "createAt" },
            { "data": "vote" },
            { "data": "Action Button" },
        ],
        columnDefs: [
            {
                "targets": -1,
                "defaultContent":
                    '<a class="btn commentEditBtn" title="Trả lời" data-toggle="modal" href="#infoModal"><i class="fas fa-reply"></i></a>'
                    + '<a class="btn commentDeleteBtn" title="Xoá"><i class="fas fa-trash"></i></a>'
            }
        ]

    }).buttons().container().appendTo('#customerData_wrapper .col-md-6:eq(0)');

    function getAllCommentData() {
        $.ajax({
            url: "http://localhost:8080/comments",
            type: "GET",
            success: function (paramCommentRes) {
                loadAllCommentDataHandle(paramCommentRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        });
    }
    getAllCommentData();


    //Hàm hiển thị dữ liệu ra table
    function loadAllCommentDataHandle(pCommentData) {
        //Xóa toàn bộ dữ liệu đang có của bảng
        $("#commentData").DataTable().clear();
        //Cập nhật data cho bảng 
        $("#commentData").DataTable().rows.add(pCommentData);
        //Cập nhật lại giao diện hiển thị bảng
        $("#commentData").DataTable().draw();
    }

    /*
        Xử lý CRUD Comment
    */

    //action nút trả lời/view  bình luận
    $("#commentData").on("click", "tbody .commentEditBtn", function () {
        var vCommentTable = $("#commentData").DataTable();
        var vCustomerData = vCommentTable.row($(this).closest("tr")).data();
        gActionBtn = "reply";
        showCommentToModal(vCustomerData);
        getReplyDataByComment();
    })

    //action nút xoá bình luận
    $("#commentData").on("click", "tbody .commentDeleteBtn", function () {
        var vCommentTable = $("#commentData").DataTable();
        var vCommentData = vCommentTable.row($(this).closest("tr")).data();
        gActionBtn = "delete";
        showCommentToModal(vCommentData);
        getReplyDataByComment();
    })

    //action nút xác nhận xoá
    $("#deleteCommentBtn").on("click", function () {
        var vCommentId = $("#commentIdInfo").val();
        $.ajax({
            url: "http://localhost:8080/comment/delete/" + vCommentId,
            type: "DELETE",
            success: function (pProductRes) {
                $.toast({
                    heading: 'Thành công',
                    text: 'Đã xoá bình luận thành công',
                    showHideTransition: 'plain',
                    icon: 'success'
                })
                $("#infoModal").modal('hide');
                getAllCommentData();
            }
        });
    })

    //show comment data to modal
    function showCommentToModal(pComment) {
        findProductByCommentId(pComment.id);
        $("#infoModal").modal('show');
        $("#commentIdInfo").val(pComment.id);
        $("#commentNameInfo").val(pComment.commentName);
        $("#createDateInfo").val(pComment.createAt);
        $("#voteInfo").val(pComment.vote);
        $("#commentDetailInfo").val(pComment.commentDetail);
        $("#imgProduct").attr("src", "img/" + gProductByComment.product_code + ".jpg");
        if (gActionBtn == "delete") {
            $("#deleteCommentBtn").attr("style", "display: initial");
            $("#replyArea").attr("style", "display: none");
        }
        if (gActionBtn == "reply") {
            $("#replyArea").attr("style", "display: initial");
            $("#deleteCommentBtn").attr("style", "display: none");
        }
    }

    //find product by comment Id and show to modal
    function findProductByCommentId(pCommentId) {
        $.ajax({
            url: "http://localhost:8080/product/getByCommentId/" + pCommentId,
            type: "GET",
            success: function (pProductRes) {
                $("#imgProduct").attr("src", "img/" + pProductRes.product_code + ".jpg");
                $("#productName").text(pProductRes.product_name)
                $("#productName").attr("href", "single-product.html?id=" + pProductRes.id);
                $("#quantityInStock").val(pProductRes.quantity_in_stock);
            },
        });
    }


    /*
    * CRUD reply
    */


    //Reply Table
    $("#replyTable").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        columns: [
            { "data": "id" },
            { "data": "replyName" },
            { "data": "replyDetail" },
            { "data": "createAt" },
            { "data": "Action Button" },
        ],
        columnDefs: [
            {
                "targets": -1,
                "defaultContent":
                    '<a class="btn replyEditBtn" title="Trả lời"><i class="fas fa-reply"></i></a>'
                    + '<a class="btn replyDeleteBtn" title="Xoá"><i class="fas fa-trash"></i></a>'
            }
        ]

    });

    //call reply data by comment Id
    function getReplyDataByComment() {
        var vCommentId = $("#commentIdInfo").val();
        $.ajax({
            url: "http://localhost:8080/reply?commentId=" + vCommentId,
            type: "GET",
            success: function (pReplyRes) {
                console.log(pReplyRes);
                if (pReplyRes == "") {
                    $("#replyArea").css("display", "none");
                }
                else {
                    $("#replyArea").css("display", "initial");
                    loadReplyDataHandle(pReplyRes);
                }
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        });
    }


    //Hàm hiển thị dữ liệu ra table
    function loadReplyDataHandle(pReplyData) {
        //Xóa toàn bộ dữ liệu đang có của bảng
        $("#replyTable").DataTable().clear();
        //Cập nhật data cho bảng 
        $("#replyTable").DataTable().rows.add(pReplyData);
        //Cập nhật lại giao diện hiển thị bảng
        $("#replyTable").DataTable().draw();
    }


    //action create reply button
    $("#replyBtn").on("click", function (event) {
        event.preventDefault();
        var vCommentId = $("#commentIdInfo").val();
        createReplyByCommentId(vCommentId);
    })

    //action delete reply button
    $("#replyTable").on("click", ".replyDeleteBtn", function(){
        var vReplyTable = $("#replyTable").DataTable();
        var vReplyData = vReplyTable.row($(this).closest("tr")).data();
        deleteReply(vReplyData.id);
    })


    //call create reply API
    function createReplyByCommentId(pCommentId) {
        var vToday = new Date().format("d-m-Y");
        var vReplyName = $("#userInfo").text();
        var vReplyInput = $("#replyInput").val();
        var vReplyData = {
            replyName: vReplyName,
            replyDetail: vReplyInput,
            createAt: vToday
        }
        var vHeader = makeHeaderAuthFromCookie();
        $.ajax({
            url: "http://localhost:8080/reply/" + pCommentId,
            //async: false,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            headers: vHeader,
            data: JSON.stringify(vReplyData),
            success: function (pReplyRes) {
                getReplyDataByComment();
                $.toast({
                    heading: 'Thành công',
                    text: 'Đã trả lời thành công',
                    showHideTransition: 'plain',
                    icon: 'success'
                })
            },
            error: function (ajaxContext) {
                $.toast({
                    heading: 'Lỗi',
                    text: 'Bạn không có quyền trả lời',
                    showHideTransition: 'plain',
                    icon: 'error'
                })
            }
        })
    }

    //call delete reply api
    function deleteReply(pReplyId){
        var vHeader = makeHeaderAuthFromCookie();
        $.ajax({
            url: "http://localhost:8080/reply/" + pReplyId,
            //async: false,
            type: "DELETE",
            headers: vHeader,
            success: function (pReplyRes) {
                getReplyDataByComment();
                $.toast({
                    heading: 'Thành công',
                    text: 'Đã xoá trả lời thành công',
                    showHideTransition: 'plain',
                    icon: 'success'
                })
            },
            error: function (ajaxContext) {
                $.toast({
                    heading: 'Lỗi',
                    text: 'Bạn không có quyền xoá',
                    showHideTransition: 'plain',
                    icon: 'error'
                })
            }
        })
    }


    /*
    =================Validate user role by token=================
    */
    function makeHeaderAuthFromCookie() {
        var vToken = getCookie("token");

        var vHeaders = {
            Authorization: "Token " + vToken
        };

        return vHeaders;
    }

    //get cookie from local
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
})