$(document).ready(function () {

    var gTopSellProductArray = [];

    //get top sell product from DB
    function getTopSellProductList() {
        $.ajax({
            url: "http://localhost:8080/topSellProduct",
            type: "GET",
            success: function (pTopSellProduct) {
                showTopSellProduct(pTopSellProduct);
            },
            error: function (ajaxContext) {

            }
        })
    }

    getTopSellProductList();

    //show product to carousel in Index page
    function showTopSellProduct(pTopSellProductList) {
        var topSellProductCarousel = $("#topSellProductCarousel");
        topSellProductCarousel.text("");
        topSellProductCarousel.append(`<h2 class="section-title">Sản phẩm bán chạy</h2>`);
        for (i = 0; i < pTopSellProductList.length; i++) {
            var vProduct = $(`<div class="col-md-3" >
            <div class="single-product" style="height: 358px; width: 212px;">
                <div class="product-f-image text-center" style="height: 264px; width: 212px;">
                    <img src="img/${pTopSellProductList[i].product_code}.jpg" alt="" style="height: 100%;width: 100%;">
                    <div class="product-hover">
                        <a href="" class="add-to-cart-link"
                            id="addProductBtn"
                            data-product_price=${pTopSellProductList[i].buy_Price}
                            data-product_name="${pTopSellProductList[i].product_Name}" 
                            data-product_id="${pTopSellProductList[i].product_id}"
                            data-product_code="${pTopSellProductList[i].product_code}">
                            <iclass="fa fa-shopping-cart"></i> Thêm vào giỏ</a>
                        <a href="single-product.html?id=${pTopSellProductList[i].product_id}" class="view-details-link"><i
                                class="fa fa-link"></i> Xem chi tiết</a>
                    </div>
                </div>
                <div class="single-product-title text-center" style="margin-top: 10px;">
                    <h4><a href="single-product.html?id=${pTopSellProductList[i].product_id}">${pTopSellProductList[i].product_Name}</a></h4>
                </div>
                <div class="product-carousel-price text-center">
                    <ins>${pTopSellProductList[i].buy_Price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</ins>
                </div>
            </div>
        </div>`);
            topSellProductCarousel.append(vProduct);
        }

    }

    //add product to cart

    $("#topSellProductCarousel").on("click", "#addProductBtn", function (event) {
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


        //Call toast
        function callToast(pToastType) {
            if (pToastType == "success") {
                toastr.success('Đã thêm sản phẩm vào giỏ');
            }
            if (pToastType == "duplicate") {
                toastr.info('Sản phẩm đã có trong giỏ');
            }

        }
    }
})