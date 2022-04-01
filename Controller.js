const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models=require('./models');

const app=express();
app.use(cors());
app.use(express.json());

let cliente=models.Cliente;
let itempedido= models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', function(req, res){
    res.send('Olá, mundo!')
});

app.post('/servicos', async(req,res)=>{
    await servico.create(
       req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Serviço criado com sucesso!'
        })
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: 'Foi impossivel se conectar.'
        })
    });
});

app.post('/clientes', async(req,res)=>{
    await cliente.create(
       req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Serviço criado com sucesso!'
        })
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: 'Foi impossivel se conectar.'
        })
    });
});

app.post('/pedidos', async(req,res)=>{
    await pedido.create(
       req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Pedido criado com sucesso!'
        })
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: 'Foi impossivel criar Pedidio.'
        })
    });
});

app.post('/itempedidos', async(req,res)=>{
    await itempedido.create(
       req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Item criado com sucesso!'
        })
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: 'Foi impossivel criar Item.'
        })
    });
});

app.get('/clientes', async(req,res)=>{
    await cliente.create({
        nome: "Claiver Lucas",
        endereco: "Rua Das Dálias",
        cidade: "Foz do Iguaçu",
        uf: "Paraná",
        nascimento: "2002-01-06",
        clienteDesde: "2022-01-22"
    });
    res.send('Cliente adicionado com sucesso!');
})

app.get('/pedidos', async(req,res)=>{
    await pedido.create({
        ClienteId: 1,
        dataPedido: "2022-01-22"
    });
    res.send('Cliente adicionado com sucesso!');
})

app.get('/itempedidos', async(req,res)=>{
    await itempedido.create({
       PedidoId: 1,
       ServicoId: 2,
       quantidade: 3,
       valor:100.0
    });
    res.send('Item criado com sucesso!');
})


app.get('/clientes', function(req, res){
    res.send('Seja bem-vindo(a) a ServicesTI.')
});

app.get('/servicos', function(req, res){
    res.send('Trabalhmos com a criação de sites,softwares,programas,além da formação de pessoas para a aréa de TI.')
});

app.get('/pedidos', function(req, res){
    res.send('Aqui você pode acompanhar seus Pedidos.')
});

app.get('/itempedidos', function(req, res){
    res.send('Aqui estão seus pedidos/itens.')
});

app.get('/listaservicos', async(req, res)=>{
    await servico.findAll({
        // raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "não foi possivel conectar!"
        });
    });
});

app.get('/servico/:id/pedidos', async(req, res)=>{
  await itempedido.findAll({
    where : {ServicoId: req.params.id}})
  .then(item =>{
      return res.json({
          error: false,
          item
      });
  }).catch(function(erro){
      return res.status(400).json({
          error: true,
          message: "Erro: não foi possivel conectar!"
      });
  });
});

app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        // raw: true
        order: [['nome', 'DESC']]
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get('/numeroclientes', async(req, res)=>{
    await cliente.count('id').then(function(clientes){
        res.json({clientes});
    });
});

app.get('/cliente/:id', async(req, res)=>{
    await cliente.findByPk(req.params.id)
    .then(client =>{
        return res.json({
            error: false,
            client
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "não foi possivel conectar!"
        });
    });
});

app.get("/listapedidos", async (req, res) => {
    await pedido
      .findAll({
        raw: true,
      })
      .then(function (pedidos) {
        return res.json({ pedidos });
      })
  });

  app.get('/numeropedidos', async(req, res)=>{
    await pedido.count('id').then(function(pedidos){
        res.json({pedidos});
    });
});

app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            message: "Erro na alteração do serviço"
        });
    });
});

app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    });
});

app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado.'
        });
    };

    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            mesage: 'Serviço não foi encontrado.'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id })
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Pedido foi alterado com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro não foi possivel alterar."
        });
    });
});

