/** @format */

document.addEventListener('DOMContentLoaded', () => {
  showCategories();
  loadOrdersFromLocalStorage();
});

let orders = [];

document.getElementById('categories').addEventListener('click', (event) => {
  const categoryId = event.target.getAttribute('data-category');
  showProductsByCategory(categoryId);
});

document.getElementById('products').addEventListener('click', (event) => {
  const productId = event.target.getAttribute('data-product');
  const categoryId = event.target.getAttribute('data-category');

  showProductInfo(categoryId, productId);
});

document.getElementById('ordersButton').addEventListener('click', () => {
  document.getElementById('orderSummary').innerHTML = '';
  document.getElementById('wrapper').innerHTML = '';
  document.getElementById('backButton').style.display = 'block';
  showOrders(orders);
});

document.getElementById('backButton').addEventListener('click', function () {
  window.location.reload();
});
