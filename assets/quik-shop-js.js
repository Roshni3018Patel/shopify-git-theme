$(document).ready(function () { 
  var currentProductResponse;
  var selectedVariants = {
    option1: null,
    option2: null
  };
  
    $('.product-list-container').on('click', '.quikShopBtn', function () {
    var productHandle = $(this).closest('.product-card').data('product-handle');
    var variantsContainer = $('.variants-choose');
       var wishlistContainer = $('.btnWishList');

    fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
      .then((response) => response.json())
      .then((response) => {
        currentProductResponse = response;
        var productTitle = response.title;
        var productPrice = response.price / 100;
        var finalProductPrice = productPrice.toFixed(2);
        var productImage = response.images[0];
        var productVariants = response.variants;

        console.log(response.available);

        $('.popup-view .product-title').text(productTitle);
        $('.popup-view .product-price').text(finalProductPrice);
        $(".popup-view #image-product").attr("src", productImage);

        var uniqueOption1Variants = [];
        var uniqueOption2Variants = [];
        for (let i = 0; i < productVariants.length; i++) {
          let variant = productVariants[i];

          if (!uniqueOption1Variants.includes(variant.option1)) {
            uniqueOption1Variants.push(variant.option1);
          }
          if (variant.option2 && !uniqueOption2Variants.includes(variant.option2)) {
            uniqueOption2Variants.push(variant.option2);
          }
        }

        if (uniqueOption1Variants.length > 1 || uniqueOption2Variants.length > 1) {
          var variantsCard = '';
          if (uniqueOption1Variants.length > 1) {
            variantsCard += ` <p class="product-select-variants1">${response.options[0].name + ':'}</p> <div class="variants-options"  data-product-handle="${response.handle}" >
                                ${uniqueOption1Variants.map((variant, index) => `<button class="variants-btn ${index === 0 ? 'activevariants' : ''}" id="first-variant" data-variant-type="option1" value="${variant}">${variant}</button>`).join('')}
                              </div>`;
          }
          if (uniqueOption2Variants.length > 1) {
            variantsCard += `    <p class="product-variants">${response.options[1].name + ':'}</p><div class="variants-options">
                                ${uniqueOption2Variants.map((variant, index) => `<button class="variants-btn ${index === 0 ? 'activevariants' : ''}" data-variant-type="option2" value="${variant}">${variant}</button>`).join('')}
                              </div>`;
          }
          variantsContainer.html(variantsCard);
          variantsContainer.show();
        } else {
          variantsContainer.hide();
        }
        $('.popup-view').addClass('active');

         var wishlistCard = `
                       <div class="product-card" id="product-card" data-product-handle="${productHandle}" data-product-id="${response.id}">
                          <div>
                          <i class="addtoWishlist fa fa-heart" style="font-size:25px"></i>
                          </div> 
                       </div>
                   `;
           wishlistContainer.html(wishlistCard);
         wishlistFunction(productHandle);
      if(response.available === false)
      {
        $(".addToCart").attr("disabled", true);
         $(".addToCart").text("Sold Out");
      }
      });
      
       $(".addToCart").attr("disabled", false);
         $(".addToCart").text("Add to Cart");
    
  });

  $('.variants-choose').on('click', '.variants-btn', function () {
    var selectedVariant = $(this).val();
    var variantType = $(this).data('variant-type');

    $('.variants-btn[data-variant-type="' + variantType + '"]').removeClass('activevariants');
    $(this).addClass('activevariants');

    selectedVariants[variantType] = selectedVariant;

    var selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1 && variant.option2 === selectedVariants.option2);
    if (!selectedVariantData) {
      if (selectedVariants.option1 !== null) {
        selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1);
      } else if (selectedVariants.option2 !== null) {
        selectedVariantData = currentProductResponse.variants.find(variant => variant.option2 === selectedVariants.option2);
      }
    }

       var availableInventory = selectedVariantData.available;
       console.log(availableInventory);

    console.log(selectedVariantData);

    if (selectedVariantData) {
       $(".popup-view #image-product").attr("src", selectedVariantData.featured_image.src);
      $('.popup-view .product-price').text(selectedVariantData.price / 100);
      $('.product-select-variants').html(selectedVariant);
      $('.selectProductVariants').val(selectedVariantData.id);
    }
    
    if(availableInventory === false)
    {
     $(".addToCart").attr("disabled", true);
     $(".addToCart").text("Out of Stock");
    }
    else
     {
       $(".addToCart").attr("disabled", false);
         $(".addToCart").text("Add to Cart");
     }
  });

     $('.addToCart').click(function () {
    var variantId;

    var selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1 && variant.option2 === selectedVariants.option2);
    if (!selectedVariantData) {
      if (selectedVariants.option1 !== null) {
        selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1);
      } else if (selectedVariants.option2 !== null) {
        selectedVariantData = currentProductResponse.variants.find(variant => variant.option2 === selectedVariants.option2);
      }
    }
       var quantity = $('.product-qty').val();

      console.log(selectedVariantData);
      console.log(quantity);

    if (selectedVariantData) {
      variantId = selectedVariantData.id;
    } else {
      var variantId = currentProductResponse.variants[0].id;
         console.log("product id " + variantId ); 
    }

    $.ajax({
      url: '/cart/add.js',
      type: 'POST',
      dataType: 'json',
      data: {
        quantity: quantity,
        id: variantId
      },
      success: function (response) {
        window.location.href = '/cart';
           $('.product-qty').val('1');
      },
      error: function (error) {
        console.log('Error adding item to cart:' + error);
      }
    });
  });

  $('.close-btn').on('click', function () {
    $('.popup-view').removeClass('active');
     $('.product-qty').val('1');
    var productHandle = currentProductResponse.handle;
  });

  
