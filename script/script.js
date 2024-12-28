document.addEventListener("DOMContentLoaded", () => {
    const cartBtn = document.getElementById("cart-btn");
    const cartModal = document.getElementById("cart-modal");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeModalBtn = document.getElementById("close-model-btn");
    const cartCounter = document.getElementById("cart-count");
    const addressInput = document.getElementById("address");
    const addressWarn = document.getElementById("address-warn");
    const spanItem = document.getElementById("date-span");

    let cart = [];

    // Exibir ou esconder o modal do carrinho
    cartBtn.addEventListener("click", () => {
        updateCartModal();
        cartModal.style.display = "flex";
    });

    cartModal.addEventListener("click", (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = "none";
        }
    });

    closeModalBtn.addEventListener("click", () => {
        cartModal.style.display = "none";
    });

    // Adicionar itens ao carrinho
    menu.addEventListener("click", (event) => {
        const parentButton = event.target.closest(".add-to-cart-btn");
        if (parentButton) {
            const name = parentButton.getAttribute("data-name");
            const price = parseFloat(parentButton.getAttribute("data-price"));
            addToCart(name, price);
        }
    });

    function addToCart(name, price) {
        const existingItem = cart.find((item) => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartModal();
        updateCartCounter();
    }

    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }

    // Atualizar o conteúdo do modal do carrinho
    function updateCartModal() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item) => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

            cartItemElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <p>${item.name}</p>
                        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                        <p>Qtd: ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            `;

            total += item.price * item.quantity;
            cartItems.appendChild(cartItemElement);
        });

        cartTotal.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        cartCounter.innerHTML = cart.length;
    }

    // Remover itens do carrinho
    cartItems.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const name = event.target.getAttribute("data-name");
            removeItemCart(name);
        }
    });

    function removeItemCart(name) {
        const index = cart.findIndex((item) => item.name === name);
        if (index !== -1) {
            const item = cart[index];
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartModal();
            updateCartCounter();
        }
    }

    // Verificar se o endereço está preenchido
    addressInput.addEventListener("input", (event) => {
        if (event.target.value.trim() !== "") {
            addressInput.classList.remove("border-red-500");
            addressWarn.classList.add("hidden");
        }
    });

    // Finalizar pedido
    checkoutBtn.addEventListener("click", () => {
        console.log("Botão de finalização clicado");
    
        if (!checkRestaurantOpen()) {
            Toastify({
                text: "Ops, o restaurante está fechado!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` ou `bottom`
                position: "right", // `left`, `center` ou `right`
                stopOnFocus: true, // Impede que o toast seja fechado ao passar o mouse
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
            }).showToast();
            return;
        }
    
        if (cart.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }
    
        // Verificar a opção de entrega
        const deliveryOption = document.getElementById("delivery-option").value;
        const isPickupSelected = deliveryOption === "pickup"; // Verifica se "Retirar no estabelecimento" foi selecionado
        console.log("Retirar no estabelecimento selecionado:", isPickupSelected);
    
        // Se não for "Retirar no estabelecimento", verificar se o endereço foi preenchido
        if (!isPickupSelected && addressInput.value.trim() === "") {
            addressWarn.classList.remove("hidden");
            addressInput.classList.add("border-red-500");
            alert("Por favor, insira um endereço para entrega.");
            return;
        } else {
            // Se o endereço for fornecido ou for retirar no estabelecimento, limpar alertas
            addressWarn.classList.add("hidden");
            addressInput.classList.remove("border-red-500");
        }
    
        // Criar o resumo do carrinho
        const cartSummary = cart
            .map((item) => `${item.name} (Qtd: ${item.quantity}) - R$ ${item.price.toFixed(2)}`)
            .join("\n");
    
        // Incluir o endereço ou um aviso de "Retirar no estabelecimento"
        const addressMessage = isPickupSelected
            ? "Retirar no estabelecimento"
            : addressInput.value;
    
        const message = encodeURIComponent(
            `Pedido:\n${cartSummary}\nTotal: ${cartTotal.textContent}\nEndereço: ${addressMessage}`
        );
    
        const phone = "5585998096349"; // Verifique se o número está correto
        const url = `https://wa.me/${phone}?text=${message}`;
    
        console.log("URL gerada:", url);  // Verifique a URL gerada no console
    
        // Tentar abrir o WhatsApp diretamente no dispositivo
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS) {
            window.location.href = url; // Forçar abrir no WhatsApp diretamente
        } else {
            window.open(url, "_blank"); // Para outros dispositivos, abrir normalmente
        }
    
        // Limpar o carrinho após o pedido
        cart = [];
        updateCartModal();
    });
    

    // Verificar horário de funcionamento
    function checkRestaurantOpen() {
        const hour = new Date().getHours();
        return hour >= 12 && hour < 22;
    }

    // Atualizar status de funcionamento
    if (checkRestaurantOpen()) {
        spanItem.classList.remove("bg-red-500");
        spanItem.classList.add("bg-green-600");
    } else {
        spanItem.classList.remove("bg-green-600");
        spanItem.classList.add("bg-red-500");
    }
});
