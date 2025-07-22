$(document).ready(function () {
    var productDetail = JSON.parse(getCookie('productDetail')) || [];
    var productCompareCount = productDetail.length;

    $(".productCompareCount").text(productCompareCount);

    productDetail.forEach(productHandle => {
        fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
            .then((response) => response.json())
            .then((product) => {
                var productPrice = product.price / 100;
                var finalProductPrice = productPrice.toFixed(2);
                var productVariants = product.variants;
                var varianttags = product.tags.map(variant => `${variant}`).join(', ');
                var variantOptions = productVariants.map(variant => `<option value="${variant.id}" class="selectVariant">${variant.title} - ${(variant.price / 100).toFixed(2)}</option>`).join('');
                var variantSku = productVariants.map(variant => `${variant.sku}`).join(', ');
                var variantOption = productVariants.map(variant => `${variant.title}`).join(', ');
                var variantTaxable = productVariants.map(variant => `${variant.taxable}`).join(', ');
                var variantWeight = productVariants.map(variant => `${variant.weight}`).join(', ');
                var variantAvailable = productVariants.map(variant => `${variant.available}`).join(', ');
                var variantRequireShipping = productVariants.map(variant => `${variant.requires_shipping}`).join(', ');

                $('.product-type').append(`<td id="productCompare-${productHandle}">${product.type}</td>`);
                $('.product-vendor').append(`<td id="productCompare-${productHandle}">${product.vendor}</td>`);
                $('.product-description').append(`<td id="productCompare-${productHandle}">${product.description}</td>`);
                $('.product-available').append(`<td id="productCompare-${productHandle}">${product.available}</td>`);
                $('.product-tags').append(`<td id="productCompare-${productHandle}">${varianttags}</td>`);
                $('.product-published').append(`<td id="productCompare-${productHandle}">${product.published_at}</td>`);

                $('.product-comapare-titles').append(`<td id="productCompare-${productHandle}"><span class="text-dark font-weight-semibold">${product.handle}</span></td>`);
                $('.variant-sku').append(`<td id="productCompare-${productHandle}">${variantSku}</td>`);
                $('.variant-taxable').append(`<td id="productCompare-${productHandle}">${variantTaxable}</td>`);
                $('.variant-weight').append(`<td id="productCompare-${productHandle}">${variantWeight}</td>`);
                $('.variant-name').append(`<td id="productCompare-${productHandle}">${variantOption}</td>`);
                $('.variant-available').append(`<td id="productCompare-${productHandle}">${variantAvailable}</td>`);
                $('.variant-requires_shipping').append(`<td id="productCompare-${productHandle}">${variantRequireShipping}</td>`);

                $('.product-image-container').append(`<td id="productCompare${productHandle}"><div class="comparison-item" data-product-handle="${product.handle}"><span data-product-handle="${product.handle}" class="remove-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
                    <a class="comparison-item-thumb" href="${product.url}"><img src="${product.images[0]}" alt="${product.title}" class="product-compair-image"></a>
                    <a class="comparison-item-title" href="${product.url}">${product.title}</a>
                    <a class="comparison-item-title" href="${product.url}">${finalProductPrice}</a>
                    <button class="btn btn-pill btn-outline-primary btn-smm btnAddToCartCompareProduct" type="button" data-product-id="${productVariants[0].id}" data-toggle="toast" data-target="#cart-toast">Add to Cart</button>
                    </div></td>`);
            });
    });

    $('.products-comapare-container').on('click', '.remove-item', function () {
        var productHandle = $(this).data('product-handle');
        removeFromProductCompare(productHandle);
    });

    $('.products-comapare-container').on('click', '.btnAddToCartCompareProduct', function () {
        var productHandle = $(this).closest('.comparison-item').data('product-handle');
        var variantId = $(this).data("product-id");
        var quantity = 1;

        $.ajax({
            url: '/cart/add.js',
            type: 'POST',
            dataType: 'json',
            data: {
                quantity: quantity,
                id: variantId
            },
            success: function (response) {
                cartDrawerurl();
            },
            error: function (error) {
                console.error('Error adding item to cart:', error);
            }
        });
    });

    $(".compare-product-add").each(function () {
        var productHandle = $(this).closest('.product-card').data('product-handle');
        if (productDetail.indexOf(productHandle) !== -1) {
            $(this).prop('checked', true);
        }
    });

    $('.product-list-container').on('click', '.compare-product-add', function () {
        if ($(this).is(':checked')) {
            var productHandle = $(this).closest('.product-card').data('product-handle');
            addToProductCompare(productHandle, $(this));
        } else {
            var productHandle = $(this).closest('.product-card').data('product-handle');
            removeFromProductCompare(productHandle, $(this));
        }
    });

    function cartDrawerurl() {
        $("#cart-icon-bubble").click();
        $("cart-drawer").addClass("active");
        $("cart-drawer").removeClass("is-empty");
        $(".drawer__inner-empty").hide();
        $("cart-drawer").load(location.href + " #CartDrawer");
        $("#cart-icon-bubble").load(location.href + " #cart-icon-bubble");
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === " ") {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }
});

