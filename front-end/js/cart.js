$(document).ready(function () {
    showItemLSToCart();
    showTotalPrice();

    // get contents from local storage.
    function getLSContent() {

        // if nothing is there, create an empty array
        const vLSContent = JSON.parse(localStorage.getItem("products"));
        return vLSContent;
    }

    // save content inside local storage
    function setLSContent(pLSContent) {
        localStorage.setItem("products", JSON.stringify(pLSContent));
    }

    //show item from local storage to cart
    function showItemLSToCart() {
        var vLSContent = getLSContent();
        $("#cartContent > tbody").text("");
        if (vLSContent !== null) {
            for (i = 0; i < vLSContent.length; i++) {
                bProductMarkup = `<tr class="cart_item">
                                    <td class="product-remove">
                                        <a title="Xoá sản phẩm" class="remove btn" data-product_id=${vLSContent[i].id}>X</a>
                                    </td>
                                    <td class="product-thumbnail">
                                        <a href="single-product.html?id=${vLSContent[i].id}"><img width="145" height="145"
                                                alt="poster_1_up" class="shop_thumbnail"
                                                src="img/${vLSContent[i].code}.jpg"></a>
                                    </td>

                                    <td class="product-name">
                                        <a href="single-product.html?id=${vLSContent[i].id}">${vLSContent[i].name}</a>
                                    </td>

                                    <td class="product-price">
                                        <span class="amount">${vLSContent[i].price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                    </td>

                                    <td class="product-quantity">
                                        <div class="quantity buttons_added">
                                            <input type="button" class="minus" value="-" data-product_id=${vLSContent[i].id}>
                                            <input type="number" size="4" class="input-text qty text"
                                                title="Qty" value="${vLSContent[i].qty}" min="0" step="1">
                                            <input type="button" class="plus" value="+" data-product_id=${vLSContent[i].id}>
                                        </div>
                                    </td>

                                    <td class="product-subtotal">
                                        <span class="amount subTotalPrice">${(vLSContent[i].price * vLSContent[i].qty).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                    </td>
                                </tr>`;
                $("#cartContent").append(bProductMarkup);
            }
        } else {
            // if no content is in local storage, alert user
            bProductMarkup = `<tr class="cart_item">
                                <td colspan="6"><p style="font-size: 20px">Chưa có sản phẩm trong giỏ hàng</p></td>
                            </tr>`;
            $("#cartContent").append(bProductMarkup);
        }
    }

    //Show total price
    function showTotalPrice() {
        console.log("Tổng giá tiền là: ");
        var sum = 0;
        // iterate through each td based on class and add the values
        $(".product-subtotal").each(function () {

            //convert string sang float và * thêm 1.000.000 để quy ra số tiền
            var value = parseFloat($(this).text()) * 1000000.00;
            console.log(value)
            // add only if the value is number
            if (!isNaN(value) && value.length != 0) {
                sum += parseFloat(value);
            }
        });
        $("#cartTotal").text(sum.toLocaleString('vi', { style: 'currency', currency: 'VND' }));

    }

    //Hàm xoá sản phẩm khỏi giỏ hàng
    function removeProduct(pProductId) {
        // remove product from cart (and from local storage)

        // retrieve list of products from LS
        var vLSContent = getLSContent();

        // get the index of the product item to remove
        // inside the local storage content array
        let vProductIndex;
        vLSContent.forEach(function (product, i) {
            if (product.id === pProductId) {
                vProductIndex = i;
            }
        });

        // modify the items in local storage array
        // to remove the selected product item

        vLSContent.splice(vProductIndex, 1);
        // update local storage content
        setLSContent(vLSContent);
        showItemLSToCart();
    }

    //Hàm tăng số lượng sản phẩm trong giỏ
    function increaseQtyProduct(productId) {
        // remove product from cart (and from local storage)

        // retrieve list of products from LS
        var lsContent = getLSContent();

        // get the index of the product item to remove
        // inside the local storage content array
        let productIndex;
        lsContent.forEach(function (product, i) {
            if (product.id === productId) {
                productIndex = i;

            }
        });

        lsContent[productIndex].qty = lsContent[productIndex].qty + 1;
        setLSContent(lsContent);
        showItemLSToCart();
    }

    //Hàm giảm số lượng sản phẩm trong giỏ
    function decreaseQtyProduct(productId) {
        // remove product from cart (and from local storage)

        // retrieve list of products from LS
        var lsContent = getLSContent();

        // get the index of the product item to remove
        // inside the local storage content array
        let productIndex;
        lsContent.forEach(function (product, i) {
            if (product.id === productId) {
                productIndex = i;

            }
        });

        if (lsContent[productIndex].qty > 1) {
            lsContent[productIndex].qty = lsContent[productIndex].qty - 1;
        }

        setLSContent(lsContent);
        showItemLSToCart();
    }

    $("#cartContent").on("click", ".plus", function () {
        var vProductId = $(this).data("product_id");
        increaseQtyProduct(vProductId);
        showTotalPrice();
    })

    $("#cartContent").on("click", ".minus", function () {
        var vProductId = $(this).data("product_id");
        decreaseQtyProduct(vProductId);
        showTotalPrice();
    })

    $("#cartContent").on("click", ".remove", function () {
        console.log("Xoá sản phẩm khỏi cart");
        var vProductId = $(this).data("product_id")
        removeProduct(vProductId);
        showTotalPrice();
    })

    
})