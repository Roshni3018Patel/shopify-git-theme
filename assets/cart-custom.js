// $(document).ready(function(){
// $(document).on('click', '.quantity__button[name="plus"]', function (event) {
//       event.preventDefault();
//   var quantityInput = $(this).siblings('.quantity__input');
//     var newQuantity = $(quantityInput).val();
//   console.log(newQuantity);
//   updateCartQuantity(newQuantity, 1);
// });

// $(document).on('click', '.quantity__button[name="minus"]', function (event) {
//       event.preventDefault();
//   var quantityInput = $(this).siblings('.quantity__input');
//     var newQuantity = $(quantityInput).val();
//   console.log(newQuantity);
//   updateCartQuantity(newQuantity, -1);
// });


// function updateCartQuantity(newQuantity, change) {
//   // console.log("hello");
//     var variantId = $('.quantity__input').data("quantity-variant-id");
  
//   // var url = "/cart/change.js";
//   //   var data = {
//   //     id: variantId,
//   //     quantity: newQuantity,
//   //   };

//   var url = "/cart/update.js";
//     var data = {
//       updates: {},
//     };
//     // console.log(data);
//     data.updates[variantId] = newQuantity; 

//     $.ajax({
//       type: "POST",
//       dataType: "json",
//       url: url,
//       data: data,
//       success: function (response) {
//         window.location.href = "/cart";
//         // console.log("hello");
//       },
//       error: function (error) {
//         console.error("quantity is not updated:");
//       },
//     });
// }

//     $(document).on('click', '.button button--tertiary', function (event) {
//   event.preventDefault(); 
//       console.log("hello");
//    var variantId = $(this).closest('.cart-item__quantity-wrapper').find('.quantity__input').data('quantity-variant-id');
//        console.log(variantId);
//   removeProduct(variantId);
// });

//   function removeProduct(variantId) {
//     console.log("hello");

//   $.ajax({
//     type: 'POST',
//     dataType: 'json',
//     url: '/cart/change.js',
//     data: {
//       quantity: 0, 
//       id: variantId
//     },
//     success: function (response) {
//         window.location.href = "/cart";
//           console.log("sucess");
//     },
//     error: function (error) {
//       console.error('Error removing product from cart:', error);
//     }
//   });
// }
// });











// $(document).ready(function(){

//   console.log("hello");
//   $(".quantity__input").on("change", function (event) {
//     var newQuantity = $(this).val();
//     var variantId = $(this).data("quantity-variant-id");

//     // console.log(newQuantity);

//   var url = "/cart/change.js";
//     var data = {
//       id: variantId,
//       quantity: newQuantity,
//     };

//   // var url = "/cart/update.js";
//   //   var data = {
//   //     updates: {},
//   //   };
//   //   // console.log(data);
//   //   data.updates[variantId] = newQuantity; 

//     $.ajax({
//       type: "POST",
//       dataType: "json",
//       url: url,
//       data: data,
//       success: function (response) {
//         window.location.href = "/cart";
//         console.log("hello");
//       },
//       error: function (error) {
//         console.error("quantity is not updated:");
//       },
//     });
//      event.preventDefault();
//   });

//     $(document).on('click', '.remove-product', function (event) {
//   event.preventDefault(); 
//   // var variantId = $(this).closest('.cart-item__quantity-wrapper').find('.quantity__input').data('quantity-variant-id');
//   $.ajax({
//     type: 'POST',
//     url: '/cart/change.js',
//     data: {
//       quantity: 0, 
//       id: variantId
//     },
//     dataType: 'json',
//     success: function (cart) {
//     },
//     error: function (error) {
//       console.error('Error removing product from cart:', error);
//     }
//   });
// });
  
// });
