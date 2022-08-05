$(document).ready(function () {

    //global variable
    var gUrlString = window.location.href;
    var gNewUrl = new URL(gUrlString);
    var gId = gNewUrl.searchParams.get("id");
    var gProductObj = {
        id: "",
        code: "",
        name: "",
        price: 0,
        qty: 0,
    }
    var gVote = 0;
    var gUserRole = "";

    //on page load
    getProductInfoById();
    getAllComment();

    //get product info by id
    function getProductInfoById() {

        $.ajax({
            url: "http://localhost:8080/product?id=" + gId,
            type: "GET",
            success: function (pObj) {
                //console.log("Response Text:", pObj);
                loadProductData(pObj);
                gProductObj.id = pObj.id;
                gProductObj.code = pObj.productCode;
                gProductObj.name = pObj.productName;
                gProductObj.price = pObj.buyPrice;
            },
            error: function (ajaxContext) {

            }
        })
    }

    //load product data
    function loadProductData(pProductObj) {
        vImgUrl = "img/" + pProductObj.productCode + ".jpg";
        $(".product-name").text(pProductObj.productName);
        $(".product-inner-price > ins").text((pProductObj.buyPrice).toLocaleString('vi', { style: 'currency', currency: 'VND' }));
        $("#productDescription").text(pProductObj.productDescription);
        $("#imgProduct").attr("src", vImgUrl);
    }

    /*
        Xử lý thêm sản phẩm
    */

    $(".cart").on("click", "#addToCartBtn", function (event) {
        event.preventDefault();
        var qtyInput = parseInt($("#qtyProduct").val());
        var vProduct = {
            id: gProductObj.id,
            code: gProductObj.code,
            name: gProductObj.name,
            price: gProductObj.price,
            qty: qtyInput
        }
        console.log("Thêm sản phẩm có id = " + vProduct.id);
        saveProduct(vProduct);
    });

    function getLSContent() {
        // get contents from local storage.
        // if nothing is there, create an empty array
        const lsContent = JSON.parse(localStorage.getItem("products")) || [];
        return lsContent;
    }

    function setLSContent(lsContent) {
        // save content inside local storage
        localStorage.setItem("products", JSON.stringify(lsContent));
    }

    function saveProduct(paramPorductObj) {
        // save selected product in local storage and display it in the cart together

        // vars
        var vProductId = paramPorductObj.id;
        var vProductQty = paramPorductObj.qty;
        var vProductName = paramPorductObj.name;
        var vProductPrice = paramPorductObj.price;
        var vProductCode = paramPorductObj.code;
        let isProductInCart = false;

        // get local storage array
        const lsContent = getLSContent();

        // to avoid user adds the same course twice, check
        // the product is not in LS already before adding it
        lsContent.forEach(function (product) {
            if (product.id === vProductId) {
                isProductInCart = true;
                callToast("info", "Sản phẩm đã có trong giỏ");
            }
        });

        // only if the product is not already in the cart,
        // create an object representing selected product info
        // and push it into local storage array
        if (!isProductInCart) {
            lsContent.push({
                id: vProductId,
                code: vProductCode,
                qty: vProductQty,
                name: vProductName,
                price: vProductPrice
            });

            // add product into into local storage
            setLSContent(lsContent);
            callToast("success", "Đã thêm sản phẩm vào giỏ");
        }


    }

    //Call toast
    function callToast(pToastType, pToastInfo) {
        if (pToastType == "success") {
            toastr.success(pToastInfo);
        }
        if (pToastType == "info") {
            toastr.info(pToastInfo);
        }
        if (pToastType == "error") {
            toastr.error(pToastInfo);
        }
        if (pToastType == "warning") {
            toastr.warning(pToastInfo);
        }
    }


    /*=====================================================
     * COMMENT AND VOTE PRODUCT
      =====================================================  
    */



    //get all comment by productId
    function getAllComment() {
        getUserRole();
        $.ajax({
            url: "http://localhost:8080/comments/product/" + gId,
            type: "GET",
            success: function (pComments) {
                console.log(pComments);
                showAllCommnent(pComments);
            },
            error: function (ajaxContext) {

            }
        })
    }

    //show all comment to comment area
    function showAllCommnent(pComments) {
        $("#commentSection > ul").text("");
        for (i = 0; i < pComments.length; i++) {
            var bCommentItem = `
            <li id=commentId${pComments[i].id}>
                <div class="comment-main-level">
                    <div class="comment-avatar"><img
                            src="img/customer-avatar.jpg"
                            alt=""></div>
                    <div class="comment-box" id="myGroup">
                        <div class="comment-head">
                            <h6 class="comment-name"><a
                                    href="">${pComments[i].commentName}</a></h6>
                            <h7>${checkVote(pComments[i].vote)}</h7>
                            <span>${pComments[i].createAt + " "}</span>
                            <div data-toggle="collapse" aria-expanded="true" aria-controls="comment${pComments[i].id}" href="#comment${pComments[i].id}" style="display:${showContentByRole()}">
                            <a title="trả lời"><i class="fa fa-reply"></i></a></div>
                        </div>
                        <div class="comment-content">
                            ${pComments[i].commentDetail}
                        </div>
                        <div id=comment${pComments[i].id} class="bg-light p-2 collapse" data-parent="#myGroup">
                            <div class="d-flex flex-row align-items-start"><textarea class="form-control ml-1 shadow-none textarea" id=replyDetailByComment${pComments[i].id}></textarea></div>
                            <div class="mt-3 text-right">
                            <button class="btn btn-primary btn-sm shadow-none addReplyBtn" type="button" data-commentId=${pComments[i].id}>Trả lời</button>
                            <button class="btn btn-outline-primary btn-sm ml-1 shadow-none" data-toggle="collapse" aria-expanded="true" aria-controls="comment${pComments[i].id}" href="#comment${pComments[i].id}"
                             type="button">Huỷ</button></div>
                        </div>
                    </div>
                </div>
            </li>`
            $("#commentSection > ul").append(bCommentItem);

            for (j = 0; j < pComments[i].reply.length; j++) {
                var bReply = `
                <ul class="comments-list reply-list">
                    <li id=replyId${pComments[i].reply[j].id}>
                        <!-- Avatar -->
                        <div class="comment-avatar"><img
                                src="img/admin-avatar.png"
                                alt=""></div>
                        <!-- Contenedor del Comentario -->
                        <div class="comment-box">
                            <div class="comment-head">
                                <h6 class="comment-name by-staff"><a>${pComments[i].reply[j].replyName}</a></h6>
                                <span>${pComments[i].reply[j].createAt}</span>
                            </div>
                            <div class="comment-content">
                            ${pComments[i].reply[j].replyDetail}
                            </div>
                        </div>
                    </li>
                </ul>`
                $("#commentSection > ul").attr("id", "commentId" + pComments[i].id).append(bReply);
            }

        }

    }

    //check customer bought product?
    function checkCustomerBuy() {
        var vUserEmail = $("#userInfo").text();
        $.ajax({
            url: "http://localhost:8080/customer/" + vUserEmail + "/product/" + gId,
            type: "GET",
            success: function (pCustomerRes) {
                if (pCustomerRes == "") {
                    callToast("warning", "Bạn chưa mua sản phẩm này,\n nên không thể đánh giá");
                    gVote = 0;
                }
            },
            error: function (ajaxContext) {

            }
        })
    }

    //set vote by star click
    $("#star1").on("click", function () {
        gVote = 1;
        checkCustomerBuy();
        $("#star1").addClass("checked");
        $("#star2").removeClass("checked");
        $("#star3").removeClass("checked");
        $("#star4").removeClass("checked");
        $("#star5").removeClass("checked");
    });
    $("#star2").on("click", function () {
        gVote = 2;
        checkCustomerBuy();
        $("#star1").addClass("checked");
        $("#star2").addClass("checked");
        $("#star3").removeClass("checked");
        $("#star4").removeClass("checked");
        $("#star5").removeClass("checked");
    });
    $("#star3").on("click", function () {
        gVote = 3;
        checkCustomerBuy();
        $("#star1").addClass("checked");
        $("#star2").addClass("checked");
        $("#star3").addClass("checked");
        $("#star4").removeClass("checked");
        $("#star5").removeClass("checked");
    });
    $("#star4").on("click", function () {
        gVote = 4;
        checkCustomerBuy();
        $("#star1").addClass("checked");
        $("#star2").addClass("checked");
        $("#star3").addClass("checked");
        $("#star4").addClass("checked");
        $("#star5").removeClass("checked");
    });
    $("#star5").on("click", function () {
        gVote = 5;
        checkCustomerBuy();
        $("#star1").addClass("checked");
        $("#star2").addClass("checked");
        $("#star3").addClass("checked");
        $("#star4").addClass("checked");
        $("#star5").addClass("checked");
    });

    //check vote = 0
    function checkVote(pVote) {
        if (pVote == 0) {
            return "";
        }
        if (pVote !== 0) {
            return '<a><i class="fas fa-star"> ' + pVote + ' </i></a>';
        }
    }

    //clear comment box and rating star
    function clearCommentAndRating() {
        gVote = 0;
        $("#commentInput").val("");
        $("#star1").removeClass("checked");
        $("#star2").removeClass("checked");
        $("#star3").removeClass("checked");
        $("#star4").removeClass("checked");
        $("#star5").removeClass("checked");
    }

    //action comment button
    $("#commentBtn").on("click", function () {
        var vCommentInput = $("#commentInput").val().trim();
        addCustomerComment(vCommentInput)
    })

    //call create comment API
    function addCustomerComment(pComment) {
        var vCheckUserLogin = validateUserLogin();
        var vUserEmail = $("#userInfo").text();
        var vToday = new Date().format("d-m-Y");
        var vHeader = makeHeaderAuthFromCookie();
        var vCommentDataSend = {
            commentDetail: pComment,
            commentName: vUserEmail,
            createAt: vToday,
            vote: gVote
        };
        if (vCheckUserLogin == true && pComment !== "") {
            $.ajax({
                url: "http://localhost:8080/comment/product/" + gId,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                headers: vHeader,
                data: JSON.stringify(vCommentDataSend),
                success: function (pCommentRes) {
                    getAllComment();
                    clearCommentAndRating();
                    callToast("success", "Thêm bình luận thành công");
                },
                error: function (ajaxContext) {
                    callToast("error", "Bạn không có quyền tạo comment,\n hãy xin cấp quyền và đăng nhập lại");
                }
            })
        }
    }

    //validate user login
    function validateUserLogin() {
        var vUserEmail = $("#userInfo").text();
        var vCheckUserLogin = true;
        if (vUserEmail == "") {
            callToast("error", "Bạn hãy đăng nhập để bình luận sản phẩm");
            vCheckUserLogin = false;
        }
        return vCheckUserLogin;
    }

    //action add reply button for each comment
    $(".comments-list").on("click", ".addReplyBtn", function () {
        var vCommentId = $(this).data("commentid");
        var vReplyAreaId = "replyDetailByComment" + vCommentId;
        var vReplyDetail = $('#'+vReplyAreaId).val();
        createReplyByCommentId(vCommentId, vReplyDetail);
    })

    //call create reply API
    function createReplyByCommentId(pCommentId, pReplyDetail) {
        var vToday = new Date().format("d-m-Y");
        var vReplyName = $("#userInfo").text();
        var vReplyData = {
            replyName: vReplyName,
            replyDetail: pReplyDetail,
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
                getAllComment();
                callToast("success","Đã trả lời thành công");
            },
            error: function (ajaxContext) {
                callToast("error","Bạn không có quyền trả lời");
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

    //Authentication User Role
    function getUserRole() {
        var urlInfo = "http://localhost:8080/auth/user/me";
        var vHeader = makeHeaderAuthFromCookie();
        $.ajax({
            url: urlInfo,
            method: "GET",
            headers: vHeader,
            success: function (responseObject) {
                console.log("user info:" + responseObject);
                if (responseObject !== "") {
                    for (i = 0; i < responseObject.authorities.length; i++) {
                        if (responseObject.authorities[i].search("ROLE") !== -1) {
                            setVariableGUserRole(responseObject.authorities[i]);
                        }
                    }
                }
            },
        });
    }

    //gUserRole
    function setVariableGUserRole(pUserRole) {
        gUserRole = pUserRole;
    }

    //show content by role
    function showContentByRole() {
        console.log("user role: " + gUserRole);
        if (gUserRole == "ROLE_CUSTOMER" || gUserRole == "") {
            return "none"
        }
        else {
            return "initial";
        }
    }

    /*
    =================End of Validate user role by token=================
    */
})