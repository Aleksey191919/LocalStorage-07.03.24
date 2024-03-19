/** @format */

function showCategories() {
  const parent = document.getElementById('categories');

  data.forEach((category) => {
    const myCategoryElement = document.createElement('div');
    myCategoryElement.textContent = category.name;
    myCategoryElement.setAttribute('data-category', category.key);

    parent.appendChild(myCategoryElement);
  });
}

function showProductsByCategory(categoryId) {
  const selectedCategory = data.find((category) => category.key === categoryId);

  const parent = document.getElementById('products');
  parent.innerHTML = '';

  selectedCategory.products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.textContent = product.name;
    productElement.setAttribute('data-product', product.id);
    productElement.setAttribute('data-category', categoryId);

    parent.appendChild(productElement);
  });
}

function showProductInfo(categoryId, productId) {
  const selectedCategory = data.find((category) => category.key === categoryId);
  const selectedProduct = selectedCategory.products.find(
    (product) => product.id == productId
  );

  const parent = document.getElementById('product');
  parent.innerHTML = `
    <h2>${selectedProduct.name}</h2>
    <p>Price: $${selectedProduct.price}</p>
    <p>${selectedProduct.description}</p>
  `;

  const buyButton = document.createElement('input');
  buyButton.setAttribute('type', 'button');
  buyButton.setAttribute('value', 'Купить');
  buyButton.addEventListener('click', function () {
    showOrderForm(selectedProduct);
    clearUserData();
  });

  parent.appendChild(buyButton);
}

function clearUserData() {
  document.getElementById('products').innerHTML = '';
  document.getElementById('product').innerHTML = '';
}

function showOrderForm(product) {
  const formHtml = `
      <form id="orderFormContent">
        <h3>Форма заказа</h3>
        <p>Товар: ${product.name} - Цена: $${product.price}</p>
        <p><input type="text" name="name" placeholder="Ваше имя" value="Aleks"/><span class="error error-name"></span></p>
        <p><input type="text" name="lastName" placeholder="Ваша фамилия" value="Greb" /><span class="error error-lastname"></span></p>
        <p><input type="text" name="surname" placeholder="Ваше отчество" value="Serg" /><span class="error error-surname"></span></p>
        <p>
          <select name="city">
            <option value="">--Выберите город--</option>
            <option value="Kiev">Киев</option>
            <option value="Kharkov">Харьков</option>
            <option value="Odessa">Одесса</option>
          </select>
          <span class="error error-city"></span>
        </p>
        <p>
          <select name="newPost">
            <option value="">--Новой почта № --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <span class="error error-post"></span>
        </p>
        <p><input type="radio" checked name="paymentMethod" value="Card" />Банковская карта</p>
        <p><input type="radio" name="paymentMethod" value="paymentCOD" />Наложенный платеж</p>
        <p>Количество</p>
        <p><input type="number" id="quantity" name="quantity" min="1" value="1">
        <span class="error error-message"></span></p>
        <p>Комментарий к заказу</p>
        <p><textarea id="comment" name="comment"></textarea></p>
        <p><input type="button" id="orderbtn" value="Оформить заказ"></p>
      </form>
    `;

  const orderFormDiv = document.getElementById('orderForm');
  orderFormDiv.innerHTML = formHtml;
  orderFormDiv.style.display = 'block';

  document.getElementById('orderbtn').addEventListener('click', function () {
    const form = document.forms.orderFormContent;
    const userData = {
      name: form.name.value,
      lastName: form.lastName.value,
      surname: form.surname.value,
      city: form.city.value,
      newPostOffice: form.newPost.value,
      paymentMethod: form.paymentMethod.value,
      quantity: form.quantity.value,
      userComment: form.comment.value,
    };

    const isFormValid = validateForm(userData);

    if (isFormValid) {
      const currentDate = new Date();
      const monthNumber = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      const formattedDate = monthNumber + '/' + day + '/' + year;

      const orderData = {
        name: userData.name,
        lastName: userData.lastName,
        surname: userData.surname,
        city: userData.city,
        newPostOffice: userData.newPostOffice,
        paymentMethod: userData.paymentMethod,
        quantity: userData.quantity,
        userComment: userData.userComment,
        product: product.name,
        id: createOrderId(product, userData),
        date: formattedDate,
      };

      orderFormDiv.style.display = 'none';
      orderFormDiv.innerHTML = '';
      orders.push(orderData);
      const order = createTable(orderData);
      const orderSummaryDiv = document.getElementById('orderSummary');
      orderSummaryDiv.appendChild(order);
      saveOrdersToLocalStorage(orders);
    }
  });
}