function wishlistFunction(productHandle)
  {
      var wishlist = JSON.parse(getCookie('wishlist')) || [];
     if (wishlist.indexOf(productHandle) !== -1) {
          $('.popup-view .addtoWishlist').addClass("wishlist-added");
          }
        else
          {
          $('.popup-view .addtoWishlist').removeClass("wishlist-added");
          }  
  }

    // function searchProducts(query) {
    //     $.ajax({
    //         url: '/search',
    //         type: 'GET',
    //         data: { q: query }, 
    //         dataType: 'json',
    //         success: function (response) {

    //             updateProductList(response.products);
    //         },
    //         error: function (error) {
    //             console.log('Error searching products:', error);
    //         }
    //     });
    // }

    // $('#searchButton').click(function () {
    //     var searchQuery = $('#searchInput').val();
    //     if (searchQuery.trim() !== '') {
    //         searchProducts(searchQuery);
    //     }
    // });

    // function updateProductList(products) {

    //     $('.product-list-container').empty();

    //     products.forEach(function (product) {
    //         var productCard = '<div class="product-card">' +
    //             '<h3>' + product.title + '</h3>' +
    //             '<p>Price: ' + product.price + '</p>' +
    //             // Add more product information as needed
    //             '</div>';
    //         $('.product-list-container').append(productCard);
    //     });
    // }
});





// $(document).ready(function () {
//   var currentProductResponse;
//   var selectedVariants = {
//     option1: null,
//     option2: null
//   };

//   $('.product-list-container').on('click', '.quikShopBtn', function () {
//     var productHandle = $(this).closest('.product-card').data('product-handle');
//     var variantsContainer = $('.variants-choose');

//     fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
//       .then((response) => response.json())
//       .then((response) => {
//         currentProductResponse = response;
//         var productTitle = response.title;
//         var productPrice = response.price / 100;
//         var productImage = response.images[0];
//         var productVariants = response.variants;


//         $('.popup-view .product-title').text(productTitle);
//         $('.popup-view .product-price').text(productPrice);
//         $(".popup-view #image-product").attr("src", productImage);

//         var uniqueOption1Variants = [];
//         var uniqueOption2Variants = [];
//         for (let i = 0; i < productVariants.length; i++) {
//           let variant = productVariants[i];

//           //    console.log(variant.option1);
          
//           // $('#first-variant').val(variant.option1);
          
//           if (!uniqueOption1Variants.includes(variant.option1)) {
//             uniqueOption1Variants.push(variant.option1);
//              $('.popup-view .product-select-variants1').show();
//               $('.popup-view .product-select-variants1').html(response.options[0].name + ':');
//           }
//           if (variant.option2 && !uniqueOption2Variants.includes(variant.option2)) {
//             uniqueOption2Variants.push(variant.option2);   
//                $('.popup-view .product-variants').show();
//             $('.popup-view .product-variants').html(response.options[1].name + ':');
//           }
//         }

