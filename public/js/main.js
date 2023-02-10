
// // para usar import de modules acá en los static, tenemos que en el html, ponerle type="module" al script index.js

// const renderProducts = async () => {
//   return window.location.replace("/api/products");
// };

// const getProducts = document.getElementById("getProductsBtn");
// getProducts.onclick = renderProducts;
// // por supuesto podriamos cargar los productos cuando entremos a la página, usando el objeto window y con un event listener de tipo "load"
// // window.addEventListener("load", renderProducts);


// const logout = async () => {
//   await fetch("/api/auth/logout", { method: "POST" });

//   window.location.replace("/login");
// };

// const logoutBtn = document.getElementById("logoutBtn");

// logoutBtn.onclick = logout;