function createTable(userData) {
  const table = document.createElement('table');
  for (const key in userData) {
    if (userData[key] !== '' && userData[key] !== 'undefined') {
      const tr = document.createElement('tr');
      const tdKey = document.createElement('td');
      tdKey.textContent = key;
      tr.appendChild(tdKey);
      const tdValue = document.createElement('td');
      tdValue.textContent = userData[key];
      tr.appendChild(tdValue);
      table.appendChild(tr);
    }
  }
  return table;
}

function validateForm(userData) {
  let isFormValid = true;

  if (!userData.name.trim()) {
    document.querySelector('.error-name').innerHTML =
      'Пожалуйста введите ваше имя!';
    document.forms.orderFormContent.name.classList.add('input-error');
    isFormValid = false;
  } else {
    document.querySelector('.error-name').innerHTML = '';
    document.forms.orderFormContent.name.classList.remove('input-error');
  }

  if (!userData.lastName.trim()) {
    document.querySelector('.error-lastname').innerHTML =
      'Пожалуйста введите вашу фамилию!';
    document.forms.orderFormContent.lastName.classList.add('input-error');
    isFormValid = false;
  } else {
    document.querySelector('.error-lastname').innerHTML = '';
    document.forms.orderFormContent.lastName.classList.remove('input-error');
  }

  if (!userData.surname.trim()) {
    document.querySelector('.error-surname').innerHTML =
      'Пожалуйста введите ваше отчество!';
    document.forms.orderFormContent.surname.classList.add('input-error');
    isFormValid = false;
  } else {
    document.querySelector('.error-surname').innerHTML = '';
    document.forms.orderFormContent.surname.classList.remove('input-error');
  }

  if (!userData.city) {
    document.querySelector('.error-city').innerHTML =
      'Пожалуйста выберите ваш город!';
    document.forms.orderFormContent.city.classList.add('input-error');
    isFormValid = false;
  } else {
    document.querySelector('.error-city').innerHTML = '';
    document.forms.orderFormContent.city.classList.remove('input-error');
  }

  if (!userData.newPostOffice) {
    document.querySelector('.error-post').innerHTML =
      'Пожалуйста выберите номер отделения!';
    document.forms.orderFormContent.newPost.classList.add('input-error');
    isFormValid = false;
  } else {
    document.querySelector('.error-post').innerHTML = '';
    document.forms.orderFormContent.newPost.classList.remove('input-error');
  }

  return isFormValid;
}

function saveOrdersToLocalStorage(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function loadOrdersFromLocalStorage() {
  const storedOrders = localStorage.getItem('orders');
  if (storedOrders) {
    orders = JSON.parse(storedOrders);
  } else {
    orders = [];
  }
}

function createOrderId(product, userData) {
  let orderId;
  if (orders.length === 0) {
    orderId = 1;
  } else {
    const maxId = Math.max(...orders.map((order) => order.id));
    orderId = maxId + 1;
  }

  return orderId;
}

function showOrders(orders) {
  const orderList = document.getElementById('order-list');

  if (orders.length >= 1) {
    orders.forEach((order) => {
      const div = document.createElement('div');
      div.setAttribute('data-orderID', order.id);

      const orderInfo = document.createElement('p');
      orderInfo.textContent = `${order.date} - ${order.product}`;
      div.appendChild(orderInfo);

      const detailsButton = document.createElement('button');
      detailsButton.textContent = 'Подробнее';
      detailsButton.addEventListener('click', () => {
        showOrderDetails(order);
      });
      div.appendChild(detailsButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Удалить';
      deleteButton.addEventListener('click', () => {
        deleteOrder(order.id);
        div.remove();
      });
      div.appendChild(deleteButton);

      orderList.appendChild(div);
    });
  } else {
    alert('Вы еще не делали заказов!');
  }
}

function showOrderDetails(order) {``
  const div = document.createElement('div');

  div.innerHTML = `
    <p>Номер заказа: ${order.id}</p>
    <p>Имя: ${order.name}</p>
    <p>Фамилия: ${order.lastName}</p>
    <p>Отчество: ${order.surname}</p>
    <p>Город: ${order.city}</p>
    <p>Отделение Новой Почты: ${order.newPostOffice}</p>
    <p>Метод оплаты: ${order.paymentMethod}</p>
    <p>Количество: ${order.quantity}</p>
    <p>Комментарий: ${order.userComment}</p>
    <p>Товар: ${order.product}</p>
  `;

  document.getElementById('order-details').appendChild(div);
}

function deleteOrder(orderID) {
  const orderIndex = orders.findIndex((order) => order.id === orderID);

  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);
    saveOrdersToLocalStorage(orders);
  }
}

function clearOrders() {
  const orderList = document.getElementById('order-list');
  orderList.innerHTML = '';
  showOrders(orders);
}
