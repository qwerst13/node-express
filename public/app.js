const toCurrency = (price) => {
  return new Intl.NumberFormat("en-US", {
    currency: "usd",
    style: "currency",
  }).format(price);
};

const toDate = (date) => {
  console.log(date)
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}

document.querySelectorAll(".price").forEach((item) => {
  item.textContent = toCurrency(item.textContent);
});

document.querySelectorAll('.date').forEach((item) => {
  item.textContent = toDate(item.textContent);
});

const $cart = document.querySelector("#cart");
if ($cart) {
  $cart.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("js-remove")) {
      const id = evt.target.dataset.id;

      fetch("/cart/remove/" + id, {
        method: "delete",
      })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.courses.length) {
            const html = cart.courses
              .map((item) => {
                return `
                              <tr>
                                <td>${item.title}</td>
                                <td>${item.price}</td>
                                <td>${item.count}</td>
                                <td>
                                  <button class="btn btn-small js-remove material-icons" data-id="${item.id}">clear</button>
                                </td>
                              </tr>
                            `;
              })
              .join("");
            $cart.querySelector("tbody").innerHTML = html;

            $cart.querySelector(".price").textContent = toCurrency(
              cart.totalPrice
            );
          } else {
            $cart.innerHTML = "<p>Cart is empty</p>";
          }
        });
    }
  });
}

M.Tabs.init(document.querySelectorAll('.tabs'));