function removeFromProductCompare(productHandle) {
    var productDetail = JSON.parse(getCookie('productDetail')) || [];
    productDetail = productDetail.filter(handle => handle !== productHandle);
    setCookie('productDetail', JSON.stringify(productDetail), { expires: 365 });
    var productCompareCount = productDetail.length;
    $(".productCompareCount").text(productCompareCount);
    $('#productCompare-' + productHandle).remove();
   location.reload();
}

function addToProductCompare(productHandle, element) {
    var productDetail = JSON.parse(getCookie('productDetail')) || [];

    if (productDetail.indexOf(productHandle) === -1) {
        productDetail.push(productHandle);
        setCookie('productDetail', JSON.stringify(productDetail), 365);
        element.prop('checked', true);
        var productCompareCount = productDetail.length;
        $(".productCompareCount").text(productCompareCount);
    } else {
        removeFromProductCompare(productHandle);
        element.prop('checked', false);
    }
}

$(function () {
    $('[data-filter="trigger"]').on("change", function () {
        var t = $(this).find("option:selected").val().toLowerCase();

        $('[data-filter="target"]').css("display", "none");
        $("#" + t).css("display", "table-row-group");
        if (t == "all") {
            $('[data-filter="target"]').css("display", "table-row-group")
        }
        $(this).css("display", "block");
    });
});



// $(document).ready(function () {
//     var ProductDetail = JSON.parse(getCookie('productDetail')) || [];
//     productCompareCount = ProductDetail.length;

//     $(".productCompareCount").text(productCompareCount);

//     ProductDetail.forEach(productHandle => {
//         fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
//             .then((response) => response.json())
//             .then((product) => {
//               console.log(product);
//                 var productPrice = product.price / 100;
//                 var finalProductPrice = productPrice.toFixed(2);
//                 var productVariants = product.variants;
//                 var varianttags = product.tags.map(variant => `${variant}`).join(', ');
//                 var variantOptions = productVariants.map(variant => `<option value="${variant.id}" class="selectVariant">${variant.title} - ${(variant.price / 100).toFixed(2)}</option>`).join('');
//                 var variantSku = productVariants.map(variant => `${variant.sku}`).join(', ');
//                 var variantOption = productVariants.map(variant => `${variant.title}`).join(', ');
//                 var variantTaxable = productVariants.map(variant => `${variant.taxable}`).join(', ');
//                 var variantWeight = productVariants.map(variant => `${variant.weight}`).join(', ');
//                 var variantAvailable = productVariants.map(variant => `${variant.available}`).join(', ');
//                 var variantRequireShipping = productVariants.map(variant => `${variant.requires_shipping}`).join(', ');

//                  $('.product-type').append(`<td id="productCompare-${productHandle}">${product.type}</td>`);
//                  $('.product-vendor').append(`<td id="productCompare-${productHandle}">${product.vendor}</td>`);
//                  $('.product-description').append(`<td id="productCompare-${productHandle}">${product.description}</td>`);
//                  $('.product-available').append(`<td id="productCompare-${productHandle}">${product.available}</td>`);
//                  $('.product-tags').append(`<td id="productCompare-${productHandle}">${varianttags}</td>`);
//                  $('.product-published').append(`<td id="productCompare-${productHandle}">${product.published_at}</td>`);

//                  $('.product-comapare-titles').append(`<td id="productCompare-${productHandle}"><span class="text-dark font-weight-semibold">${product.handle}</span></td>`);
//                  $('.variant-sku').append(`<td id="productCompare-${productHandle}">${variantSku}</td>`);
//                  $('.variant-taxable').append(`<td id="productCompare-${productHandle}">${variantTaxable}</td>`);
//                  $('.variant-weight').append(`<td id="productCompare-${productHandle}">${variantWeight}</td>`);
//                  $('.variant-name').append(`<td id="productCompare-${productHandle}">${variantOption}</td>`);
//                  $('.variant-available').append(`<td id="productCompare-${productHandle}">${variantAvailable}</td>`);
//                  $('.variant-requires_shipping').append(`<td id="productCompare-${productHandle}">${variantRequireShipping}</td>`);

