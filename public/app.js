document.querySelectorAll('.price').forEach((item) => {
    item.textContent = new Intl.NumberFormat('en-US', {
        currency: 'usd',
        style: 'currency'
    }).format(item.textContent);
})