//         if (uniqueOption1Variants.length > 1 || uniqueOption2Variants.length > 1) {
//           var variantsCard = '';
//           if (uniqueOption1Variants.length > 1) {
//             variantsCard += `<div class="variants-options">
//                                 ${uniqueOption1Variants.map(variant => `<button class="variants-btn" id="first-variant" data-variant-type="option1" value="${variant}">${variant}</button>`).join('')}
//                               </div>`;    
//           }
//           if (uniqueOption2Variants.length > 1) {
//             variantsCard += `<div class="variants-options">
//                                 ${uniqueOption2Variants.map(variant => `<button class="variants-btn" data-variant-type="option2" value="${variant}">${variant}</button>`).join('')}
//                               </div>`;  
//           }
//           variantsContainer.html(variantsCard);
//           variantsContainer.show();

        
//         } else {
//           variantsContainer.hide();
//             $('.popup-view .product-select-variants1').hide();
//            $('.popup-view .product-variants').hide();
//         }
//         $('.popup-view').addClass('active');
//       });
//   });

  
//   $('.variants-choose').on('click', '.variants-btn', function () {
//     var selectedVariant = $(this).val();
//     var variantType = $(this).data('variant-type');

//     console.log(variantType);
    
//     $('.variants-btn[data-variant-type="' + variantType + '"]').removeClass('activevariants');

//     $(this).addClass('activevariants');

//     selectedVariants[variantType] = selectedVariant;

//     var selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1 && variant.option2 === selectedVariants.option2);
//     console.log(selectedVariantData);
    
//      if (selectedVariantData) {
//       $(".popup-view #image-product").attr("src", selectedVariantData.featured_image.src);
//       $('.popup-view .product-price').text(selectedVariantData.price / 100);
//       $('.product-select-variants').html(selectedVariant);
//       $('.selectProductVariants').val(selectedVariantData.id);
//     }

//     console.log(selectedVariants.option1);
//      console.log(selectedVariants.option2);
//   });


//     $('.addToCart').click(function () {
//     var variantId;
//     var selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1 && variant.option2 === selectedVariants.option2);

//       var quantity = $('.product-qty').val();
    
//       console.log(quantity);
      
//     if (selectedVariantData) {
//       variantId = selectedVariantData.id;
//     } else {
//       var variantId = currentProductResponse.variants[0].id;
//          console.log("product id " + variantId ); 
//     }

//     $.ajax({
//       url: '/cart/add.js',
//       type: 'POST',
//       dataType: 'json',
//       data: {
//         quantity: quantity,
//         id: variantId
//       },
//       success: function (response) {
//         window.location.href = '/cart';
//       },
//       error: function (error) {
//         console.log('Error adding item to cart:' + error);
//       }
//     });
//   });

//     $('[data-quantity="plus"]').click(function(e){
//         e.preventDefault();
//         fieldName = $(this).attr('data-field');
//         var currentVal = parseInt($('input[name='+fieldName+']').val());
//         if (!isNaN(currentVal)) {
//             $('input[name='+fieldName+']').val(currentVal + 1);
//         } else {
//             $('input[name='+fieldName+']').val(0);
//         }
//     });
//     $('[data-quantity="minus"]').click(function(e) {
//         e.preventDefault();
//         fieldName = $(this).attr('data-field');
//         var currentVal = parseInt($('input[name='+fieldName+']').val());
//         if (!isNaN(currentVal) && currentVal > 0) {
//             $('input[name='+fieldName+']').val(currentVal - 1);
//         } else {  
//           $('input[name='+fieldName+']').val(0);
//         }
//     });

//   $('.close-btn').on('click', function () {
//     $('.popup-view').removeClass('active');
//   });
// });




















// $(document).ready(function () {
//   var currentProductResponse;
//   var selectedVariants = {
//     option1: null,
//     option2: null
//   };

//   $('.product-list-container').on('click', '.quikShopBtn', function () {
//     var productHandle = $(this).closest('.product-card').data('product-handle');
//     var variantsContainer = $('.variants-choose');

//     fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
//       .then((response) => response.json())
//       .then((response) => {
//         currentProductResponse = response;
//         var productTitle = response.title;
//         var productPrice = response.price / 100;
//         var productImage = response.images[0];
//         var productVariants = response.variants;

//         $('.popup-view .product-title').text(productTitle);
//         $('.popup-view .product-price').text(productPrice);
//         $(".popup-view #image-product").attr("src", productImage);

//         var uniqueOption1Variants = [];
//         var uniqueOption2Variants = [];
//         for (let i = 0; i < productVariants.length; i++) {
//           let variant = productVariants[i];

//           if (!uniqueOption1Variants.includes(variant.option1)) {
//             uniqueOption1Variants.push(variant.option1);
//           }
//           if (variant.option2 && !uniqueOption2Variants.includes(variant.option2)) {
//             uniqueOption2Variants.push(variant.option2);
//           }
//         }

