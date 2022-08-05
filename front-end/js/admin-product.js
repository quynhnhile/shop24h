$(document).ready(function () {
    //khai báo biến
    var gActionBtn = "";

    $("#productData").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy","excel", "pdf", "print"],
        columns: [
            { "data": "id" },
            { "data": "productCode" },
            { "data": "productName" },
            { "data": "productDescription" },
            { "data": "productVendor" },
            { "data": "quantityInStock" },
            { "data": "buyPrice" },
            { "data": "Action Button" },
        ],
        columnDefs: [
            {
                "targets": -1,
                "defaultContent":
                    '<a class="btn product-editBtn" title="Sửa"><i class="fas fa-pencil-alt"></i></a>'
                    + '<a class="btn product-deleteBtn" title="Xoá"><i class="fas fa-trash"></i></a>'
            }
        ]

    }).buttons().container().appendTo('#productData_wrapper .col-md-6:eq(0)');

    function getAllProductData() {
        $.ajax({
            url: "http://localhost:8080/products/all",
            type: "GET",
            success: function (paramProductRes) {
                console.log("Response text: ", paramProductRes);
                loadAllProductDataHandle(paramProductRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        });
    }
    getAllProductData();

    //Hàm hiển thị dữ liệu ra table
    function loadAllProductDataHandle(paramProductRes) {
        //Xóa toàn bộ dữ liệu đang có của bảng
        $("#productData").DataTable().clear();
        //Cập nhật data cho bảng 
        $("#productData").DataTable().rows.add(paramProductRes);
        //Cập nhật lại giao diện hiển thị bảng
        $("#productData").DataTable().draw();
    }

    /*
        Xử lý CRUD sản phẩm
    */

    //action nút sửa sản phẩm
    $("#productData").on("click", "tbody .product-editBtn", function () {
        console.log("Đây là nút sửa thông tin sản phẩm");
        var vProductTable = $("#productData").DataTable();
        var vProductData = vProductTable.row($(this).closest("tr")).data();
        console.log("row data id: " + vProductData.id);
        gActionBtn = "Sửa";
        console.log(gActionBtn);
        showProductToModal(vProductData);

    })

    //action nút xoá sản phẩm
    $("#productData").on("click", "tbody .product-deleteBtn", function () {
        console.log("Đây là nút xoá thông tin sản phẩm");
        var vProductTable = $("#productData").DataTable();
        var vProductData = vProductTable.row($(this).closest("tr")).data();
        console.log("row data id: " + vProductData.id);
        gActionBtn = "Xoá";
        console.log(gActionBtn);
        showProductToModal(vProductData);
    })


    //action nút tạo sản phẩm
    $("#createBtn").on("click", function () {
        console.log("Đây là nút tạo mới sản phẩm");
        gActionBtn = "Tạo";
        showProductToModal();


    })

    //show product info
    function showProductToModal(paramProduct) {

        if (paramProduct != null) {
            $("#infoModal").modal('show');
            $("#productIdInfo").val(paramProduct.id);
            $("#productCodeInfo").val(paramProduct.productCode);
            $("#productNameInfo").val(paramProduct.productName);
            $("#productDescInfo").val(paramProduct.productDescription);
            $("#productVendorInfo").val(paramProduct.productVendor);
            $("#productPriceInfo").val(paramProduct.buyPrice);
            $("#productQtyStockInfo").val(paramProduct.quantityInStock);

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
                clearModalInfo();
                showProductLineSelect();
                $(".modal-title").text("Đang tạo mới thông tin");
                $("#actionDataBtn").text("Tạo mới");
                $("#actionDataBtn").addClass("btn-primary");
                $("#actionDataBtn").removeClass("btn-info");
                $("#actionDataBtn").removeClass("btn-danger");
            }
        }
    }

    //show product line to selector
    function showProductLineSelect() {
        $.ajax({
            url: "http://localhost:8080/productLine/all",
            type: "GET",
            success: function (paramProductLineRes) {
                console.log("Product line: " + paramProductLineRes);
                $("#productLineSelect").text("");
                var bSelectText = $("<option/>", {
                    value: "",
                    text: "Chọn loại sản phẩm"
                }).appendTo($("#productLineSelect"))

                //load product line to select box
                for (i = 0; i < paramProductLineRes.length; i++) {
                    var bProductLineOption = $("<option/>");
                    bProductLineOption.prop("value", paramProductLineRes[i].id);
                    bProductLineOption.prop("text", paramProductLineRes[i].productCode);
                    $("#productLineSelect").append(bProductLineOption);
                }
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        })
    }

    //clear modal info before show
    function clearModalInfo() {
        $("#productIdInfo").val("");
        $("#productCodeInfo").val("");
        $("#productNameInfo").val("");
        $("#productDescInfo").val("");
        $("#productVendorInfo").val("");
        $("#productPriceInfo").val("");
        $("#productQtyStockInfo").val("");
    }

    //get product info from input modal
    function getProductModal() {
        if (gActionBtn == "Sửa") {
            var vProductInfoInput = {
                productId: parseInt($("#productIdInfo").val()),
                productCode: $("#productCodeInfo").val().trim(),
                productName: $("#productNameInfo").val().trim(),
                productDescription: $("#productDescInfo").val().trim(),
                productVendor: $("#productVendorInfo").val().trim(),
                quantityInStock: parseInt($("#productQtyStockInfo").val().trim()),
                buyPrice: parseFloat($("#productPriceInfo").val().trim())
            }
        }
        if (gActionBtn == "Tạo") {
            var vProductInfoInput = {
                productId: parseInt($("#productIdInfo").val()),
                productCode: $("#productCodeInfo").val().trim(),
                productName: $("#productNameInfo").val().trim(),
                productDescription: $("#productDescInfo").val().trim(),
                productVendor: $("#productVendorInfo").val().trim(),
                quantityInStock: parseInt($("#productQtyStockInfo").val().trim()),
                buyPrice: parseFloat($("#productPriceInfo").val().trim()),
                productLineId: $("#productLineSelect").val()
            }
        }
        if (gActionBtn == "Xoá") {
            var vProductInfoInput = {
                productId: parseInt($("#productIdInfo").val()),
                productCode: $("#productCodeInfo").val().trim(),
                productName: $("#productNameInfo").val().trim(),
                productDescription: $("#productDescInfo").val().trim(),
                productVendor: $("#productVendorInfo").val().trim(),
                quantityInStock: parseInt($("#productQtyStockInfo").val().trim()),
                buyPrice: parseFloat($("#productPriceInfo").val().trim()),
            }
        }
        return vProductInfoInput;
    }

    //gọi API edit product
    function callEditAPIProduct() {
        var productData = getProductModal();
        $.ajax({
            url: "http://localhost:8080/product/update/" + productData.productId,
            //async: false,
            type: "PUT",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(productData),
            success: function (paramProductRes) {
                $("#infoModal").modal('hide');
                $.toast({
                    heading: 'Success',
                    text: 'Sửa thông tin thành công',
                    showHideTransition: 'slide',
                    icon: 'success'
                })
                getAllProductData();
            },
            error: function (ajaxContext) {
                console.log(ajaxContext);
                $.toast({
                    heading: 'Error',
                    text: 'lỗi không sửa được thông tin: ' + ajaxContext.status,
                    showHideTransition: 'fade',
                    icon: 'error'
                })

            }
        })
    }

    //gọi API create product
    function callCreateAPIProduct() {
        var vProductDataSend = getProductModal();
        var checkValidate = validateDatInput();
        if (checkValidate == true) {
            $.ajax({
                url: "http://localhost:8080/product/create/" + vProductDataSend.productLineId,
                //async: false,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(vProductDataSend),
                success: function (paramProductRes) {
                    console.log("Tạo product thành công");
                    $("#infoModal").modal('hide');
                    $.toast({
                        heading: 'Success',
                        text: 'Tạo thông tin thành công',
                        showHideTransition: 'slide',
                        icon: 'success'
                    })
                    getAllProductData();
                },
                error: function (ajaxContext) {
                    var errorMess = ajaxContext.responseText;
                    console.log(errorMess);
                    $.toast({
                        heading: 'Error',
                        text: 'lỗi không tạo được thông tin: ',
                        showHideTransition: 'fade',
                        icon: 'error'
                    })
                }
            })
        }
    }


    //gọi API delete product
    function callDelAPIProduct() {
        var productData = getProductModal();
        $.ajax({
            url: "http://localhost:8080/product/delete/" + productData.productId,
            //async: false,
            type: "DELETE",
            success: function (paramProductRes) {
                console.log("Xoá thông tin thay đổi thành công")
                $("#infoModal").modal('hide');
                $.toast({
                    heading: 'Success',
                    text: 'Xoá thông tin thành công',
                    showHideTransition: 'slide',
                    icon: 'success'
                })
                getAllProductData();
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        })
    }

    $("#actionDataBtn").on("click", function () {
        if ($(this).text() === "Sửa") {
            callEditAPIProduct();
        }
        if ($(this).text() === "Xoá") {
            callDelAPIProduct();
        }
        if ($(this).text() === "Tạo mới") {
            callCreateAPIProduct();
        }

    })

    //validate modal input
    function validateDatInput() {
        var checkValue = true;
        var vProductInfoInput = {
            productId: parseInt($("#productIdInfo").val()),
            productCode: $("#productCodeInfo").val().trim(),
            productName: $("#productNameInfo").val().trim(),
            productDescription: $("#productDescInfo").val().trim(),
            productVendor: $("#productVendorInfo").val().trim(),
            quantityInStock: parseInt($("#productQtyStockInfo").val().trim()),
            buyPrice: parseFloat($("#productPriceInfo").val().trim()),
            productLineId: $("#productLineSelect").val()
        }
        if (vProductInfoInput.productCode == "" || vProductInfoInput.productName == "" ||
            vProductInfoInput.productDescription == "" || vProductInfoInput.productVendor == "" ||
            vProductInfoInput.quantityInStock == "" || vProductInfoInput.buyPrice == "") {
            checkValue = false;
            $.toast({
                heading: 'Cảnh báo',
                text: 'Chưa nhập đầy đủ thông tin',
                showHideTransition: 'plain',
                icon: 'warning'
            })
        }
        if (vProductInfoInput.productLineId == "") {
            checkValue = false;
            $.toast({
                heading: 'Cảnh báo',
                text: 'Chưa chọn dòng sản phẩm',
                showHideTransition: 'plain',
                icon: 'warning'
            })
        }
        return checkValue;
    }


})