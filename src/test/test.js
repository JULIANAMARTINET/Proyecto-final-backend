import { expect } from 'chai';
import request from 'supertest';
import winston, { format } from 'winston';
import { app } from '../index.js'

const logger = winston.createLogger({
      level: 'info',
      format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.json()
      ),
      transports: [
            new winston.transports.File({
                  filename: './test/testMochaChaiSupertest.log',
                  level: 'info',
            }),
      ],
});

describe('Products', () => {
      afterEach(function () {
            let result = {
                  duration: this.currentTest.duration,
                  state: this.currentTest.state,
                  title: this.currentTest.title,
            };

            logger.info(result);
      });
      let id;
      it('Deberia obtener todos los productos', async () => {
            const response = await request(app).get('/api/products');
            expect(response.statusCode).to.be.eq(200);
            expect(response.body).to.be.an('array');
      });
      it('Deberia Crear un producto', async () => {
            const response = await request(app).post('/api/products').send({
                title: 'Prueba',
                code: '22222',
                thumbnail: 'https://detallesorballo.com/wp-content/uploads/2020/09/imagen-de-prueba-320x240-1.jpg',
                price: 2000,
                stock: 3,
            });
            id = response.body.id;
            expect(response.statusCode).to.be.eq(201);
            expect(response.body).to.have.property('title');
            expect(response.body).to.have.property('code');
            expect(response.body).to.have.property('stock');
            expect(response.body).to.have.property('price');
            expect(response.body).to.have.property('thumbnail');
            expect(response.body.id).to.be.eq(id);
      });

      it('Deberia obtener por id un  producto', async () => {
            await request(app).get(`/api/products/${id}`);
      });
      it('Deberia Eliminar un producto', async () => {
            await request(app).delete(`/api/products/${id}`);
      });
});
