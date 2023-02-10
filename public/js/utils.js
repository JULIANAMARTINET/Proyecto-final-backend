const makeProductTable = async (products) => {
    const archivoTemplate = await fetch("views/products-table.hbs");
    const templateText = await archivoTemplate.text();
    const templateCompiled = Handlebars.compile(templateText);
    return templateCompiled({ products });
};


export const utils = {
    makeProductTable,
};