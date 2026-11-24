const express = require("express");
const path = require("path");

class NoPedido {
  constructor(id, cliente, produto, quantidade) {
    this.id = id;
    this.cliente = cliente;
    this.produto = produto;
    this.quantidade = Number(quantidade) || 1;
    this.proximo = null;
  }
}

class ListaLigadaPedidos {
  constructor() {
    this.head = null;
    this.tail = null;
    this.proximoId = 1;
    this.vetorMemoria = [];
  }

  _atualizarVetor() {
    const arr = [];
    let atual = this.head;
    while (atual) {
      arr.push({
        id: atual.id,
        cliente: atual.cliente,
        produto: atual.produto,
        quantidade: atual.quantidade,
      });
      atual = atual.proximo;
    }
    this.vetorMemoria = arr;
  }

  inserir(cliente, produto, quantidade) {
    const no = new NoPedido(this.proximoId++, cliente, produto, quantidade);
    if (!this.head) {
      this.head = no;
      this.tail = no;
    } else {
      this.tail.proximo = no;
      this.tail = no;
    }
    this._atualizarVetor();
    return no;
  }

  remover(id) {
    const alvo = Number(id);
    if (!this.head) return false;

    if (this.head.id === alvo) {
      this.head = this.head.proximo;
      if (!this.head) this.tail = null;
      this._atualizarVetor();
      return true;
    }

    let anterior = this.head;
    let atual = this.head.proximo;
    while (atual) {
      if (atual.id === alvo) {
        anterior.proximo = atual.proximo;
        if (atual === this.tail) this.tail = anterior;
        this._atualizarVetor();
        return true;
      }
      anterior = atual;
      atual = atual.proximo;
    }
    return false;
  }
}

const app = express();
const PORTA = process.env.PORT || 3000;
const lista = new ListaLigadaPedidos();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "cliente.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.post("/pedidos", (req, res) => {
  const { cliente, produto, quantidade } = req.body;
  if (cliente && produto) {
    lista.inserir(cliente, produto, quantidade);
  }
  res.redirect("/admin");
});

app.get("/pedidos", (req, res) => {
  res.json(lista.vetorMemoria);
});

app.delete("/pedidos/:id", (req, res) => {
  const removido = lista.remover(req.params.id);
  if (!removido) {
    return res.status(404).json({ erro: "Pedido não encontrado" });
  }
  res.json(lista.vetorMemoria);
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});