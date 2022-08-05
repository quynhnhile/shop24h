$(document).ready(function () {
    //Global Variable
    gProductSize = 8;
    gPage = 0
    gPageObject = {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        products: []
    }

    gBrandName = [];

    gCurrentPageSelect = 0;
    gFindProductName = false;
    gFilterBrandName = false;
    gListProductAll = true;

    //lấy thông tin toàn bộ sản phẩm lần đầu load page
    function getProductDataFirstTime() {

        $.ajax({
            url: "http://localhost:8080/products?page=" + gPage + "&size=" + gProductSize,
            type: "GET",
            success: function (pObj) {
                //console.log("Response Text:", pObj);
                gPageObject = pObj;
                loadProductData();
                pagination();
            },
            error: function (ajaxContext) {

            }
        })
    }
    getProductDataFirstTime();
    //loadProductData();

    function getPageAllProduct() {
        console.log("get page all product " + gCurrentPageSelect);
        //set lại trang đầu tiên
        $.ajax({
            url: "http://localhost:8080/products?page=" + gCurrentPageSelect + "&size=" + gProductSize,
            type: "GET",
            success: function (pObj) {
                console.log("Response Text:", pObj);
                gPageObject = pObj;
                loadProductData();
            },
            error: function (ajaxContext) {

            }
        })
    }



    function loadProductData() {
        $("#all-products").text("");

        for (i = 0; i < gPageObject.products.length; i++) {
            var vProduct = $(`<div class="col-md-3">
            <div class="single-shop-product">
                <div class="singgle-product-img">
                    <img src="img/${gPageObject.products[i].productCode}.jpg">
                </div>
                <div class="single-product-title">
                    <h2><a href="single-product.html?id=${gPageObject.products[i].id}">${gPageObject.products[i].productName}</a></h2>
                </div>
                <div class="product-carousel-price text-center">
                    <ins>${(gPageObject.products[i].buyPrice).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</ins>
                </div>
                <div class="product-option-shop text-center">
                    <a class="add_to_cart_button" id="addProductBtn"data-quantity="1"
                    data-product_price=${gPageObject.products[i].buyPrice}
                    data-product_name="${gPageObject.products[i].productName}" 
                    data-product_id="${gPageObject.products[i].id}"
                    data-product_code="${gPageObject.products[i].productCode}"
                        rel="nofollow" href="">Thêm vào giỏ</a>
                </div>
            </div>
        </div>`)
            $("#all-products").append(vProduct)
        }

        pagination(gPageObject);

    }

    $("#all-products").on("click", "#addProductBtn", function (event) {
        event.preventDefault();
        var vProduct = {
            id: $(this).data("product_id"),
            code: $(this).data("product_code"),
            name: $(this).data("product_name"),
            price: $(this).data("product_price"),
            qty: 1
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
                //thông báo đã có sản phẩm trong giỏ hàng
                callToast("duplicate");
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
            callToast("success");
        }
    }

    function removeProduct(productId) {
        // remove product from cart (and from local storage)

        // retrieve list of products from LS
        const lsContent = getLSContent();

        // get the index of the product item to remove
        // inside the local storage content array
        let productIndex;
        lsContent.forEach(function (product, i) {
            if (product.id === productId) {
                productIndex = i;
            }
        });

        // modify the items in local storage array
        // to remove the selected product item

        lsContent.splice(productIndex, 1);
        // update local storage content
        setLSContent(lsContent);
    }

    
    //Call toast
    function callToast(pToastType) {
        if (pToastType == "success") {
            toastr.success('Đã thêm sản phẩm vào giỏ');
        }
        if (pToastType == "duplicate") {
            toastr.info('Sản phẩm đã có trong giỏ');
        }
        
    }
    

    //phân trang
    function pagination() {
        var vPageArea = $("#pageNumber");
        vPageArea.text("");
        var prePage = `<li>
                            <a aria-label="Previous" id="previousPage">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>`;
        var nextPage = `<li>
                            <a aria-label="Next" id="nextPage">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>`;
        vPageArea.append(prePage);
        for (i = 0; i < gPageObject.totalPages; i++) {
            var pageNumber = `<li><a class="page-number" data-current_page="${i + 1}">${i + 1}</a></li>`
            vPageArea.append(pageNumber);
        }
        vPageArea.append(nextPage);
    }

    $("#pageNumber").on("click", ".page-number", function () {
        //phải trừ 1 vì index của page bắt đầu  = 0
        var currentPage = $(this).text() - 1;
        gCurrentPageSelect = currentPage;
        console.log("Current page: " + currentPage);
        if (gListProductAll == true) {
            getPageAllProduct();
        }
        if (gFindProductName == true) {
            findByProductName();
        }

    })

    //sự kiện previous page
    $("#pageNumber").on("click", "#previousPage", function () {
        if (gPageObject.currentPage == 0) {
            console.log("Đang ở trang đầu tiên")
        } else {
            gCurrentPageSelect = gPageObject.currentPage - 1;
            if (gListProductAll == true) {
                getPageAllProduct();
            }
            if (gFindProductName == true) {
                findByProductName();
            }
        }
    })

    //sự kiện next page
    $("#pageNumber").on("click", "#nextPage", function () {
        if (gPageObject.currentPage + 1 == gPageObject.totalPages) {
            console.log("Đang ở trang cuối cùng")
        } else {
            gCurrentPageSelect = gPageObject.currentPage + 1;
            if (gListProductAll == true) {
                getPageAllProduct();
            }
            if (gFindProductName == true) {
                findByProductName();
            }
        }
    })

    /*
        Tìm kiếm và filter sản phẩm
    */

    //Tìm kiếm theo tên sản phẩm
    function findByProductName() {
        var vProductNameInput = $("#productNameInput").val().trim();
        //đặt giá trị global để xác định phân trang cho filter gì
        console.log("Page Find Product Name:" + gCurrentPageSelect);
        //set lại trang đầu tiên
        gCurrentPageSelect = 0;

        gFindProductName = true;
        gFilterBrandName = false;
        gListProductAll = false;

        if (vProductNameInput === "") {
            console.log("Hãy điền tên sản phẩm");
            getProductDataFirstTime();
            gFindProductName = false;
            gFilterBrandName = false;
            gListProductAll = true;
        } else {
            $.ajax({
                url: "http://localhost:8080/products/find?name=" + vProductNameInput + "&size=" + gProductSize + "&page=" + gCurrentPageSelect,
                type: "GET",
                success: function (pObj) {
                    console.log("Response Text:", pObj);
                    gPageObject = pObj
                    loadProductData();
                },
                error: function (ajaxContext) {
                    console.log("Sản phẩm không tìm thấy");
                }
            })
        }
    }

    //event ấn nút tìm kiếm
    $("#searchProductBtn").on("click", function (event) {
        event.preventDefault();
        findByProductName();
    });

    /*
        Xử lý select box
    */

    $("#filterProductBtn").on("click", function (event) {
        event.preventDefault();
        var vBrandNameSelectValue = $("#brandNameSelect").val();
        var vProductLineSelectValue = $("#productLineSelect").val();
        console.log("Brand name select: " + vBrandNameSelectValue);
        console.log("Brand name select: " + vProductLineSelectValue);
        searchProductByBrandName_AndProductLineId(vBrandNameSelectValue, vProductLineSelectValue)
    })


    //search product by brand name
    function searchProductByBrandName_AndProductLineId(pBrandNameSelectValue, pProductLineSelectValue) {

        $.ajax({
            url: "http://localhost:8080/products/search?brandName=" + pBrandNameSelectValue + "&productLineId=" + pProductLineSelectValue,
            type: "GET",
            success: function (pObj) {
                console.log("Response Text:", pObj);
                gPageObject = pObj;
                loadProductData();
            },
            error: function (ajaxContext) {
                console.log("Sản phẩm không tìm thấy");
            }
        })

    }

})