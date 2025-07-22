$(document).ready(function () {
    var wishlist = JSON.parse(getCookie('wishlist')) || [];
    wishlistCount = wishlist.length;

    $(".wishlistCount").text(wishlistCount);

    var wishlistProductsContainer = $('.wishlist-products');

    wishlist.forEach(productHandle => {
        fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
            .then((response) => response.json())
            .then((response) => {
                var productPrice = response.price / 100;
                var finalProductPrice = productPrice.toFixed(2);

                var productVariants = response.variants;
                var defaultVariant = productVariants.find(variant => variant.title === 'Default Title');

                var variantOptions = productVariants.map(variant => `<option value="${variant.id}" class="selectVariant">${variant.title} - ${(variant.price / 100).toFixed(2)}</option>`).join('');

                var productCard = `
                    <div class="product-card" id="product-card-${productHandle}" data-product-handle="${productHandle}" data-product-id="${response.id}">
                        <a href="${response.url}" id="${response.id}" class="Products">
                            <img src="${response.images[0]}" alt="${response.title}" width="200" height="200">
                            <h3 class="product-title">${response.title}</h3>
                            <p class="product-price">${finalProductPrice}</p>
                        </a>
                        <div class="variant-choose" ${defaultVariant ? 'style="display: none;"' : ''}>
                            <select class="product-variant-select">
                                ${variantOptions}
                            </select>
                        </div>
                        <button class="wishlistAddToCart" ${!response.available ? 'disabled' : ''}>${!response.available ? 'Sold Out' : 'Add to Cart'}</button>
                        <button class="remove-from-wishlist">&#10005; Remove</button>
                    </div>
                `;

                wishlistProductsContainer.append(productCard);
            });
    });

    $('.wishlist-products').on('change', '.product-variant-select', function () {
        var variantId = $(this).val();
        var productHandle = $(this).closest('.product-card').data('product-handle');
        var addToCartButton = $(this).closest('.product-card').find('.wishlistAddToCart');
        // addToCartButton.prop('disabled', false);

        $.ajax({
            url: window.Shopify.routes.root + 'variants/' + variantId + '.js',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
              console.log(response);
                if (!response.available) {
                    addToCartButton.prop('disabled', true);
                    addToCartButton.text('Sold Out');
                } else {
                    addToCartButton.prop('disabled', false);
                    addToCartButton.text('Add to Cart');
                }
            },
            error: function (error) {
                console.error('Error fetching variant:', error);
            }
        });
    });

    $('.wishlist-products').on('click', '.remove-from-wishlist', function () {
        var productHandle = $(this).closest('.product-card').data('product-handle');
        removeFromWishlist(productHandle);
    });

    $('.wishlist-products').on('click', '.wishlistAddToCart', function () {
        var productHandle = $(this).closest('.product-card').data('product-handle');
        var variantId = $(this).closest('.product-card').find('.product-variant-select').val();
      console.log(variantId);
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
                // window.location.href = '/cart';
              cartDrawerurl();
            },
            error: function (error) {
                console.error('Error adding item to cart:', error);
            }
        });
      removeFromWishlist(productHandle);
    });

    $(".addtoWishlist").each(function () {
        var productHandle = $(this).closest('.product-card').data('product-handle');
        if (wishlist.indexOf(productHandle) !== -1) {
            $(this).addClass("wishlist-added");
        }
    });

    $('.product-list-container').on('click', '.addtoWishlist', function () {
        var productHandle = $(this).closest('.product-card').data('product-handle');
        addToWishlist(productHandle, $(this));
    });
 function cartDrawerurl()
    {
          $("#cart-icon-bubble").click();
        $("cart-drawer").addClass("active");
        $("cart-drawer").removeClass("is-empty");
        $(".drawer__inner-empty").hide();

    $("cart-drawer").load(location.href + " #CartDrawer");
        $("#cart-icon-bubble").load(location.href + " #cart-icon-bubble");

    }

});
    function removeFromWishlist(productHandle) {
        var wishlist = JSON.parse(getCookie('wishlist')) || [];
        wishlist = wishlist.filter(handle => handle !== productHandle);
        setCookie('wishlist', JSON.stringify(wishlist), { expires: 365 });
        wishlistCount = wishlist.length;
        $(".wishlistCount").text(wishlistCount);
        $('#product-card-' + productHandle).remove();
    }

