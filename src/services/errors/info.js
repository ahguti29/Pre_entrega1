export const generateErrorInfo = product => {
    return `
    Uno o mas properties están incompletos o son inválidos.
    Lista de propiedades obligatorias:
        - title: Must be a string. (${product.title})
        - description: Must be a string. (${product.description})
        - codigo: Must be a string. (${product.codigo})
        - price: Must be a number.(${product.price})
        - thumbnail: Must be a string.(${product.thumbnail})
        - category: Must be a string. (${product.category})
        - status: Must be a string.(${product.status})
        - stock: Must be a number.(${product.stock})
    `
}

