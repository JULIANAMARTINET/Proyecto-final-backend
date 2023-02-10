const getProducts = async () => {
  try {
      const response = await fetch('/api/products')
      const products = await response.json()
      return products
  } catch (error) {
      console.log(`error from public/js/routes/getProducts`);
  }
}

export const API_ROUTES = {
  getProducts
}