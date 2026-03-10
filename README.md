# Jitterbit Order API

API REST desenvolvida com **Node.js**, **Express** e **MariaDB** para gerenciamento de pedidos e seus itens.

## Tecnologias utilizadas

- Node.js
- Express
- MariaDB
- MySQL2

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/alandln/jitterbit-order-api.git 
```

Entre na pasta do projeto:

```bash
cd jitterbit-order-api
```

Instale as dependências:

```bash
npm install
```

---

# Configuração do banco de dados

Criar banco de dados:

```sql
CREATE DATABASE jitterbit;
USE jitterbit;
```

Criar tabelas:

```sql
CREATE TABLE `Order` (
    orderId VARCHAR(50) PRIMARY KEY,
    value DECIMAL(10,2) NOT NULL,
    creationDate DATETIME NOT NULL
);

CREATE TABLE Items (
    orderId VARCHAR(50) NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_items_order
        FOREIGN KEY (orderId)
        REFERENCES `Order`(orderId)
        ON DELETE CASCADE
);
```

---

# Executando a aplicação

```bash
node src/server.js
```

Servidor será iniciado em:

```
http://localhost:3000
```

---

# Endpoints da API

### Criar pedido

POST `/order`

Exemplo de payload:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T09:24:11",
  "items": [
    {
      "idItem": 2434,
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

---

### Buscar pedido por ID

GET `/order/:orderId`

---

### Listar pedidos

GET `/order`

---

### Remover pedido

DELETE `/order/:orderId`

---

## Autor

Alan Delon
