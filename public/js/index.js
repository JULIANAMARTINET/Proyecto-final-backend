export { API_ROUTES } from './routes.js'
export { utils } from './utils.js'

const renderProducts = async () => {
    const productsContainer = document.getElementById("productsContainer");

    const products = await API_ROUTES.getProducts();

    productsContainer.innerHTML = await utils.makeProductTable(products);
};

const getProductBtn = document.getElementById("getProductsBtn");

getProductBtn.addEventListener("click", renderProducts);

window.addEventListener("load", renderProducts);