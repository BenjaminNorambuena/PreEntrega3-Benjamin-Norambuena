const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', async () => {
    try {
        containerCartProducts.classList.toggle('hidden-cart');
        const response = await fetch("");
        const data = await response.json();
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');
let allProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

productsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exists = allProducts.some(
            (product) => product.title === infoProduct.title
        );

        const isActive = true;  // Cambia esto según tu lógica real

        if (exists && isActive) {
            allProducts = allProducts.map((p) =>
                p.title === infoProduct.title
                    ? { ...p, quantity: p.quantity + 1 }
                    : p
            );
        } else if (!exists || !isActive) {
            allProducts = [...allProducts, infoProduct];
        }

        // Guardar la lista actualizada en el almacenamiento local
        localStorage.setItem('cartProducts', JSON.stringify(allProducts));

        showHTML();
    }
});

rowProduct.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter(
            (product) => product.title !== title
        );

        // Actualizar el almacenamiento local después de remover un producto
        localStorage.setItem('cartProducts', JSON.stringify(allProducts));

        showHTML();
    }
});

const showHTML = () => {
    const hasProducts = allProducts.length > 0;

    cartEmpty.classList.toggle('hidden', hasProducts);
    rowProduct.classList.toggle('hidden', hasProducts ? false : true);
    cartTotal.classList.toggle('hidden', !hasProducts);

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach((product) => {
        const { quantity, title, price } = product;
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${quantity}</span>
                <p class="titulo-producto-carrito">${title}</p>
                <span class="precio-producto-carrito">${price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total += parseFloat(quantity * price.slice(1));
        totalOfProducts += quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};