//                  $('.product-image-container').append(`<td id="productCompare${productHandle}"><div class="comparison-item" data-product-handle="${product.handle}"><span  data-product-handle="${product.handle}" class="remove-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
//                   <a class="comparison-item-thumb" href="${product.url}"><img src="${product.images[0]}" alt="${product.title}" class="product-compair-image"></a>
//                   <a class="comparison-item-title" href="${product.url}">${product.title}</a>
//                   <a class="comparison-item-title" href="${product.url}">${finalProductPrice}</a>
//                   <button class="btn btn-pill btn-outline-primary btn-smm btnAddToCartCompareProduct" type="button" data-product-id="${productVariants[0].id}" data-toggle="toast" data-target="#cart-toast">Add to Cart</button>
//                   </div></td>`);
//             });
//     });

//     $('.products-comapare-container').on('click', '.remove-item', function () {
//         var productHandle = $(this).data('product-handle');
      
//       console.log(productHandle);
//         removeFromProductCompare(productHandle);
//     });

//     $('.products-comapare-container').on('click', '.btnAddToCartCompareProduct', function () {
//           console.log("clicked");
//          var productHandle = $('.comparison-item').data('product-handle');
//          var variantId = $(this).data("product-id");
//          console.log(variantId);
//          var quantity = 1;

//         $.ajax({
//             url: '/cart/add.js',
//             type: 'POST',
//             dataType: 'json',
//             data: {
//                 quantity: quantity,
//                 id: variantId
//             },
//             success: function (response) {
//                 // window.location.href = '/cart';
//               cartDrawerurl();
//             },
//             error: function (error) {
//                 console.error('Error adding item to cart:', error);
//             }
//         });
//       // removeFromWishlist(productHandle);
//     });

//     $(".compare-product-add").each(function () {
//         var productHandle = $(this).closest('.product-card').data('product-handle');
//         if (ProductDetail.indexOf(productHandle) !== -1) {
//           $(this).prop('checked', true);
//         }
//     });

//     $('.product-list-container').on('click', '.compare-product-add', function () {
//         if ($(this).is(':checked')) {
//         var productHandle = $(this).closest('.product-card').data('product-handle');
//          // console.log(productHandle);
//         addToProductCompare(productHandle, $(this));
//      }
//       else{
//          var productHandle = $(this).closest('.product-card').data('product-handle');
//          // console.log(productHandle);
//         removeFromProductCompare(productHandle, $(this));
//           }
//     });
 
//  function cartDrawerurl()
//     {
//          $("#cart-icon-bubble").click();
//         $("cart-drawer").addClass("active");
//         $("cart-drawer").removeClass("is-empty");
//         $(".drawer__inner-empty").hide();
//     $("cart-drawer").load(location.href + " #CartDrawer");
//         $("#cart-icon-bubble").load(location.href + " #cart-icon-bubble");
//     }
// });
//     function removeFromProductCompare(productHandle) {
//         var productDetail = JSON.parse(getCookie('productDetail')) || [];
//         productDetail = productDetail.filter(handle => handle !== productHandle);
//         setCookie('productDetail', JSON.stringify(productDetail), { expires: 365 });
//         productCompareCount = productDetail.length;
//       $(".productCompareCount").text(productCompareCount);
//         $('#productCompare-' + productHandle).remove();
//           // $('[id^="productCompare-' + productHandle + '"]').remove();
//         location.reload();
//     }
// function addToProductCompare(productHandle, element) {
//     var productDetail = JSON.parse(getCookie('productDetail')) || [];

//     if (productDetail.indexOf(productHandle) === -1) {
//         productDetail.push(productHandle);
//         setCookie('productDetail', JSON.stringify(productDetail), 365);
//         element.prop('checked', true);
//         productCompareCount = productDetail.length;
//        $(".productCompareCount").text(productCompareCount);
//     } else {
//         removeFromProductCompare(productHandle);
//         element.prop('checked', false);
//     }
// }
// function setCookie(name, value, days) {
//   var expires = "";
//   if (days) {
//     var date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// function getCookie(name) {
//   var nameEQ = name + "=";
//   var cookies = document.cookie.split(";");
//   for (var i = 0; i < cookies.length; i++) {
//     var cookie = cookies[i];
//     while (cookie.charAt(0) === " ") {
//       cookie = cookie.substring(1, cookie.length);
//     }
//     if (cookie.indexOf(nameEQ) === 0) {
//       return cookie.substring(nameEQ.length, cookie.length);
//     }
//   }
//   return null;
// }


//   $(function(){
// $('[data-filter="trigger"]').on("change", function() {
//     var t = $(this).find("option:selected").val().toLowerCase();

// 	$('[data-filter="target"]').css("display", "none"); 
// 	$("#" + t).css("display", "table-row-group"); 
// 	if(t == "all") {
// 		$('[data-filter="target"]').css("display", "table-row-group")
// 	}
// 	$(this).css("display", "block"); 
// });
// }) ;
