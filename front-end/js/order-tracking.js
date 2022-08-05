$(document).ready(function () {

    var gUrlString = window.location.href;
    var gNewUrl = new URL(gUrlString);
    var gEmail = gNewUrl.searchParams.get("email");
    

    onPageLoad();

    function onPageLoad(){
        getOrderByEmailAndOrderNumber();
        if(gEmail !== null){
            $("#userInfoTracking").text("User: " + gEmail);
        }
    }

    //get search info
    function getSearchInfo() {
        var vOrderCode = $("#orderCodeInput").val().trim();
        var vEmail = $("#emailInput").val().trim();
        if(gEmail == ""){
            var vSearchObj = {
                orderCode: vOrderCode,
                email: vEmail
            }
        }
        if(gEmail !== ""){
            var vSearchObj = {
                orderCode: vOrderCode,
                email: gEmail
            }
        }
        return vSearchObj;
    }

    //call API searcj order by order number or email
    function getOrderByEmailAndOrderNumber() {
        var vSearchObj = getSearchInfo();
        if (vSearchObj.orderCode !== "" || vSearchObj.email !== "") {
            $("#nullOrderFound").css("display", "none");
            $("#orderDetailFound").css("display", "initial");
            $.ajax({
                url: "http://localhost:8080/order-detail/tracking" + "?orderNumber=" + vSearchObj.orderCode + "&customerEmail=" + vSearchObj.email,
                type: "GET",
                success: function (pOrderDetailRes) {
                    showOrderDetailFound(pOrderDetailRes);
                },
                error: function(pError){
                    $("#nullOrderFound").css("display", "initial");
                    $("#orderDetailFound").css("display", "none");
                }
            })
        } else {
            $("#nullOrderFound").css("display", "initial");
            $("#orderDetailFound").css("display", "none");
        }

    }

    //show order detail found
    function showOrderDetailFound(pArrayOrderDetail) {
        $("#orderDetailTable > tbody").text("");
        if (pArrayOrderDetail !== "") {
            for (i = 0; i < pArrayOrderDetail.length; i++) {
                var bOrderRow = `<tr>
                    <td class="product-name">
                        <span>${pArrayOrderDetail[i].check_number}</span>
                    </td>
                    <td class="product-thumbnail">
                        <a href="single-product.html?id=${pArrayOrderDetail[i].productId}"><img width="145" height="145"
                                alt="poster_1_up" class="shop_thumbnail"
                                src="img/${pArrayOrderDetail[i].product_code}.jpg"></a>
                    </td>
                    <td class="product-name">
                        <a href="single-product.html?id=${pArrayOrderDetail[i].productId}">${pArrayOrderDetail[i].product_name}</a>
                    </td>
                    <td class="product-name">
                        <span class="amount">${pArrayOrderDetail[i].buy_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                    </td>
                    <td class="product-name">
                        <span>${pArrayOrderDetail[i].quantity_order}</span>
                    </td>
                    <td class="product-name">
                        <span class="amount subTotalPrice">${(pArrayOrderDetail[i].buy_price * pArrayOrderDetail[i].quantity_order).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                    </td>
                    <td class="product-name">
                        <span>${pArrayOrderDetail[i].status}</span>
                    </td>
                    `
                $("#orderDetailTable").append(bOrderRow);
            }
            $("#orderStatus").text(pArrayOrderDetail[0].status);
            $("#orderNumber").text(pArrayOrderDetail[0].check_number);
            showOrderProgressBar(pArrayOrderDetail[0].status);
        }
    }

    //action search order button
    $("#searchOrderBtn").on("click", function (event) {
        event.preventDefault();
        gEmail = "";
        getOrderByEmailAndOrderNumber();
    })

    //show Order Progress Bar
    function showOrderProgressBar(pStatus){
        console.log(pStatus);
        if(pStatus == "open"){
            $("#orderProgressBar").css("width", "25%");
        }
        if(pStatus == "confirm"){
            $("#orderProgressBar").css("width", "50%");
        }
        if(pStatus == "shipping"){
            $("#orderProgressBar").css("width", "75%");
        }
        if(pStatus == "delivery"){
            $("#orderProgressBar").css("width", "100%");
        }     
    }
})