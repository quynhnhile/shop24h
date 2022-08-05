$(document).ready(function () {

    showItemLSToCart();
    $("#totalPrice").text(calTotalOrderPrice().toLocaleString('vi', { style: 'currency', currency: 'VND' }));
    function getLSContent() {
        // get contents from local storage.
        // if nothing is there, create an empty array
        const lsContent = JSON.parse(localStorage.getItem("products"));
        return lsContent;
    }

    //show item in cart
    function showItemLSToCart() {
        // get contents from local storage
        var lsContent = getLSContent();
        $("#productItem > tbody").text("");
        if (lsContent !== null) {
            for (i = 0; i < lsContent.length; i++) {
                productMarkup = `<tr class="cart_item">
                                        <td class="product-name">
                                            ${lsContent[i].name}<strong class="product-quantity"> × ${lsContent[i].qty}</strong> </td>
                                        <td class="product-total">
                                            <span class="amount">${(lsContent[i].qty * lsContent[i].price).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                        </td>
                                    </tr>`;
                $("#productItem").append(productMarkup);
            }
        } else {
            // if no content is in local storage, alert user
            productMarkup = "Your cart is empty.";
        }

    }

    //tính tổng hoá đơn
    function calTotalOrderPrice() {
        var lsContent = getLSContent();
        var vOrderPrice = 0;
        if (lsContent !== null) {
            for (i = 0; i < lsContent.length; i++) {
                var bPriceItem = lsContent[i].qty * lsContent[i].price;
                vOrderPrice += bPriceItem;
            }
        } else {
            return vOrderPrice;
        }
        return vOrderPrice;
    }

    //Lấy thông tin khách hàng theo form
    function getCustomerInputData() {
        var vCustomerObj = {
            firstName: $("#billing_first_name").val().trim(),
            lastName: $("#billing_last_name").val().trim(),
            email: $("#billing_email").val().trim(),
            city: $("#billing_city").val().trim(),
            address: $("#billing_address").val().trim(),
            phoneNumber: $("#billing_phone").val().trim()
        }
        return vCustomerObj;
    }

    //Xoá thông tin input customer
    function clearInputCustomer() {
        //console.log("Xoá input");
        $("#billing_first_name").val("");
        $("#billing_last_name").val("");
        $("#billing_email").val("");
        $("#billing_city").val("");
        $("#billing_address").val("");
        $("#billing_postcode").val("");
        $("#billing_state").val("");
        $("#billing_phone").val("");
    }


    //tạo đơn hàng chi tiết order detail với productId và OrderId
    function createOrderDetailByOrderId(pOrderObj) {
        var vOrderId = pOrderObj.id;
        var vProductInCart = getLSContent();
        for (i = 0; i < vProductInCart.length; i++) {
            vProductSend = {
                quantityOrder: vProductInCart[i].qty,
                priceEach: vProductInCart[i].price
            }
            $.ajax({
                url: "http://localhost:8080/order-detail/create/" + vOrderId + "/product/" + vProductInCart[i].id,
                //async: false,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(vProductSend),
                success: function (paramCustomerRes) {

                },
                error: function (ajaxContext) {
                    //alert(ajaxContext.responseText);
                }
            })
        }

    }

    //đặt đơn hàng khi có customer trong Db
    function createOrderWithOldCustomer(pOldCustomer) {
        var vProducts = getLSContent();
        var vOldCustomerId = pOldCustomer.id;
        console.log("Old Customer Id: " + vOldCustomerId);
        createOrderByCustomerId(vOldCustomerId);

    }

    //đặt đƠn hàng và tạo mới customer trong db
    function createOrderWithNewCustomer(pNewCustomer) {
        console.log("Create new customer")

        var vNewCustomerId = pNewCustomer.id
        console.log("New Customer Id: " + vNewCustomerId);
        createOrderByCustomerId(pNewCustomer.id);
    }

    //Tạo mới customer
    function createCustomer() {
        var vCustomerInput = getCustomerInputData();
        //gửi dữ liệu tạo mới customer
        $.ajax({
            url: "http://localhost:8080/customer/create",
            //async: false,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(vCustomerInput),
            success: function (paramCustomerRes) {
                //console.log("Customer vừa tạo" + paramCustomerRes);
                createOrderWithNewCustomer(paramCustomerRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        })
    }

    //hàm chuyển đổi integer sang float để đưa vào db
    function intToFloat(num, decPlaces) { return num.toFixed(decPlaces); }

    //tạo order dựa vào customer Id
    function createOrderByCustomerId(pCustomerId) {
        var vToday = new Date().format("d-m-Y");
        console.log(vToday)
        var vOrderNumber = "";
        var vTotalPrice = intToFloat(calTotalOrderPrice(), 2);
        console.log("Tổng tiền đơn hàng: " + vTotalPrice);
        var vOrder = {
            orderDate: vToday,
            requiredDate: "",
            shippedDate: "",
            status: "open",
            comments: "",
            ammount: vTotalPrice,
        }
        $.ajax({
            url: "http://localhost:8080/order/create/" + pCustomerId,
            //async: false,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(vOrder),
            success: function (paramOrderRes) {
                createOrderDetailByOrderId(paramOrderRes);
                showConfirmOrder(pCustomerId, paramOrderRes.checkNumber);
                clearInputCustomer();
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        })
    }

    //find customer by id
    function findCustomerById(paramCustomerId) {
        $.ajax({
            url: "http://localhost:8080/customer/details/" + paramCustomerId,
            type: "GET",
            success: function (pCustomerRes) {
                showCustomerInfoModal(pCustomerRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);

            }
        })

    }

    //hàm show customer info lên modal
    function showCustomerInfoModal(vCustomerFound) {
        $("#nameCustomer").text(vCustomerFound.firstName + vCustomerFound.lastName);
        $("#addressCustomer").text(vCustomerFound.address);
        $("#phoneCustomer").text(vCustomerFound.phoneNumber);
    }


    //show modal confirm đơn hàng
    function showConfirmOrder(paramCustomerId, paramOrderNumber) {
        $("#confirmOrder").modal("show");
        var lsContent = getLSContent();
        var vTotalPriceModal = calTotalOrderPrice();
        findCustomerById(paramCustomerId)

        //Xoá thông tin trước khi show
        $("#itemInCart > tbody").text("");
        $("#orderNumber").text(paramOrderNumber);

        if (lsContent !== null) {
            for (i = 0; i < lsContent.length; i++) {
                productMarkup = `<tr>
                                    <th scope="row">${i + 1}</th>
                                    <td>${lsContent[i].name}</td>
                                    <td>${lsContent[i].qty}</td>
                                    <td>${(lsContent[i].price * lsContent[i].qty).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                                </tr>`;
                $("#itemInCart").append(productMarkup);
            }
        } else {
            // if no content is in local storage, alert user
            productMarkup = "Your cart is empty.";
        }

        $("#totalPriceModal").text(vTotalPriceModal.toLocaleString('vi', { style: 'currency', currency: 'VND' }));


    }


    //check khách hàng cũ
    function checkCustomerByPhoneNumber(paramPhoneNumber) {
        $.ajax({
            url: "http://localhost:8080/customer/details?phoneNumber=" + paramPhoneNumber,
            type: "GET",
            success: function (pCustomerRes) {
                createOrderWithOldCustomer(pCustomerRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
                createCustomer()
            }
        })
    }


    $("#checkoutBtn").on("click", function (event) {
        event.preventDefault();
        var vCustomerInput = getCustomerInputData();
        //("#toastError").toast("show");
        checkCustomerByPhoneNumber(vCustomerInput.phoneNumber);
    });

})