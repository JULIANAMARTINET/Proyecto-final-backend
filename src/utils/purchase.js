const getPurchaseTemplate = (email, listado, total) => 
  `
     <h3>Pago realizado por el usuario ${email} </h3>
     <p> Detalle de compra:</p>
     <ul>
         ${listado}
     </ul>
     <p>Total $${total}<p>`;


export const TEMPLATE = { getPurchaseTemplate };
