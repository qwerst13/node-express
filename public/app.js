document.querySelectorAll('.price').forEach((item) => {
    item.textContent = new Intl.NumberFormat('en-US', {
        currency: 'usd',
        style: 'currency'
    }).format(item.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
    $cart.addEventListener('click', evt => {
        if (evt.target.classList.contains('js-remove')) {
            const id = evt.target.dataset.id;
            fetch('/cart/remove/'+id, {
                method: 'delete'
            }).then((res) => res.json())
                .then((cart) => {
                    console.log(cart);
                })
        }
    })
}