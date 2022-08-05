$(document).ready(function () {
    //khai báo biến
    var gActionBtn = "";

    $("#customerData").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy","excel", "pdf", "print"],
        columns: [
            { "data": "id" },
            { "data": "lastName" },
            { "data": "firstName" },
            { "data": "phoneNumber" },
            { "data": "address" },
            { "data": "city" },
            { "data": "email" },
            { "data": "creditLimit" },
            { "data": "Action Button" },
        ],
        columnDefs: [
            {
                "targets": -1,
                "defaultContent":
                    '<a class="btn customer-editBtn" title="Sửa"><i class="fas fa-pencil-alt"></i></a>'
                    + '<a class="btn customer-deleteBtn" title="Xoá"><i class="fas fa-trash"></i></a>'
            }
        ]

    }).buttons().container().appendTo('#customerData_wrapper .col-md-6:eq(0)');

    function getAllCustomerData() {
        $.ajax({
            url: "http://localhost:8080/customers",
            type: "GET",
            success: function (paramCustomerRes) {
                console.log("Response text: ", paramCustomerRes);
                loadAllCustomerDataHandle(paramCustomerRes);
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        });
    }
    getAllCustomerData();
    

    //Hàm hiển thị dữ liệu ra table
    function loadAllCustomerDataHandle(paramCustomerRes) {
        //Xóa toàn bộ dữ liệu đang có của bảng
        $("#customerData").DataTable().clear();
        //Cập nhật data cho bảng 
        $("#customerData").DataTable().rows.add(paramCustomerRes);
        //Cập nhật lại giao diện hiển thị bảng
        $("#customerData").DataTable().draw();
    }

    /*
        Xử lý CRUD customer
    */

    //action nút sửa customer
    $("#customerData").on("click", "tbody .customer-editBtn", function () {
        console.log("Đây là nút sửa thông tin sản phẩm");
        var vcustomerTable = $("#customerData").DataTable();
        var vCustomerData = vcustomerTable.row($(this).closest("tr")).data();
        console.log("row data id: " + vCustomerData.id);
        gActionBtn = "Sửa";
        console.log(gActionBtn);
        showCustomerToModal(vCustomerData);

    })

    //action nút xoá customer
    $("#customerData").on("click", "tbody .customer-deleteBtn", function () {
        console.log("Đây là nút xoá thông tin sản phẩm");
        var vcustomerTable = $("#customerData").DataTable();
        var vCustomerData = vcustomerTable.row($(this).closest("tr")).data();
        console.log("row data id: " + vCustomerData.id);
        gActionBtn = "Xoá";
        console.log(gActionBtn);
        showCustomerToModal(vCustomerData);
    })


    //action nút tạo customer
    $("#createBtn").on("click", function () {
        console.log("Đây là nút tạo mới sản phẩm");
        gActionBtn = "Tạo";
        showCustomerToModal();


    })

    //action nút xem đơn hàng chi tiết
    $("#showOrderCustomerBtn").on("click", function (event) {
        event.preventDefault()
        var vCustomerId = $("#customerIdInfo").val();
        const ORDER_DETAIL_URL = "admin-order.html";
        var vUrlSiteToOpen = ORDER_DETAIL_URL + "?" + "customerId=" + vCustomerId;
        window.location.href = vUrlSiteToOpen;  
    })

    //xem tổng tiền theo khách hàng
    function showTotalAmmountByCustomer(pCustomerId){
        
        $.ajax({
            url: "http://localhost:8080/customer/sumtotal/" + pCustomerId,
            type: "GET",
            success: function (pTotalAmmountByCustomerRes) {
                $("#totalAmmountByCustomer").val("Tổng tiền mua hàng: " + pTotalAmmountByCustomerRes.toLocaleString('vi', { style: 'currency', currency: 'VND' }))
            },
            error: function (ajaxContext) {
                $("#totalAmmountByCustomer").val("Chưa mua hàng")
            }
        });
    }

    //show customer info
    function showCustomerToModal(paramCustomer) {
        
        if (paramCustomer != null) {
            $("#infoModal").modal('show');
            $("#customerIdInfo").val(paramCustomer.id);
            $("#customerLastnameInfo").val(paramCustomer.lastName);
            $("#customerFirstnameInfo").val(paramCustomer.firstName);
            $("#customerPhoneNumberInfo").val(paramCustomer.phoneNumber);
            $("#customerCreditInfo").val(paramCustomer.creditLimit);
            $("#customerAddressInfo").val(paramCustomer.address);
            $("#customerCityInfo").val(paramCustomer.city);
            $("#customerEmailInfo").val(paramCustomer.email);
            showTotalAmmountByCustomer(paramCustomer.id);
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
                $(".modal-title").text("Đang tạo mới thông tin");
                $("#actionDataBtn").text("Tạo mới");
                $("#actionDataBtn").addClass("btn-primary");
                $("#actionDataBtn").removeClass("btn-info");
                $("#actionDataBtn").removeClass("btn-danger");
            }
        }
    }

    //clear modal info before show
    function clearModalInfo() {
        $("#customerIdInfo").val("");
        $("#customerLastnameInfo").val("");
        $("#customerFirstnameInfo").val("");
        $("#customerPhoneNumberInfo").val("");
        $("#customerCreditInfo").val("");
        $("#customerAddressInfo").val("");
        $("#customerCityInfo").val("");
        $("#customerEmailInfo").val("");
        $("#totalAmmountByCustomer").val("");
    }

    //get customer info from input modal
    function getCustomerModal() {

        var vCustomerInfoInput = {
            id: parseInt($("#customerIdInfo").val()),
            lastName: $("#customerLastnameInfo").val().trim(),
            firstName: $("#customerFirstnameInfo").val().trim(),
            phoneNumber: $("#customerPhoneNumberInfo").val().trim(),
            creditLimit: parseInt($("#customerCreditInfo").val().trim()),
            address: $("#customerAddressInfo").val().trim(),
            city: $("#customerCityInfo").val().trim(),
            email: $("#customerEmailInfo").val().trim()
        }
        return vCustomerInfoInput;
    }

    //gọi API edit customer
    function callEditAPIcustomer() {
        var CustomerData = getCustomerModal();
        var checkValidate = validateDatInput();
        if (checkValidate == true) {
            $.ajax({
                url: "http://localhost:8080/customer/update/" + CustomerData.id,
                //async: false,
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(CustomerData),
                success: function (paramcustomerRes) {
                    $("#infoModal").modal('hide');
                    $.toast({
                        heading: 'Success',
                        text: 'Sửa thông tin thành công',
                        showHideTransition: 'slide',
                        icon: 'success'
                    })
                    getAllCustomerData();
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

    }

    //gọi API create customer
    function callCreateAPIcustomer() {
        var vCustomerDataSend = getCustomerModal();
        var checkValidate = validateDatInput();
        if (checkValidate == true) {
            $.ajax({
                url: "http://localhost:8080/customer/create/",
                //async: false,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(vCustomerDataSend),
                success: function (paramcustomerRes) {
                    console.log("Tạo customer thành công");
                    $("#infoModal").modal('hide');
                    $.toast({
                        heading: 'Success',
                        text: 'Tạo thông tin thành công',
                        showHideTransition: 'slide',
                        icon: 'success'
                    })
                    getAllCustomerData();
                },
                error: function (ajaxContext) {
                    var errorMess = ajaxContext.responseText;
                    console.log(errorMess);
                    $.toast({
                        heading: 'Error',
                        text: 'lỗi không tạo được thông tin: ' + errorMess,
                        showHideTransition: 'fade',
                        icon: 'error'
                    })
                }
            })
        }
    }


    //gọi API delete customer
    function callDelAPIcustomer() {
        var CustomerData = getCustomerModal();
        $.ajax({
            url: "http://localhost:8080/customer/delete/" + CustomerData.id,
            //async: false,
            type: "DELETE",
            success: function (paramcustomerRes) {
                console.log("Xoá thông tin thay đổi thành công")
                $("#infoModal").modal('hide');
                $.toast({
                    heading: 'Success',
                    text: 'Xoá thông tin thành công',
                    showHideTransition: 'slide',
                    icon: 'success'
                })
                getAllCustomerData();
            },
            error: function (ajaxContext) {
                //alert(ajaxContext.responseText);
            }
        })
    }

    $("#actionDataBtn").on("click", function () {
        if ($(this).text() === "Sửa") {
            callEditAPIcustomer();
        }
        if ($(this).text() === "Xoá") {
            callDelAPIcustomer();
        }
        if ($(this).text() === "Tạo mới") {
            callCreateAPIcustomer();
        }

    })

    //validate modal input
    function validateDatInput() {
        var checkValue = true;
        var vCustomerInfoInput = {
            id: parseInt($("#customerIdInfo").val()),
            lastName: $("#customerLastnameInfo").val().trim(),
            firstName: $("#customerFirstnameInfo").val().trim(),
            phoneNumber: $("#customerPhoneNumberInfo").val().trim(),
            creditLimit: parseInt($("#customerCreditInfo").val().trim()),
            address: $("#customerAddressInfo").val().trim(),
            city: $("#customerCityInfo").val().trim(),
            email: $("#customerEmailInfo").val().trim()
        }
        if (vCustomerInfoInput.lastName == "" || vCustomerInfoInput.firstName == "" ||
            vCustomerInfoInput.phoneNumber == "" || vCustomerInfoInput.address == "" ||
            vCustomerInfoInput.city == "" || vCustomerInfoInput.email == "") {
            checkValue = false;
            $.toast({
                heading: 'Cảnh báo',
                text: 'Chưa nhập đầy đủ thông tin',
                showHideTransition: 'plain',
                icon: 'warning'
            })
        }
        return checkValue;
    }


})