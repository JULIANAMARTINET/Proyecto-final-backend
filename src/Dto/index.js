
export default class ProductoDto {
    constructor(producto) {
          this.id = producto.id;
          this.title = producto.title;
          this.description = producto.description;
          this.code = producto.code;
          this.thumbnail = producto.thumbnail;
          this.price = producto.price;
          this.stock = producto.stock;
    }
}