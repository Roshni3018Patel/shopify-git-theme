// function loadMoreProducts() {
//     var container = document.getElementById('product-container');
//     // console.log(container);
//     var loadMoreBtn = document.getElementById('load-more-btn');
//     var productsToShow = 6;
//     var currentProducts = container.querySelectorAll('.product-item').length;
//      let mydata = document.getElementById("productItem") 
//      let text = mydata.getAttribute("data-nexturl");
//     console.log('AJAX URL:', text);
//     fetch(text)
//       .then(response => response.text())
//       .then(data => {
//         var tempContainer = document.createElement('div');
//         tempContainer.innerHTML = data;
//  console.log(data);
//         container.innerHTML += tempContainer.querySelector('.product-grid').innerHTML;
//         if (currentProducts + productsToShow >= tempContainer.querySelectorAll('.product-item').length) {
//           loadMoreBtn.style.display = 'none';
//         }
//       })
//       .catch(error => console.error('Error fetching products:', error));
//   }



<script>
  function loadMoreProducts() {
    var container = document.getElementById('product-container');
    var loadMoreBtn = document.getElementById('load-more-btn');
    var productsToShow = 6;
    var currentProducts = container.querySelectorAll('.product-item').length;
    var lastProduct = container.querySelector('.product-item:last-child');

    // Check if there's a last product before attempting to get its data
    if (lastProduct) {
      var collectionHandle = lastProduct.getAttribute('data-collection');
      var lastProductId = lastProduct.querySelector('a').getAttribute('href').split('/').pop();
      var nextUrl = '/collections/' + collectionHandle + '/products/' + lastProductId + '?view=ajax';

      fetch(nextUrl)
        .then(response => response.text())
        .then(data => {
          console.log('Fetched Data:', data);  // Log the fetched data to the console

          // Assuming the product grid is directly within the fetched data
          container.innerHTML += data;

          if (currentProducts + productsToShow >= container.querySelectorAll('.product-item').length) {
            loadMoreBtn.style.display = 'none';
          }
        })
        .catch(error => console.error('Error fetching products:', error));
    }
  }
</script>




 console.log("hello");
     function loadMoreProducts() {
       var container = document.getElementById('product-container');
       // console.log(container);
       var loadMoreBtn = document.getElementById('load-more-btn');
       var productsToShow = 6;
       var currentProducts = container.querySelectorAll('.product-item').length;
        let text = document.getElementById("productItem").getAttribute("data-nexturl");

       console.log('AJAX URL:', text);
       fetch(text)
         .then(response => response.text())
         .then(data => {
           var tempContainer = document.createElement('div');
           tempContainer.innerHTML = data;
    console.log(data);
           container.innerHTML += tempContainer.querySelector('.product-grid').innerHTML;
           if (currentProducts + productsToShow >= tempContainer.querySelectorAll('.product-item').length) {
             loadMoreBtn.style.display = 'none';
           }
         })
         .catch(error => console.error('Error fetching products:', error));
     }


//  function loadMoreProducts() {

//       var productContainer = document.getElementById('product-container');
//    var loadMoreBtn = document.getElementById('load-more-btn');
//     var productsToShow = 6;
//     var currentProducts = productContainer.querySelectorAll('.product-item').length;
//     var collectionId = '{{ section.settings.collection.id }}';
//    const mydata = document.getElementById("productItem") 
// let text = mydata.getAttribute("data-nexturl");
//     var ajaxURL = '/collections/' + collectionId + '/products.json?limit=' + productsToShow + '&offset=' + currentProducts;

//     console.log(text);

//       for (let i = 1; i <= currentProducts; i++) {
        
//         var productItem = document.createElement('div');
//         productItem.className = 'product-item';

//         let myProductName = document.getElementById('product-container').getElementsByTagName('h3')[i].innerHTML;     
//           let myProductPrice = document.getElementById('product-container').getElementsByTagName('p')[i].innerHTML;
//          var productImgSrc = document.getElementById('product-container').getElementsByTagName('img')[i].src;
   
//         // console.log(product);

//         let productImage = document.createElement('img');
//         productImage.className = 'product-img';
//         productImage.src = productImgSrc;
//         productImage.alt = `Product ${i}`;

//         let productInfo = document.createElement('div');
//         productInfo.className = 'product-info';

//         const productName = document.createElement('h3');
//         productName.textContent = myProductName;

//         let productPrice = document.createElement('p');
//         productPrice.textContent = myProductPrice;

//         productInfo.appendChild(productName);
//         productInfo.appendChild(productPrice);

//         productItem.appendChild(productImage);
//         productItem.appendChild(productInfo);

//         productContainer.appendChild(productItem);

        //   if (currentProducts + productsToShow >= productContainer.querySelectorAll('.product-item').length) {
        //   loadMoreBtn.style.display = 'none';
        // }
    //   }
    // }

  
<script>
  function loadMoreProducts() {
    var container = document.getElementById('product-container');
    var productsToShow = 6;

    // Clone the existing product items and append them to the container
    var existingProducts = document.querySelectorAll('.product-item');
    for (var i = 0; i < productsToShow; i++) {
      var clone = existingProducts[i].cloneNode(true);
      container.appendChild(clone);
    }
  }
</script>


  //     var products_on_page = document.querySelector('.products-onpage');
  // var next_url = products_on_page.data('next-url');

  // var load_more_btn = document.querySelector('.load-more_btn');
  // var load_more_spinner = document.querySelector('.load-more_spinner');


  // function loadMoreProducts() {
  //   $.ajax({
  //     url:next_url,
  //     type:'GET',
  //     dataType:'html',
  //     beforeSend: function () {
  //       load_more_btn.hide();
  //       load_more_spinner.show();
  //     }
  //   }).done(function(next_page){
  //     load_more_spinner.hide();
  //     var new_products = document.querySelector(next_page).find('.products-onpage');
  //     var new_url = new_products.data('next-url');

  //     if(new_url){
  //       load_more_btn.show();
  //     }
  //     next_url = new_url;
  //     products_on_page.append(new_products.html());
  // }