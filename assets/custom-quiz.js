$(document).ready(function() {
    let backButton = $('.back-btn');
    let nextButton = $('.next-btn');
    let submitButton = $('.submit-btn');
    let currentQuestionIndex = 0;
    let totalQuestions = $('.question-form').length;
    let userAnswers = [];
    let messageContainer = $('#messageContainer');  

    function setUserAnswersCookie() {
        document.cookie = "userAnswers=" + JSON.stringify(userAnswers) + "; path=/";
    }

    function getUserAnswersFromCookie() {
        var name = "userAnswers=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArray = decodedCookie.split(';');
        for(var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return JSON.parse(cookie.substring(name.length, cookie.length));
            }
        }
        return null;
    }

    $('.question-form').hide();
    $('.submit-btn').hide();
    $('.question-form:first').show();
    backButton.hide();

    $(nextButton).on('click', function() {
        var currentForm = $('.question-form:visible');
        var checkedAnswer = currentForm.find(".quizOptions:checked").val();
        // console.log(checkedAnswer);
        if (checkedAnswer) {
            messageContainer.hide();
            let nextForm = currentForm.next('.question-form');
            currentForm.hide();
              let options = nextForm.find('.quizOpt');

            if (nextForm.length > 0) {
                nextForm.show();
                currentQuestionIndex++;
                backButton.show();
                userAnswers[currentQuestionIndex - 1] = checkedAnswer.trim();
                console.log(userAnswers);
                handleOptionsDisplay(userAnswers[currentQuestionIndex - 1], nextForm);
                if (currentQuestionIndex === totalQuestions - 1) {
                    nextButton.hide();
                    submitButton.show(); 
                }
            } else {
                nextButton.hide();
                submitButton.show();
                userAnswers[currentQuestionIndex] = checkedAnswer.trim();
                currentQuestionIndex++;
                console.log(userAnswers);
            }
            setUserAnswersCookie(); 
        } else {
            messageContainer.show();
        }      
    });

    $(backButton).on('click', function() {
        let currentForm = $('.question-form:visible');
        let prevForm = currentForm.prev('.question-form');
        currentForm.hide();
        if (prevForm.length > 0) {
            prevForm.show();
            currentQuestionIndex--;  
        }
        if (currentQuestionIndex <= 0) {
            backButton.hide();
        } else {
            backButton.show();
        }
        submitButton.hide();
        nextButton.show();
        messageContainer.hide();
        setUserAnswersCookie();
    });
  
     function handleOptionsDisplay(previousAnswer, form) {
        let options = form.find('.quizOpt');
        console.log(previousAnswer);
        options.each(function (index, element) {
            let option = $(element);
            var optionText = option.text().trim();
            let hideOption = false;
            if (previousAnswer) {
                hideOption = !optionText.includes(previousAnswer);
            }
            if (!hideOption) {
                let optionValue = optionText.split('/')[1].trim();
                option.html(`<div id="optionsQuiz"><input type="radio" name="forRadio" class="quizOptions"  value="${optionValue}">${optionValue}</div>`);
                option.show();
                $("br").remove();
            }
          else{
             option.hide();
            }            
        });
    }

    $(submitButton).on('click', function() {
        submitQuiz();
        setUserAnswersCookie();
    });

    function submitQuiz() {
        console.log("User's Answers:", userAnswers);
        let currentForm = $('.question-form:visible');
        let checkedAnswer = currentForm.find(".quizOptions:checked").val();
        userAnswers[currentQuestionIndex] = checkedAnswer;
        var productHandle = userAnswers[2].toLowerCase().split(' ').join('-');
        var productColor = userAnswers[3].trim();
        displayProducts(userAnswers, productHandle, productColor);
        $('.quiz-container').hide();
    }

    $('.products').on('click', '#addToCartQuiz', function () {
      console.log("add to cart");
       var variantId = $(this).closest('.product-card').find('.product-variant').data('variant-id');
      console.log(variantId);
        var quantity = 1;
      console.log(quantity);

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
            },
            error: function (error) {
                console.error('Error adding item to cart:', error);
            }
        });
    });
      function displayProducts(userAnswers, productHandle, productColor) {
        fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
            .then((response) => response.json())
            .then((product) => {
              console.log(product);
                var productOptions = product.variants;
                var displayedProducts = new Set(); 
                var productCards = ""; 
                for (let i = 0; i < productOptions.length; i++) {
                    let variant = productOptions[i];
                    if (variant.option1 == productColor && !displayedProducts.has(variant.id)) {
                        var variantPrice = (variant.price / 100).toFixed(2);
                        var variantImage = variant.featured_image.src;
                        var defaultVariant = product.options.length === 1;
                      var variantOption;
                      var availableVariant = variant.available;
                      if(defaultVariant){
                        variantOption = null;
                      }else {
                         variantOption = product.options[1].name + ": " + variant.option2;
                      }
                        productCards += `
                            <div class="product-card" data-product-handle="${product.handle}" data-product-id="${variant.id}">
                                <a href="${product.url}" class="Products">
                                    <img src="${variantImage}" alt="${product.title}" width="200" height="200">
                                    <h3 class="product-title">${product.title}</h3>
                                    <p class="product-price">${variantPrice}</p>
                                    <div class="variant" ${defaultVariant ? 'style="display: none;"' : ''}>
                                    <P class="product-variant" data-variant-id="${variant.id}">${variantOption}</p>
                                    </div>
                                </a>
                                <i class="fa fa-shopping-cart" id="addToCartQuiz" style="font-size:24px" ${!availableVariant ? 'style="cursor: none;"' : 'style="cursor: pointer;"'}>${!availableVariant ? 'Sold Out' : ''}</i>
                                <p class="message"><p>
                            </div>`;
                        displayedProducts.add(variant.id);
                    }
                }
                $('.products').empty().append(productCards);
            });
    }
    var storedUserAnswers = getUserAnswersFromCookie();
    if (storedUserAnswers !== null) {
        userAnswers = storedUserAnswers;
        console.log("User's Answers from Cookie:", userAnswers);
    }
});




    // let optionData;
    //       let data = optionText.includes('/');
    //       let optionDisplay = option.css("display");
    //       var optionDataValue;
    // if(data === false && optionDisplay === 'inline-block')
    //           {
    //             optionData = previousAnswer.concat('/', optionText);
    //              optionDataValue = optionData;
    //             console.log("Display" + optionDataValue);
    //            }
    //           else{
    //             optionDataValue = optionText;
    //           }
    //             console.log(optionDataValue);




