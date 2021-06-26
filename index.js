const mainProductContainer = document.querySelector('#productMainContainer');
const mainLoaderContainer = document.querySelector('#mainLoaderContainer');
const mainContainer = document.querySelector('#mainContainer');
const loadButton = document.querySelector('#loadButton');

// err message
const errMessage = document.querySelector('#errorMessage');
// search input and button
const loadMoreContainer = document.querySelector('#loadMoreContainer');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
let loadedProductCount = 0;
let dataList = [];
// make container for product
function makeProductContainer(parent, productObject) {
  const productContainer = document.createElement('div');
  productContainer.classList.add('product');
  productContainer.innerHTML = ` <div class="product-flag">
  <img src="${productObject.flag}" alt="${
    productObject.name
  } flag" width="500px">

  <div class="product__name">
      <h2>${productObject.name}</h2>
  </div>
</div>
<div class="product-info">
  <ul class="product-info__list">
      <li>Capital: <span class="product-info__list-name">${
        productObject.capital.length === 0
          ? 'Does not exist'
          : productObject.capital
      }</span></li>
      <li>Population: <span class="product-info__list-name">${makeNumbDot(
        productObject.population
      )} people</span></li>
      <li>Area: <span class="product-info__list-name">${makeNumbDot(
        productObject.area
      )} km²</span></li>
      <li>Languages: <span class="product-info__list-name">${
        productObject.languages
      }</span></li>
  </ul>
</div>`;
  parent.appendChild(productContainer);
}

function getDataFromApi(url) {
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      res.forEach((product) => {
        //   filter data from product
        let productObject = {};
        productObject.name = product.name;
        productObject.flag = product.flag;
        productObject.capital = product.capital;
        productObject.population = product.population;
        productObject.area = product.area;
        productObject.languages = getLanguages(product.languages);
        dataList.push(productObject);
      });
      return dataList;
    })
    .then((dataList) => {
      dataList.forEach((data, index) => {
        if (index < 21) {
          makeProductContainer(mainProductContainer, data);
          loadedProductCount = index;
        }
      });
      return true;
    })
    .then((res) => {
      if (res === true) {
        setTimeout(() => {
          mainLoaderContainer.style.opacity = '0';
          mainContainer.style.display = 'block';
        }, 1000);

        setTimeout(() => {
          mainLoaderContainer.style.display = 'none';
          mainContainer.style.opacity = 1;
        }, 1650);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function loadMoreButtonEvent() {}

// make dotted number
function makeNumbDot(x) {
  return x
    ? x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    : "Doesn't exist";
}
// get languages list from api
function getLanguages(languageArray) {
  let languages = [];
  languageArray.forEach((lang) => {
    languages.push(lang.name);
  });
  return languages.join(', ');
}

window.addEventListener('load', () => {
  getDataFromApi('https://restcountries.eu/rest/v2/all');
});
loadButton.addEventListener('click', loadMore);

function loadMore(e) {
  dataList.forEach((product, index, arr) => {
    let end = loadedProductCount + 21;
    end ? end : arr[arr.length - 1];

    if (index > loadedProductCount && index <= end) {
      makeProductContainer(mainProductContainer, product);
    }
  });
  loadedProductCount += 21;
}

const searchFunction = (e) => {
  let sendValue = '';
  loadMoreContainer.innerText = '';
  let existCountry = false;
  if (e.key === 'Enter') {
    e.preventDefault();
    sendValue = e.target.value.trim().toLowerCase();
    mainProductContainer.textContent = '';
    dataList.forEach((product, index, arr) => {
      let productName = product.name.toLowerCase();
      //   console.log(productName);
      if (productName.startsWith(sendValue)) {
        existCountry = true;
        makeProductContainer(mainProductContainer, product);
      }
    });
    if (existCountry) {
      errMessage.style.opacity = 0;
      setTimeout(() => {
        errMessage.style.display = 'none';
      }, 550);
    }
    if (!existCountry) {
      errMessage.style.display = 'flex';
      setTimeout(() => {
        errMessage.style.opacity = 1;
      }, 0);
    }
  }
};

searchInput.addEventListener('keypress', searchFunction);
searchButton.addEventListener('click', () => {
  let sendValue = searchInput.value.trim().toLowerCase();
  loadMoreContainer.innerText = '';
  let existCountry = false;
  mainProductContainer.textContent = '';
  dataList.forEach((product, index, arr) => {
    let productName = product.name.toLowerCase();
    //   console.log(productName);
    if (productName.startsWith(sendValue)) {
      existCountry = true;
      makeProductContainer(mainProductContainer, product);
    }
  });
  if (existCountry) {
    errMessage.style.opacity = 0;
    setTimeout(() => {
      errMessage.style.display = 'none';
    }, 550);
  }
  if (!existCountry) {
    errMessage.style.display = 'flex';
    setTimeout(() => {
      errMessage.style.opacity = 1;
    }, 0);
  }
});
