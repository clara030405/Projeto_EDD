class NoPedido {
    constructor(id, cliente, produto, quantidade) {
        this.id = id;
        this.cliente = cliente;
        this.produto = produto;
        this.quantidade = quantidade;
        this.proximo = null; // Ponteiro para o próximo nó
    }
}

class ListaLigadaPedidos {
    constructor() {
        this.vetorMemoria = []; // Vetor onde os nós ficam armazenados
        this.head = null;       // Primeiro nó da lista
        this.tail = null;       // Último nó da lista
        this.tamanho = 0;
        this.proximoId = 1;
        this.ouvintes = [];
    }

    aoAtualizar(callback) {
        this.ouvintes.push(callback);
    }

    notificar() {
        for (let i = 0; i < this.ouvintes.length; i++) {
            this.ouvintes[i]();
        }
    }

    // Inserir no FIM 
    inserirFim(cliente, produto, quantidade) {
        const novoNo = new NoPedido(this.proximoId++, cliente, produto, quantidade);
        this.vetorMemoria.push(novoNo);

        if (this.head === null) {
            this.head = novoNo;
            this.tail = novoNo;
        } else {
            this.tail.proximo = novoNo;
            this.tail = novoNo;
        }

        this.tamanho++;
        this.notificar();
    }

    // Remover do INÍCIO  (HEAD)
    removerInicio() {
        if (this.head === null) return;

        const removido = this.head;
        this.head = this.head.proximo;
        if (this.head === null) this.tail = null;

        this.vetorMemoria = this.vetorMemoria.filter(no => no !== removido);
        this.tamanho--;
        this.notificar();
    }

    // Remover um nó 
    removerPorId(id) {
        if (this.head === null) return;

        if (this.head.id === id) {
            this.removerInicio();
            return;
        }

        let anterior = this.head;
        let atual = this.head.proximo;

        while (atual !== null) {
            if (atual.id === id) {
                anterior.proximo = atual.proximo;
                if (atual === this.tail) this.tail = anterior;

                this.vetorMemoria = this.vetorMemoria.filter(no => no !== atual);
                this.tamanho--;
                this.notificar();
                return;
            }
            anterior = atual;
            atual = atual.proximo;
        }
    }
}