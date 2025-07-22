$(document).ready(function () {
  $('.cart-item-remove').click(function () {
    var cartSubtotal = parseFloat($('.totals__subtotal-value').text().replace(/\D/g, '')) / 100;
    // enableAddToCartButton(cartSubtotal);
});

  var option = $('.product-option').find('.optionValue').text();
      console.log(option);
  
   $(".gift-add-to-cart").on("click", function () {
    var productId = $(this).closest('.product-card').data('product-id');
     
    if(option){
    disableAllAddToCartButtons();
   // $('.optionValue[data-option-value="' + 'gift-item' + '"] .quantity__button').hide();
    }else{
     addToCartGiftItem(productId);
    }
});

  var cartSubtotal = parseFloat($('.totals__subtotal-value').text().replace(/\D/g, '')) / 100;
  var productPrice = $('.product-card').data('product-price');
  console.log(productPrice);

// function enableAddToCartButton(cartSubtotal) {
      if (cartSubtotal > 300) {
        enableAddToCart(productPrice);
    }
    if (cartSubtotal > 500) {
        enableAddToCart(productPrice);
    }
    if (cartSubtotal > 750) {
        enableAddToCart(productPrice);
    }
// }

function enableAddToCart(itemPrice) {
  console.log(itemPrice);
    $('.product-card[data-product-price="' + itemPrice + '"] .gift-add-to-cart').removeAttr('disabled');
    $('.gift-item-link').attr('hidden', false);
}

function disableAllAddToCartButtons() {
   // $('.cart-item__quantity[data-item-collection="' + 'Cap' + '"] .quantity__button').prop('disabled', true);
   // $('.optionValue[data-option-value="' + 'gift-item' + '"] .quantity__button').hide();
  $('.cart-item__quantity').find('.quantity__button').prop('disabled', true);
  
    $('.gift-add-to-cart').attr('disabled', true);
    $('.gift-item-link').attr('hidden', true);
      // $('.quantity__button').prop('disabled', true);
}
 
  function addToCartGiftItem(productId) {
    var quantity = 1;
       $.ajax({
        url: '/cart/add.js',
        type: 'POST',
        dataType: 'json',
        data : {
          quantity: quantity,
          id: productId,
          properties: {
            'Title': 'gift-item'
          }
        },
        success: function(response) {
            // console.log(response);
            // window.location.href = '/cart'; 
               cartDrawerurl();
        },
        error: function(error) {
            console.log('Error adding item to cart:' + error);
        }
    });
    disableAllAddToCartButtons();
}
      
 function cartDrawerurl()
 {
    $("#cart-icon-bubble").click();
    $("cart-drawer").addClass("active");
    $("cart-drawer").removeClass("is-empty");
    $(".drawer__inner-empty").hide();
    $("cart-drawer").load(location.href + " #CartDrawer");
    $("#cart-icon-bubble").load(location.href + " #cart-icon-bubble");
 }




//     var productHandle = $('.product-card').data('product-handle');
// console.log(productHandle);

// var itemHandle = $('.cart-item__details').data('product-handle');
// console.log(itemHandle);

            // fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
            // .then((response) => response.json())
            // .then((response) => {
            //   console.log(response)
            // });
 
});


// var cartContents = fetch(window.Shopify.routes.root + 'cart.js')
//   .then(response => response.json())
//   .then(data => { 
//     var cartItems = data.items;
//     console.log(data.items.length);
//     for (let i = 0; i < cartItems.length; i++) {
//       var cartProperty = cartItems[i].properties.Title;
//       // console.log(cartProperty);
//     }
//     return data });