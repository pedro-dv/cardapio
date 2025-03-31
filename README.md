# Projeto de Carrinho de Compras Online

Este é um projeto simples de um carrinho de compras online desenvolvido em HTML, CSS e JavaScript. Ele permite adicionar itens ao carrinho, visualizar os produtos selecionados e finalizar o pedido enviando as informações via WhatsApp.


![Screenshot 2025-03-31 at 19-40-17 Cardapio Online](https://github.com/user-attachments/assets/4ac9ac1e-7656-414c-9b75-f24909d872c7)


## Recursos do Projeto

- **Adicionar itens ao carrinho**: Os produtos disponíveis no menu podem ser adicionados ao carrinho com um clique.
- **Atualização de quantidade**: Se o mesmo item for adicionado novamente, a quantidade é automaticamente atualizada.
- **Remover itens do carrinho**: Os usuários podem remover itens individualmente ou ajustar as quantidades.
- **Cálculo do total**: O valor total do carrinho é atualizado automaticamente.
- **Finalizar pedido**: O pedido pode ser enviado diretamente para o WhatsApp com um resumo dos itens e o endereço do cliente.
- **Verificação de horário**: O sistema verifica se o restaurante está aberto (entre 18h e 22h).
- **Interface interativa**: Um modal apresenta os itens do carrinho de forma clara e responsiva.

## Tecnologias Utilizadas

- **HTML**: Estrutura da página.
- **Tailwind CSS**: Estilização e responsividade.
- **JavaScript**: Funcionalidade do carrinho de compras.

## Estrutura do Projeto

```
projeto-carrinho/
├── index.html          # Página principal
├── style.css           # Estilos CSS
├── script.js           # Lógica do carrinho
└── README.md           # Documentação do projeto
```

## Funcionalidades Principais

### 1. Adicionar ao Carrinho

Cada item do menu possui um botão para ser adicionado ao carrinho. O script gerencia a adição e atualização das quantidades automaticamente:

```javascript
function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartModal();
}
```

### 2. Remover do Carrinho

Os itens podem ser removidos ou suas quantidades ajustadas:

```javascript
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
    }
}
```

### 3. Finalizar Pedido

![Screenshot 2025-03-31 at 19-41-07 Cardapio Online](https://github.com/user-attachments/assets/62db05cb-ce8d-4a1b-8002-57438a7d391c)


O resumo do pedido é gerado e enviado para o WhatsApp:

```javascript
checkoutBtn.addEventListener("click", () => {
    const cartSummary = cart
        .map((item) => `${item.name} (Qtd: ${item.quantity}) - R$ ${item.price.toFixed(2)}`)
        .join("\n");

    const message = encodeURIComponent(
        `Pedido:\n${cartSummary}\nTotal: ${cartTotal.textContent}\nEndereço: ${addressInput.value}`
    );

    const phone = "85998096349";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});
```

### 4. Verificar Horário de Funcionamento

O sistema verifica se o restaurante está aberto antes de finalizar o pedido:

```javascript
function checkRestaurantOpen() {
    const hour = new Date().getHours();
    return hour >= 18 && hour < 22;
}
```

## Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/projeto-carrinho.git
   ```
2. Abra o arquivo `index.html` em um navegador.
3. Interaja com os itens disponíveis no menu para adicionar, remover ou finalizar o pedido.

## Melhorias Futuras

- Implementar armazenamento local para persistir o carrinho entre sessões.
- Adicionar suporte para múltiplas formas de pagamento.
- Integração com um backend para gerenciar pedidos.

## Autor

Desenvolvido por [Pedro Menezes].


