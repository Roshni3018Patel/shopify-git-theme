$(document).ready(function() {
    var searchInput = $('.search__input');
    var predictiveSearchResults = $('#smart-search');
    var defaultproducts = $('.default-products');
    var smartSearchReasult = $('.smart-search-products');

    searchInput.on('keyup', function() {
        var searchTerm = $(this).val().trim();
        if (searchTerm.length > 0) {
           smartSearchProductDisplay(searchTerm);
        } else {
          defaultproductsDisplay();
        }
    });

    $('.modal__toggle-open').click(function(){
        defaultproducts.css("display", "blocks");
        defaultproductsDisplay();
     });           

   $('.reset__button').click(function() {
        console.log("reset");
        searchInput.val(''); 
     defaultproductsDisplay();
    });

    $('.icon-close').click(function() {
        console.log("reset");
        searchInput.val(''); 
    });

    $('#smart-products').on('click', '#smartSearchAddToCart', function() {
        console.log("add to cart");
        var productId = $(this).closest('.smart-search__list-item').data('product-id');
        var quantity = 1;
        $.ajax({
            url: '/cart/add.js',
            type: 'POST',
            dataType: 'json',
            data: {
                quantity: quantity,
                id: productId
            },
            success: function(response) {
                console.log(response);
               searchInput.val(''); 
                // window.location.href = '/cart';
              cartDrawerurl();
            },
            error: function(error) {
                console.log('Error adding item to cart:' + error);
            }
        });
    });
function smartSearchProductDisplay(searchTerm)
  {
     $.ajax({
                url: `/search/suggest?q=${searchTerm}&section_id=smart-search`,
                method: 'GET',
                success: function(response) {
                  console.log(response);
                    predictiveSearchResults.html(response);
                    defaultproducts.css("display", "none");
            
                },
                error: function(xhr, status, error) {
                    console.error(xhr.status);
                   defaultproducts.css("display", "blocks");
                }
            });
  }
  function defaultproductsDisplay() {
      $.ajax({
                url: '/collections/all/products.json',
                method: 'GET',
                success: function(response) {
                 console.log(response);
                    var products = response.products;
                    var productDetails = products.map(function(product) {
                      console.log(products);         
                       var productCard = `  
                    
                     <div id="smart-search-results" role="listbox">
                      <ul id="smart-search-results-products-list" class="smart-search__results-list list-unstyled" role="group" aria-labelledby="smart-search-products" >
                       <li class="smart-search__list-item" role="option" aria-selected="false" data-product-id="${product.variants[0].id}" >
                       <a href="products/${product.handle}" class="smart-search__item smart-search__item--link-with-thumbnail link link--text" tabindex="-1" >
                       <img class="smart-search__image" src="${product.images[0].src}" alt="${product.title}" width="50" >
                        <div class="smart-search__item-content">
                          <p class="smart-search__item-heading h5">${product.title}</p>
                          <p class="price">${product.variants[0].price}</p>
                         </div>
                       </a>
                       <i class="fa fa-shopping-cart" id="smartSearchAddToCart" style="font-size:24px"></i>
                      </li>
                      </ul>
                   </div>`;
                    return productCard;
                    });
                    defaultproducts.html(productDetails);
                       defaultproducts.css("display", "block");
                },
                error: function(xhr, status, error) {
                    console.log("AJAX Error:", error);
                      defaultproducts.css("display", "none");
                }
            });
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
});
 
