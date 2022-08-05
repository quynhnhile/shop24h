$(document).ready(function(){
    function getLSContent() {
        // get contents from local storage.
        // if nothing is there, create an empty array
        const lsContent = JSON.parse(localStorage.getItem("products")) || [];
        return lsContent;
    }

    var gCart = getLSContent();
    console.log(gCart);
    
    function showTotalItemInCart(){
        countProductInCart();
        sumPriceInCart();
    }

    showTotalItemInCart();

    function countProductInCart(){
        var vCountProduct = 0
        for(i = 0; i < gCart.length; i++){
            vCountProduct += gCart[i].qty;
        }
        $(".product-count").text(vCountProduct);
    }


    function sumPriceInCart(){
        var vCartAmount = 0;
        for(i = 0; i < gCart.length; i++){
            vCartAmount += gCart[i].price*gCart[i].qty;
        }
        $(".cart-amunt").text(vCartAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' }));
    }



})