//         if (uniqueOption1Variants.length > 1 || uniqueOption2Variants.length > 1) {
//           var variantsCard = '';
//           if (uniqueOption1Variants.length > 1) {
//             variantsCard += `<div class="variants-options">
//                                 ${uniqueOption1Variants.map(variant => `<button class="variants-btn" data-variant-type="option1" value="${variant}">${variant}</button>`).join('')}
//                               </div>`;
//           }
//           if (uniqueOption2Variants.length > 1) {
//             variantsCard += `<div class="variants-options">
//                                 ${uniqueOption2Variants.map(variant => `<button class="variants-btn" data-variant-type="option2" value="${variant}">${variant}</button>`).join('')}
//                               </div>`;
//           }
//           variantsContainer.html(variantsCard);
//           variantsContainer.show();
//         } else {
//           variantsContainer.hide();
//         }
//         $('.popup-view').addClass('active');
//       });
//   });

//   $('.variants-choose').on('click', '.variants-btn', function () {
//     var selectedVariant = $(this).val();
//     var variantType = $(this).data('variant-type');

//     if (variantType === 'option1') {
//       selectedVariants.option1 = selectedVariant;
//     } else if (variantType === 'option2') {
//       selectedVariants.option2 = selectedVariant;
//     }

//     // Toggle active class on clicked button
//     $(this).toggleClass('activevariants');

//     var selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1 || variant.option2 === selectedVariants.option2);

//     if (selectedVariantData) {
//       $(".popup-view #image-product").attr("src", selectedVariantData.featured_image.src);
//       $('.popup-view .product-price').text(selectedVariantData.price / 100);
//       $('.product-select-variants').html(selectedVariant);
//       $('.selectProductVariants').val(selectedVariantData.id);
//     }
//   });

//   $('.close-btn').on('click', function () {
//     $('.popup-view').removeClass('active');
//   });

//   $('.addToCart').click(function () {
//     var variantId;
//     var selectedVariantData = currentProductResponse.variants.find(variant => variant.option1 === selectedVariants.option1 || variant.option2 === selectedVariants.option2);

//     if (selectedVariantData) {
//       variantId = selectedVariantData.id;
//     } else {
//       // Handle the case when no variant is selected
//       console.error("No variant selected");
//       return;
//     }

//     var quantity = $('.product-qty').val();

//     $.ajax({
//       url: '/cart/add.js',
//       type: 'POST',
//       dataType: 'json',
//       data: {
//         quantity: quantity,
//         id: variantId
//       },
//       success: function (response) {
//         window.location.href = '/cart';
//       },
//       error: function (error) {
//         console.log('Error adding item to cart:' + error);
//       }
//     });
//   });

//   var QtyInput = (function () {
//     var $qtyInputs = $(".qty-input");

//     if (!$qtyInputs.length) {
//       return;
//     }

//     var $inputs = $qtyInputs.find(".product-qty");
//     var $countBtn = $qtyInputs.find(".qty-count");
//     var qtyMin = parseInt($inputs.attr("min"));
//     var qtyMax = parseInt($inputs.attr("max"));

//     $inputs.change(function () {
//       var $this = $(this);
//       var $minusBtn = $this.siblings(".qty-count--minus");
//       var $addBtn = $this.siblings(".qty-count--add");
//       var qty = parseInt($this.val());

//       if (isNaN(qty) || qty <= qtyMin) {
//         $this.val(qtyMin);
//         $minusBtn.attr("disabled", true);
//       } else {
//         $minusBtn.attr("disabled", false);

//         if (qty >= qtyMax) {
//           $this.val(qtyMax);
//           $addBtn.attr('disabled', true);
//         } else {
//           $this.val(qty);
//           $addBtn.attr('disabled', false);
//         }
//       }
//     });

//     $countBtn.click(function () {
//       var operator = this.dataset.action;
//       var $this = $(this);
//       var $input = $this.siblings(".product-qty");
//       var qty = parseInt($input.val());

//       if (operator == "add") {
//         qty += 1;
//         if (qty >= qtyMin + 1) {
//           $this.siblings(".qty-count--minus").attr("disabled", false);
//         }

//         if (qty >= qtyMax) {
//           $this.attr("disabled", true);
//         }
//       } else {
//         qty = qty <= qtyMin ? qtyMin : (qty -= 1);

//         if (qty == qtyMin) {
//           $this.attr("disabled", true);
//         }

//         if (qty < qtyMax) {
//           $this.siblings(".qty-count--add").attr("disabled", false);
//         }
//       }

//       $input.val(qty);
//     });
//   })();

// });