//   function handleOptionsDisplay(previousAnswer, currentAnswer, form) {
//     let options = form.find('.quizOpt');
//     options.hide();

//     if (currentAnswer) {
//         let currentAnswerValue = currentAnswer.toLowerCase().trim();
//         options.each(function (index, element) {
//             let option = $(element);
//             let optionText = option.text().trim();
//             let optionValue = optionText.split('/')[1].trim();
            
//             if (optionValue.toLowerCase().trim() === currentAnswerValue || 
//                 (!previousAnswer && !currentAnswer)) {
//                 option.html(`<div id="optionsQuiz"><input type="radio" name="forRadio" class="quizOptions"  value="${optionValue}" checked>${optionValue}</div>`);
//                 option.show();
//                 $("br").remove();
//             }
//         });
//     }
// }


  


//  $(document).ready(function() {
//     let backButton = $('.back-btn');
//     let nextButton = $('.next-btn');
//     let submitButton = $('.submit-btn');
//     let currentQuestionIndex = 0;
//     let totalQuestions = $('.question-form').length;
//     let userAnswers = [];
//     let messageContainer = $('#messageContainer');

//     $('.question-form').hide();
//     $('.submit-btn').hide();
//     $('.question-form:first').show();
//     backButton.hide();

//     $(nextButton).on('click', function() {
//         var currentForm = $('.question-form:visible');
//         var checkedAnswer = currentForm.find(".quizOptions:checked").val();
//       console.log(checkedAnswer);
//         if (checkedAnswer) {
//             messageContainer.hide();
//             let nextForm = currentForm.next('.question-form');
//             currentForm.hide();
//               $('.question-form').find('.quizOpt').show();
//               console.log('hide');

//             if (nextForm.length > 0) {
//                 nextForm.show();
//                 currentQuestionIndex++;
//                 backButton.show();
//                 userAnswers[currentQuestionIndex - 1] = checkedAnswer.trim();
//                 console.log(userAnswers);
//                 handleOptionsDisplay(userAnswers[currentQuestionIndex - 1], nextForm, checkedAnswer.trim());

//                 if (currentQuestionIndex === totalQuestions - 1) {
//                     nextButton.hide();
//                     submitButton.show(); 
//                 }
//             } else {
//                 nextButton.hide();
//                 submitButton.show();
//                 userAnswers[currentQuestionIndex] = checkedAnswer.trim();
//                 currentQuestionIndex++;
//                 console.log(userAnswers);
              