function addToWishlist(productHandle, element, quickView = false) {
    var wishlist = JSON.parse(getCookie('wishlist')) || [];

    if (wishlist.indexOf(productHandle) === -1) {
        wishlist.push(productHandle);
        setCookie('wishlist', JSON.stringify(wishlist), 365);
        element.addClass("wishlist-added");
        // element.text("Product Added");
 
        if (quickView) {
            // $('.popup-view .addtoWishlist[data-product-handle="' + productHandle + '"]').addClass("wishlist-added");
           $('.popup-view .addtoWishlist').addClass("wishlist-added");
        }

        if (!quickView) {
            $('.product-card[data-product-handle="' + productHandle + '"] .addtoWishlist').addClass("wishlist-added");
        }
        wishlistCount = wishlist.length;
        $(".wishlistCount").text(wishlistCount);
    } else {
        removeFromWishlist(productHandle, quickView);
        element.removeClass("wishlist-added");
        // element.text("Product Removed");
      
        if (quickView) {
            // $('.popup-view .addtoWishlist[data-product-handle="' + productHandle + '"]').removeClass("wishlist-added");
           $('.popup-view .addtoWishlist').removeClass("wishlist-added");
        }
        if (!quickView) {
            $('.product-card[data-product-handle="' + productHandle + '"] .addtoWishlist').removeClass("wishlist-added");
        }
    }
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









  // function addToWishlist(productHandle, element) {
  //      var wishlist = JSON.parse(getCookie('wishlist')) || [];
  //      // console.log(wishlist);

  //      if (wishlist.indexOf(productHandle) === -1) {
  //        wishlist.push(productHandle);
  //        setCookie('wishlist', JSON.stringify(wishlist), 365);
  //           element.addClass("wishlist-added");
  //        alert('Product is Added to the wishlist');
  //          wishlistCount = wishlist.length;
  //         $(".wishlistCount").text(wishlistCount);
  //        // window.location.href = '/pages/wishlist';
         
  //      } else {
  //        removeFromWishlist(productHandle)
  //          element.removeClass("wishlist-added");
  //        alert('Product is removed in the wishlist');
  //      }
  //    }

  // function removeFromWishlist(productHandle) {
  //      var wishlist = JSON.parse(getCookie('wishlist')) || [];
  //    console.log(productHandle);
  //     wishlist = wishlist.filter(handle => handle !== productHandle);
  //     setCookie('wishlist', JSON.stringify(wishlist), { expires: 365 });
  //     console.log(wishlist);
  //      wishlistCount = wishlist.length;
  //   $(".wishlistCount").text(wishlistCount);
  //     $('#product-card-' + productHandle).remove();

  //   }






// $(document).ready(function () {
//     var wishlist = JSON.parse(getCookie('wishlist')) || [];
//     wishlistCount = wishlist.length;

//     $(".wishlistCount").text(wishlistCount);

//     var wishlistProductsContainer = $('.wishlist-products');

//     wishlist.forEach(productHandle => {
//         fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
//             .then((response) => response.json())
//             .then((response) => {
//                 var productPrice = response.price / 100;
//                 var finalProductPrice = productPrice.toFixed(2);

//                 var productVariants = response.variants;
//                 var defaultVariant = productVariants.find(variant => variant.title === 'Default Title');

//                 var productCard = `
//                     <div class="product-card" id="product-card-${productHandle}" data-product-handle="${productHandle}" data-product-id="${response.id}">
//                         <a href="${response.url}" id="${response.id}" class="Products">
//                             <img src="${response.images[0]}" alt="${response.title}" width="200" height="200">
//                             <h3 class="product-title">${response.title}</h3>
//                             <p class="product-price">${finalProductPrice}</p>
//                         </a>
//                         <div class="variant-choose" ${defaultVariant ? 'style="display: none;"' : ''}>
//                             <select id="variant-select" class="second-variant-select">
//                                 ${productVariants.map(variant => `<option value="${variant.id}" class="selectVariant">${variant.title} - ${(variant.price / 100).toFixed(2)}</option>`).join('')}
//                             </select>
//                         </div>
//                         <button class="wishlistAddToCart" ${!defaultVariant || !response.available ? 'disabled' : ''}>${!defaultVariant || !response.available ? 'Sold Out' : 'Add to Cart'}</button>
//                         <button class="remove-from-wishlist">&#10005; Remove</button>
//                     </div>
//                 `;

//                 wishlistProductsContainer.append(productCard);
//             });
//     });

//     $('.wishlist-products').on('click', '.remove-from-wishlist', function () {
//         var productHandle = $(this).closest('.product-card').data('product-handle');
//         removeFromWishlist(productHandle);
//     });

//     $('.wishlist-products').on('change', '.second-variant-select', function () {
//         var variantId = $(this).val();
//         var productHandle = $(this).closest('.product-card').data('product-handle');
//         var addToCartButton = $(this).closest('.product-card').find('.wishlistAddToCart');
//         addToCartButton.prop('disabled', true);

//         $.ajax({
//             url: window.Shopify.routes.root + 'variants/' + variantId + '.js',
//             type: 'GET',
//             dataType: 'json',
//             success: function (response) {
//                 if (!response.available) {
//                     addToCartButton.prop('disabled', true);
//                     addToCartButton.text('Sold Out');
//                 } else {
//                     addToCartButton.prop('disabled', false);
//                     addToCartButton.text('Add to Cart');
//                 }
//             },
//             error: function (error) {
//                 console.error('Error fetching variant:', error);
//             }
//         });
//     });

//     $('.wishlist-products').on('click', '.wishlistAddToCart', function () {
//         var productHandle = $(this).closest('.product-card').data('product-handle');
//         var variantId = $(this).closest('.product-card').find('.second-variant-select').val();
//         var quantity = 1;

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
//             },
//             error: function (error) {
//                 console.error('Error adding item to cart:', error);
//             }
//         });
//     });

//     $(".addtoWishlist").each(function () {
//         var productHandle = $(this).closest('.product-card').data('product-handle');
//         if (wishlist.indexOf(productHandle) !== -1) {
//             $(this).addClass("wishlist-added");
//         }
//     });

//     $('.product-list-container').on('click', '.addtoWishlist', function () {
//         var productHandle = $(this).closest('.product-card').data('product-handle');
//         addToWishlist(productHandle, $(this));
//     });

//     function removeFromWishlist(productHandle) {
//         var wishlist = JSON.parse(getCookie('wishlist')) || [];
//         wishlist = wishlist.filter(handle => handle !== productHandle);
//         setCookie('wishlist', JSON.stringify(wishlist), { expires: 365 });
//         wishlistCount = wishlist.length;
//         $(".wishlistCount").text(wishlistCount);
//         $('#product-card-' + productHandle).remove();
//     }
// });