app.get('/excluircliente/:id', async(req, res)=>{
     await  cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluido com sucesso!"
        }).catch(function(erro){
            return res.status(400).json({
                error: true,
                message: "Erro ao excluir o cliente."
            });
        });
    });

    app.get("/cliente/:id/compras", async (req, res) => {
        await compra
          .findAll({
            where: { ClienteId: req.params.id },
          })
          .then((compras) => {
            return res.json({
              error: false,
              compras,
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Erro: não foi possível alterar.",
            });
          });
      });

      app.put("/atualizacliente/:id", async (req, res) => {
        await cliente
          .update(req.body, {
            where: { id: req.body.id },
          })
          .then(function () {
            return res.json({
              error: false,
              message: "Cliente alterado com sucesso!",
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Não foi possível alterar dos dados",
            });
          });
      });

      app.post("/compra", async (req, res) => {
        await compra
          .create(req.body)
          .then(function () {
            return res.json({
              erro: false,
              message: "Compra criada com sucesso!",
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Foi impossível se conectar.",
            });
          });
      });

      app.get("/listacompras", async (req, res) => {
        await compra
          .findAll({
            raw: true,
          })
          .then(function (compras) {
            return res.json({ compras });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Foi impossível se conectar.",
            });
          });
      });

      app.put("/atualizacompra/:id", async (req, res) => {
        const comp = {
          id: req.params.id,
          ClienteId: req.body.ClienteId,
          data: req.body.data,
        };
      
        if (!(await cliente.findByPk(req.body.ClienteId))) {
          return res.status(400).json({
            error: true,
            message: "Cliente não existe.",
          });
        }
      
        await compra
          .update(comp, {
            where: Sequelize.and(
              { ClienteId: req.body.ClienteId },
              { id: req.params.id }
            ),
          })
          .then((compras) => {
            return res.json({
              error: false,
              message: "Compra alterada com sucesso.",
              compras,
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Erro: não foi possível alterar.",
            });
          });
      });

      app.get("/excluircompra/:id", async (req, res) => {
        await compra
          .destroy({
            where: { id: req.params.id },
          })
          .then(function () {
            return res.json({
              error: false,
              message: "Compra excluída com sucesso.",
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Erro: Impossível excluir a compra.",
            });
          });
      });

      app.post("/produto", async (req, res) => {
        await produto
          .create(req.body)
          .then(function () {
            return res.json({
              error: false,
              message: "Produto criado com sucesso!",
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Foi impossível se conectar.",
            });
          });
      });

      app.get("/produto/:id", async (req, res) => {
        await produto
          .findByPk(req.params.id)
          .then((produto) => {
            return res.json({
              erro: false,
              produto
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Não foi possível encontrar o produto;",
            });
          });
      });

      app.get("/produto/:id/compras", async (req, res) => {
        await itemCompra
          .findAll({
            where: { ProdutoId: req.params.id },
          })
          .then((item) => {
            return res.json({
              error: false,
              item,
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Não foi possível encontrar o serviço e o pedido;",
            });
          });
      });

      app.get("/listaprodutos", async (req, res) => {
        await produto
          .findAll({
            raw: true,
          })
          .then(function (produtos) {
            return res.json({ produtos });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Não foi possível carregar os Produtos;",
            });
          });
      });

      app.put("/atualizaproduto/:id", async (req, res) => {
        await produto
          .update(req.body, {
            where: { id: req.body.id },
          })
          .then(function () {
            return res.json({
              error: false,
              message: "Produto alterado com sucesso!",
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Não foi possível alterar dos dados",
            });
          });
      });

      app.get("/excluirproduto/:id", async (req, res) => {
        await produto
          .destroy({
            where: { id: req.params.id },
          })
          .then(function () {
            return res.json({
              error: false,
              message: "Produto excluído com sucesso.",
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Erro: Impossível excluir o Produto.",
            });
          });
      });

      app.post("/itemcompra", async (req, res) => {
        await itemCompra
          .create(req.body)
          .then(function () {
            return res.json({
              erro: false,
              message: "Item criado com sucesso!",
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Foi impossível se conectar.",
            });
          });
      });

      app.get("/itemcompra/compra/:id", async (req, res) => {
        await compra
          .findByPk(req.params.id, { include: ["item_compras"] })
          .then((compras) => {
            return res.json({ compras });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Não foi possível encontrar o compra.",
            });
          });
      });

      app.get("/listaitemcompras", async (req, res) => {
        await itemCompra
          .findAll({
            raw: true,
          })
          .then(function (itens) {
            return res.json({ itens });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Foi impossível se conectar.",
            });
          });
      });

      app.get("/excluiritem/compra/:id", async (req, res) => {
        if (!(await compra.findByPk(req.params.id))) {
          return res.status(400).json({
            error: true,
            message: "Compra não encontrado.",
          });
        }
        await itemCompra
          .destroy({
            where: { CompraId: req.params.id },
          })
          .then((itens) => {
            return res.json({
              error: false,
              message: "Dados excluídos com sucesso.",
              itens,
            });
          })
          .catch((erro) => {
            return res.status(400).json({
              error: true,
              message: "Erro: Não foi possível alterar.",
            });
          });
      });
});

let port=process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})