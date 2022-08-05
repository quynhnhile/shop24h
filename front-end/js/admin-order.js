$(document).ready(function () {
    //khai báo biến
    var gActionBtn = "";
    var gProductList2CreateOrder = [];
    var gProductList2Save = [];

    var gUrlString = window.location.href;
    var gNewUrl = new URL(gUrlString);
    var gCustomerId = gNewUrl.searchParams.get("customerId");

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    })


    //Khai báo DataTable
    $("#orderData").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "excel", "pdf", "print"],
        columns: [
            { "data": "id" },
            { "data": "checkNumber" },
            { "data": "ammount" },
            { "data": "orderDate" },
            { "data": "requiredDate" },
            { "data": "shippedDate" },
            { "data": "status" },
            { "data": "comments" },
            { "data": "Action Button" }
        ],
        columnDefs: [
            {
                "targets": -1,
                "defaultContent":
                    '<a class="btn order-editBtn" title="Sửa"><i class="fas fa-pencil-alt"></i></a>'
                    + '<a class="btn order-deleteBtn" title="Xoá"><i class="fas fa-trash"></i>'
            }
        ]

    }).buttons().container().appendTo('#orderData_wrapper .col-md-6:eq(0)');

    function getAllOrderData() {
        $.ajax({
            url: "http://localhost:8080/orders",
            type: "GET",
            success: function (paramProductRes) {
                console.log("Response text: ", paramProductRes);
                loadAllOrderDataHandle(paramProductRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        });
    }

    //on page load
    
    showProductToSelectBox();
    showCustomerToSelectBoxInFilter();
    loadFilterOnPageLoad();

    //Hàm hiển thị dữ liệu ra table
    function loadAllOrderDataHandle(paramOrderRes) {
        //Xóa toàn bộ dữ liệu đang có của bảng
        $("#orderData").DataTable().clear();
        //Cập nhật data cho bảng 
        $("#orderData").DataTable().rows.add(paramOrderRes);
        //Cập nhật lại giao diện hiển thị bảng
        $("#orderData").DataTable().draw();
    }

    //Hiển thị danh sách khách hàng để tạo mới đơn hàng
    function showCustomerToSelectBox() {
        $.ajax({
            url: "http://localhost:8080/customers",
            type: "GET",
            success: function (pCustomerRes) {
                $("#customerSelect").text("");
                var bSelectText = $("<option/>", {
                    value: "",
                    text: "Tìm khách hàng"
                }).appendTo($("#customerSelect"))

                //load customer to select box
                for (i = 0; i < pCustomerRes.length; i++) {
                    var bCustomerOption = $("<option/>");
                    bCustomerOption.prop("value", pCustomerRes[i].id);
                    bCustomerOption.prop("text", pCustomerRes[i].firstName + " " +
                        pCustomerRes[i].lastName + "-" +
                        pCustomerRes[i].phoneNumber);
                    $("#customerSelect").append(bCustomerOption);
                }
            },
            error: function (ajaxContext) {
            }
        })
    }


    function showCustomerToSelectBoxInFilter() {
        $.ajax({
            url: "http://localhost:8080/customers",
            type: "GET",
            success: function (pCustomerRes) {
                $("#customerSelectFilter").text("");
                var bSelectText = $("<option/>", {
                    value: "",
                    text: "Tất cả"
                }).appendTo($("#customerSelectFilter"))

                //load customer to select box
                for (i = 0; i < pCustomerRes.length; i++) {
                    var bCustomerOption = $("<option/>");
                    bCustomerOption.prop("value", pCustomerRes[i].id);
                    bCustomerOption.prop("text", pCustomerRes[i].firstName + " " +
                        pCustomerRes[i].lastName + "-" +
                        pCustomerRes[i].phoneNumber);
                    $("#customerSelectFilter").append(bCustomerOption);
                }
            },
            error: function (ajaxContext) {
            }
        })
    }

    //Hiển thị danh sách sản phẩm để chọn
    function showProductToSelectBox() {
        $.ajax({
            url: "http://localhost:8080/products/all",
            type: "GET",
            success: function (pProductRes) {
                $("#productSelect").text("");
                var bSelectText = $("<option/>", {
                    value: "",
                    text: "Tìm sản phẩm"
                }).appendTo($("#productSelect"))

                //load product to select box
                for (i = 0; i < pProductRes.length; i++) {
                    var bProductOption = $("<option/>");
                    bProductOption.prop("value", pProductRes[i].id);
                    bProductOption.prop("text", pProductRes[i].productCode + "-" +
                        pProductRes[i].productName + "-" +
                        pProductRes[i].productVendor + "-" +
                        pProductRes[i].buyPrice);
                    $("#productSelect").append(bProductOption);
                }
            },
            error: function (ajaxContext) {
            }
        })
    }

    //lấy thông tin sản phẩm từ product id (select option value) via API
    function getProductInfoAPI() {
        var vProductId = $("#productSelect").val();
        //call API get product info by Id
        $.ajax({
            url: "http://localhost:8080/product?id=" + vProductId,
            type: "GET",
            success: function (pProductRes) {
                console.log(pProductRes);
                if (!checkProductInList(pProductRes, gProductList2CreateOrder)) {
                    gProductList2CreateOrder.push(pProductRes);
                    if (gActionBtn == "Tạo") {
                        addProductFromSelect2Table();
                    }
                    if (gActionBtn == "Sửa") {
                        createProductToOrderDetail(pProductRes);
                    }
                }
            },
        })
    }

    //check sản phẩm đã có trong list
    function checkProductInList(pProductAdd, pProductList) {
        var vIsProductInList = false;
        for (i = 0; i < pProductList.length; i++) {
            if (pProductAdd.id == pProductList[i].id || pProductAdd.id == pProductList[i].product_id) {
                toastInfo("warning", "sản phẩm đã có trong giỏ");
                return vIsProductInList = true;
            }
        }
    }

    //Thêm sản phẩm vào danh sách
    function addProductFromSelect2Table() {
        $("#productListTable > tbody").text("");
        if (gProductList2CreateOrder !== null) {
            for (i = 0; i < gProductList2CreateOrder.length; i++) {
                var bProductItemRow =
                    `<tr>
                    <td>${gProductList2CreateOrder[i].id}</td>
                    <td>${gProductList2CreateOrder[i].productCode}</td>
                    <td>${gProductList2CreateOrder[i].productName}</td>
                    <td data-value="${gProductList2CreateOrder[i].buyPrice}">${gProductList2CreateOrder[i].buyPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                    <td>
                        <input type="number" value=1>
                    </td>
                    <td><a class="btn delProductItem"  data-index="${i}"><i class="fas fa-trash"></i></a></td>
                </tr>`
                $("#productListTable").append(bProductItemRow);
            }
        }
    }

    //lấy thông tin danh sách sản phẩm trong bảng để lưu vào array
    function getProductTableInfo() {
        var vProductTableArr = [];

        $('#productListTable >tbody tr').each(function () {
            vProductTableArr.push({
                id: parseInt($(this).find("td:eq(0)").text()),
                productCode: $(this).find("td:eq(1)").text(),
                buyPrice: $(this).find("td:eq(3)").data("value"),
                quantity: parseInt($(this).find("td:eq(4) input").val()),
                orderDetailId: $(this).find("td:eq(5) a").data("orderdetailid")
            })
        });
        if (gActionBtn == "Tạo") {
            gProductList2Save = vProductTableArr;
            showTotalPriceOrder();
        }
        if (gActionBtn == "Sửa") {
            gProductList2Save = vProductTableArr;
            updateProductList2OrderDetail(vProductTableArr);
            showTotalPriceOrder();
        }
    }

    //Tính tổng tiền đơn hàng
    function calTotalOrder() {
        var vTotalPriceOrder = 0;
        for (i = 0; i < gProductList2Save.length; i++) {
            vTotalPriceOrder += gProductList2Save[i].buyPrice * gProductList2Save[i].quantity;
        }
        return vTotalPriceOrder
    }

    //Hiển thị tổng tiền đơn hàng
    function showTotalPriceOrder() {
        var vTotalPrice = calTotalOrder();
        $("#ammountInfo").val(vTotalPrice);
    }


    //action của button thêm sản phẩm vào bảng
    $("#addProductBtn").on("click", function () {
        getProductInfoAPI();
    });

    //action delete của product item
    $("#productListTable").on("click", ".delProductItem", function () {
        if (gActionBtn == "Tạo") {
            var vProductArrayIndex = $(this).data("index");
            gProductList2CreateOrder.splice(vProductArrayIndex, 1);
            addProductFromSelect2Table();
        }
        if (gActionBtn == "Sửa" || gActionBtn == "Xoá") {
            var vOderDetailId = $(this).data("orderdetailid");
            callDeleteOrderDetailAPI(vOderDetailId);
        }


    })

    //action lưu thông tin dánh sách product
    $("#saveProductListBtn").on("click", getProductTableInfo);

    /*
    =============Xử lý CRUD đơn hàng==============
    */

    //action nút sửa đơn hàng
    $("#orderData").on("click", "tbody .order-editBtn", function () {
        var vOrderTable = $("#orderData").DataTable();
        var vOrderData = vOrderTable.row($(this).closest("tr")).data();
        gActionBtn = "Sửa";
        showOrderToModal(vOrderData);
    })

    //action nút xoá đơn hàng
    $("#orderData").on("click", "tbody .order-deleteBtn", function () {
        var vOrderTable = $("#orderData").DataTable();
        var vOrderData = vOrderTable.row($(this).closest("tr")).data();
        gActionBtn = "Xoá";
        console.log(gActionBtn);
        showOrderToModal(vOrderData);
    })


    //action nút tạo đơn hàng
    $("#createBtn").on("click", function () {
        showCustomerToSelectBox();
        gActionBtn = "Tạo";
        showOrderToModal();
    })

    //show product info
    function showOrderToModal(paramOrder) {
        clearModalInfo();
        if (paramOrder != null) {
            $("#infoModal").modal('show');
            $("#orderIdInfo").val(paramOrder.id);
            $("#orderCodeInfo").val(paramOrder.checkNumber);
            $("#ammountInfo").val(paramOrder.ammount);
            $("#statusInfo").val(paramOrder.status);
            $("#orderDateInfo").val(paramOrder.orderDate);
            $("#requiredDateInfo").val(paramOrder.requiredDate);
            $("#shippedDateInfo").val(paramOrder.shippedDate);
            getCustomerByOrderId(paramOrder.id);
            getProductListByOrderId(paramOrder.id);

            //hiển thị thông tin lên modal nếu là action edit hoặc delete
            if (gActionBtn === "Sửa") {
                $(".modal-title").text("Đang sửa thông tin");
                $("#actionDataBtn").text("Sửa");
                $("#actionDataBtn").addClass("btn-info");
                $("#actionDataBtn").removeClass("btn-danger");
            }
            if (gActionBtn === "Xoá") {
                $(".modal-title").text("Bạn muốn xoá thông tin này");
                $("#actionDataBtn").text("Xoá");
                $("#actionDataBtn").addClass("btn-danger");
                $("#actionDataBtn").removeClass("btn-info");
            }
        } else {
            if (gActionBtn === "Tạo") {
                $("#infoModal").modal('show');
                $('#divCustomerSelect').show();
                $("#showCustomerInfo").prop("hidden", "true");
                clearModalInfo();

                $(".modal-title").text("Đang tạo mới thông tin");
                $("#actionDataBtn").text("Tạo mới");
                $("#actionDataBtn").addClass("btn-primary");
                $("#actionDataBtn").removeClass("btn-info");
                $("#actionDataBtn").removeClass("btn-danger");
            }
        }
    }

    //get Customer by Order Id
    function getCustomerByOrderId(pOrderId) {
        $.ajax({
            url: "http://localhost:8080/customer?orderId=" + pOrderId,
            type: "GET",
            success: function (pCustomerRes) {
                console.log(pCustomerRes);
                $('#divCustomerSelect').hide();
                $("#showCustomerInfo").val(pCustomerRes.first_name + " " + pCustomerRes.last_name + "-" + pCustomerRes.phone_number)
                $("#showCustomerInfo").removeAttr("hidden");
            },
        })
    }

    //get product list by order id
    function getProductListByOrderId(pOrderId) {
        $.ajax({
            url: "http://localhost:8080/order-detail?orderId=" + pOrderId,
            type: "GET",
            success: function (pOrderDetailRes) {
                gProductList2CreateOrder = pOrderDetailRes;
                showProductList2Table(pOrderDetailRes);
            },
        })
    }

    //show product list to table, mode = edit
    function showProductList2Table(pOrderDetailRes) {
        //show product list from order detail to table
        $("#productListTable > tbody").text("");
        for (i = 0; i < pOrderDetailRes.length; i++) {
            var bProductItemRow =
                `<tr>
                <td>${pOrderDetailRes[i].product_id}</td>
                <td>${pOrderDetailRes[i].product_code}</td>
                <td>${pOrderDetailRes[i].product_name}</td>
                <td data-value="${pOrderDetailRes[i].price_each}">${pOrderDetailRes[i].price_each.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                <td>
                    <input type="number" value=${pOrderDetailRes[i].quantity_order}>
                </td>
                <td><a class="btn delProductItem"  data-orderDetailId="${pOrderDetailRes[i].id}"><i class="fas fa-trash"></i></a></td>
            </tr>`
            $("#productListTable").append(bProductItemRow);
        }
    }

    //clear modal info before show
    function clearModalInfo() {
        $("#orderIdInfo").val("");
        $("#orderCodeInfo").val("");
        $("#customerSelect").val("");
        $("#ammountInfo").val("");
        $('#statusInfo').val("");
        $("#orderDateInfo").val("");
        $("#requiredDateInfo").val("");
        $("#shippedDateInfo").val("");
        $("#productListTable > tbody").text("")
        $("#productSelect").val("");
        gProductList2CreateOrder = [];
        gProductList2Save = [];
    }

    //get product info from input modal
    function getOrderModal() {

        if (gActionBtn == "Sửa") {
            var vOrderInfoInput = {
                id: parseInt($("#orderIdInfo").val()),
                checkNumber: $("#orderCodeInfo").val(),
                customerId: $('#customerSelect option:selected').val(),
                ammount: $("#ammountInfo").val(),
                status: $('#statusInfo option:selected').val(),
                orderDate: $("#orderDateInfo").val(),
                requiredDate: $("#requiredDateInfo").val(),
                shippedDate: $("#shippedDateInfo").val(),
                productList: gProductList2Save
            }
        }
        if (gActionBtn == "Tạo") {
            var vOrderInfoInput = {
                id: parseInt($("#orderIdInfo").val()),
                checkNumber: $("#orderCodeInfo").val(),
                customerId: $("#customerSelect").val(),
                ammount: $("#ammountInfo").val(),
                status: $('#statusInfo').val(),
                orderDate: $("#orderDateInfo").val(),
                requiredDate: $("#requiredDateInfo").val(),
                shippedDate: $("#shippedDateInfo").val(),
                productList: gProductList2Save
            }
        }
        if (gActionBtn == "Xoá") {
            var vOrderInfoInput = {
                id: parseInt($("#orderIdInfo").val()),
                checkNumber: $("#orderCodeInfo").val(),
                customerId: $("#customerSelect").val(),
                ammount: $("#ammountInfo").val(),
                status: $('#statusInfo').val(),
                orderDate: $("#orderDateInfo").val(),
                requiredDate: $("#requiredDateInfo").val(),
                shippedDate: $("#shippedDateInfo").val(),
                productList: gProductList2Save
            }
        }
        return vOrderInfoInput;
    }


    //gọi API edit product
    function callEditAPIOrder() {
        var vOrderDataGet = getOrderModal();
        var vOrderDataSend = {
            orderDate: vOrderDataGet.orderDate,
            requiredDate: vOrderDataGet.requiredDate,
            shippedDate: vOrderDataGet.shippedDate,
            status: vOrderDataGet.status,
            ammount: vOrderDataGet.ammount,
            checkNumber: vOrderDataGet.checkNumber
        }
        console.log("requiredDate: " + vOrderDataSend.requiredDate)
        $.ajax({
            url: "http://localhost:8080/order/update/" + vOrderDataGet.id,
            //async: false,
            type: "PUT",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(vOrderDataSend),
            success: function (paramProductRes) {
                $("#infoModal").modal('hide');
                toastInfo("success", "Sửa thông tin thành công")
                getAllOrderData();
            },
            error: function (ajaxContext) {
                console.log(ajaxContext);
                toastInfo("error", "Lỗi không sửa được thông tin")

            }
        })
    }

    //gọi API update order detail
    function updateProductList2OrderDetail(pProductList) {
        console.log(pProductList)
        for (i = 0; i < pProductList.length; i++) {
            var vOrderDetailSend = {
                quantityOrder: pProductList[i].quantity,
                priceEach: pProductList[i].buyPrice
            }
            $.ajax({
                url: "http://localhost:8080/order-detail/update/" + pProductList[i].orderDetailId,
                //async: false,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(vOrderDetailSend),
                success: function (paramOrderRes) {
                    toastInfo("success", "cập nhật sản phẩm thành công")
                },
            })
        }
    }

    //gọi API create product
    function callCreateAPIOrder() {
        var vOrderInfo = getOrderModal();
        var checkValidate = validateDatInput();
        if (checkValidate == true) {
            var vOrderDataSend = {
                orderDate: vOrderInfo.orderDate,
                requiredDate: "",
                shippedDate: "",
                status: vOrderInfo.status,
                comments: "",
                ammount: vOrderInfo.ammount
            }
            $.ajax({
                url: "http://localhost:8080/order/create/" + vOrderInfo.customerId,
                //async: false,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(vOrderDataSend),
                success: function (paramOrderRes) {
                    createOrderDetailByOrderId(paramOrderRes);
                    toastInfo("success", "Đã tạo đơn hàng thành công");
                },
                error: function (ajaxContext) {
                    //alert(ajaxContext.responseText);
                }
            })
        }
    }

    //call create API Order Detail
    function createProductToOrderDetail(pProductRes) {
        var vOrderIdModal = $("#orderIdInfo").val();
        var vOrderDetailDataSend = {
            quantityOrder: 1,
            priceEach: pProductRes.buyPrice
        }
        $.ajax({
            url: "http://localhost:8080/order-detail/create/" + vOrderIdModal + "/product/" + pProductRes.id,
            //async: false,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(vOrderDetailDataSend),
            success: function (paramOrderRes) {
                getProductListByOrderId(vOrderIdModal);
                toastInfo("success", "Đã thêm sản phẩm");
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        })
    }


    //tạo đơn hàng chi tiết order detail với productId và OrderId
    function createOrderDetailByOrderId(pOrderObj) {
        var vOrderId = pOrderObj.id;
        var vProductList = gProductList2Save;
        for (i = 0; i < vProductList.length; i++) {
            vProductSend = {
                quantityOrder: vProductList[i].quantity,
                priceEach: vProductList[i].buyPrice
            }
            $.ajax({
                url: "http://localhost:8080/order-detail/create/" + vOrderId + "/product/" + vProductList[i].id,
                //async: false,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(vProductSend),
                success: function (paramCustomerRes) {
                    $("#infoModal").modal("hide");
                    getAllOrderData();
                    clearModalInfo();
                },
                error: function (ajaxContext) {
                    //alert(ajaxContext.responseText);
                }
            })
        }

    }


    //gọi API delete product
    function callDelAPIOrder() {
        var vOrderDataGet = getOrderModal();
        $.ajax({
            url: "http://localhost:8080/order/delete/" + vOrderDataGet.id,
            //async: false,
            type: "DELETE",
            success: function (paramProductRes) {
                $("#infoModal").modal('hide');
                toastInfo("success", "Xoá thông tin thành công")
                getAllOrderData();
                clearModalInfo();
            },
            error: function (ajaxContext) {
                toastInfo("error", "Chưa xoá danh sách sản phẩm")
            }
        })
    }

    //gọi API delete Order Detail Id
    function callDeleteOrderDetailAPI(pOrderDetailId) {
        var vOrderId = $("#orderIdInfo").val();
        $.ajax({
            url: "http://localhost:8080/order-detail/delete/" + pOrderDetailId,
            //async: false,
            type: "DELETE",
            success: function (paramProductRes) {
                getProductListByOrderId(vOrderId);
                toastInfo("success", "Xoá sản phẩm thành công");
            },
            error: function (ajaxContext) {
                toastInfo("error", "Xoá không thành công");
            }
        })
    }


    $("#actionDataBtn").on("click", function () {
        if ($(this).text() === "Sửa") {
            callEditAPIOrder();
        }
        if ($(this).text() === "Xoá") {
            callDelAPIOrder();
        }
        if ($(this).text() === "Tạo mới") {

            callCreateAPIOrder();
        }

    })

    //validate modal input
    function validateDatInput() {
        var checkValue = true;
        var vOrderInput = {
            id: parseInt($("#orderIdInfo").val()),
            orderCode: $("#orderCodeInfo").val().trim(),
            customerId: $("#customerSelect").val(),
            amount: $("#ammountInfo").val(),
            status: $("#statusInfo").val(),
            orderDate: $("#orderDateInfo").val(),
            requiredDate: $("#requiredDateInfo").val(),
            shippedDate: $("#shippedDateInfo").val(),
            productList: gProductList2Save
        }
        if (vOrderInput.customerId == "" || vOrderInput.status == "" || vOrderInput.orderDate == "") {
            checkValue = false;
            toastInfo("warning", "chưa nhập đầy đủ thông tin");
        }
        if (vOrderInput.productList == null) {
            checkValue = false;
            toastInfo("warning", "Chưa chọn sản phẩm")
        }
        return checkValue;
    }

    //Toast thông báo
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

    /*-------------------------
    *TÌM KIẾM THÔNG TIN
    */
    //Action filter button
    $("#filterBtn").on("click", function (event) {
        event.preventDefault();
        gCustomerId = null;
        var vFilterStringInput = getFilterStringInput();
        filterOrderAPI(vFilterStringInput);
    });

    //on page load filter
    function loadFilterOnPageLoad(){
        if (gCustomerId !== null){
            var vFilterStringInput = getFilterStringInput();
            filterOrderAPI(vFilterStringInput);
        }
        if (gCustomerId == null){
            getAllOrderData();
        }
    }


    //lấy thông tin từ filter input string
    function getFilterStringInput() {
        if (gCustomerId == null) {
            var vFilterInputObject = {
                customerId: $("#customerSelectFilter").val(),
                orderStatus: $("#orderStatusSelect").val(),
                orderNumber: $("#orderCodeInput").val()
            }
        }
        if(gCustomerId !== null){
            var vFilterInputObject = {
                customerId: gCustomerId,
                orderStatus: $("#orderStatusSelect").val(),
                orderNumber: $("#orderCodeInput").val()
            }
        }
        return vFilterInputObject;
    }

    //gọi API order filter
    function filterOrderAPI(pFilterInputObj) {
        
        $.ajax({
            url: "http://localhost:8080/order/filter?status=" + pFilterInputObj.orderStatus +
                "&orderNumber=" + pFilterInputObj.orderNumber +
                "&customerId=" + pFilterInputObj.customerId,
            type: "GET",
            success: function (pProductRes) {
                console.log(pProductRes);
                loadAllOrderDataHandle(pProductRes);
            },
        })
    }

    /*
    *=========DATE INPUT FORMAT=========
    */
    //Khai báo biến Global
    var gStartDate;
    var gEndDate = moment()

    $(function () {
        var vStartDate = moment().subtract(60, 'days');
        var VEndDate = moment();

        function showDateRange(vStartDate, vEndDate) {
            $('#reportRange span').html(vStartDate.format('DD/MM/YYYY') + ' - ' + vEndDate.format('DD/MM/YYYY'));
            gStartDate = vStartDate.format('YYYY-MM-DD');
            gEndDate = vEndDate.format('YYYY-MM-DD');
        }

        //Khai báo date range picker
        $('#reportRange').daterangepicker({
            startDate: vStartDate,
            endDate: VEndDate,
            locale: {
                "format": "DD/MM/YYYY",
            },
            ranges: {
                'Hôm nay': [moment(), moment()],
                'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '7 ngày': [moment().subtract(6, 'days'), moment()],
                '30 ngày': [moment().subtract(29, 'days'), moment()],
                'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, showDateRange);

        showDateRange(vStartDate, VEndDate);
    })

    //set up format input date picker
    $('.date').datepicker({
        format: 'dd-mm-yyyy'
    });
    /**
     * ========End DATE FORMAT========
     */

})