//             }
//         } else {
//             messageContainer.show();
//         }
//     });


// function handleOptionsDisplay(previousAnswer, form, checkedAnswer) {
//     let options = form.find('.quizOpt');
//     options.hide(); 
//     // let checkOption = checkedAnswer.toLowerCase().trim();
//     options.each(function (index, element) {
//         let option = $(element);
//         let optionText = option.text().trim();
//         let hideOption = false;
//         if (previousAnswer) {
//             hideOption = !optionText.includes(previousAnswer);
//         }
//         if (!hideOption) {
//             let optionValue = optionText.split('/')[1].trim();
//             option.html(`<div id="optionsQuiz"><input type="radio" name="forRadio" class="quizOptions"  value="${optionValue}">${optionValue}</div>`);
//             option.show();
//            $("br").remove();
//         }
//     });
// }

//     $(backButton).on('click', function() {
//         var currentForm = $('.question-form:visible');
//         let prevForm = currentForm.prev('.question-form');
//         currentForm.hide();
//         var checkedAnswer = currentForm.find(".quizOptions:checked").val();
//       console.log(prevForm);
//         if (prevForm.length > 0) {
//             prevForm.show();
//             currentQuestionIndex--;        
//         }
//         if (currentQuestionIndex <= 0) {
//             backButton.hide();
//         } else {
//             backButton.show();  
//         }
//         submitButton.hide();
//         nextButton.show();
//         messageContainer.hide();
//     });

//     $(submitButton).on('click', function() {
//         submitQuiz();
//     });

//     function submitQuiz() {
//         console.log("User's Answers:", userAnswers);
//         let currentForm = $('.question-form:visible');
//         let checkedAnswer = currentForm.find(".quizOptions:checked").val();
//         userAnswers[currentQuestionIndex] = checkedAnswer;
//         var productHandle = userAnswers[2].toLowerCase().split(' ').join('-');
//         var productColor = userAnswers[3].trim();
//         displayProducts(userAnswers, productHandle, productColor);
//         $('.quiz-container').hide();
//     }

//     function displayProducts(userAnswers, productHandle, productColor) {
//         fetch(window.Shopify.routes.root + 'products/' + productHandle + '.js')
//             .then((response) => response.json())
//             .then((product) => {
//               console.log(product);
//                 var productOptions = product.variants;
//                 var displayedProducts = new Set(); 
//                 var productCards = ""; 
//                 for (let i = 0; i < productOptions.length; i++) {
//                     let variant = productOptions[i];
//                     if (variant.option1 == productColor && !displayedProducts.has(variant.id)) {
//                         var variantPrice = (variant.price / 100).toFixed(2);
//                         var variantImage = variant.featured_image.src;
//                         var defaultVariant = product.options.length === 1;
//                       var variantOption;
//                       if(defaultVariant){
//                         variantOption = null;
//                       }else {
//                          variantOption = product.options[1].name + ": " + variant.option2;
//                       }
//                         productCards += `
//                             <div class="product-card" data-product-handle="${product.handle}" data-product-id="${variant.id}">
//                                 <a href="${product.url}" class="Products">
//                                     <img src="${variantImage}" alt="${product.title}" width="200" height="200">
//                                     <h3 class="product-title">${product.title}</h3>
//                                     <p class="product-price">${variantPrice}</p>
//                                     <div class="variant" ${defaultVariant ? 'style="display: none;"' : ''}>
//                                     <P class="product-variant" data-variant-id="${variant.id}">${variantOption}</p>
//                                     </div>
//                                 </a>
//                                 <i class="fa fa-shopping-cart" id="addToCartQuiz" style="font-size:24px"></i>
//                             </div>`;
//                         displayedProducts.add(variant.id);
//                     }
//                 }
//                 $('.products').empty().append(productCards);
//             });
//     }

//     $('.products').on('click', '#addToCartQuiz', function () {
//       console.log("add to cart");
//        var variantId = $(this).closest('.product-card').find('.product-variant').data('variant-id');
//       console.log(variantId);
//         var quantity = 1;
//       console.log(quantity);

//         $.ajax({
//             url: '/cart/add.js',
//             type: 'POST',
//             dataType: 'json',
//             data: {
//                 quantity: quantity,
//                 id: variantId
//             },
//             success: function (response) {
//                 window.location.href = '/cart';
//             },
//             error: function (error) {
//                 console.error('Error adding item to cart:', error);
//             }
//         });
//     });
//   });