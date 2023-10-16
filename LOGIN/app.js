require('dotenv').config();
const pg = require('pg');
const bodyParser = require('body-parser');
const express = require('express');
const jsonWebToken = require('jsonwebtoken');
const cors = require('cors')

const {Sequelize, DataTypes} = require('sequelize');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const corsOptions = {
  origin: 'http://localhost', // Substitua pela origem exata que você está usando
  methods: 'DELETE',
};

app.use(cors(corsOptions));

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'projeto_mercado',
    host: 'localhost',
    username: 'postgres',
    password: 'masterkey'
    
  });

  app.listen(3000, async () => {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  });

  const Usuario = sequelize.define('usuario', {
    id_cidade: {
      type: DataTypes.INTEGER,
    },
    cep: {
      type: DataTypes.STRING,
    },
    nome: {
      type: DataTypes.STRING,
    },
    dt_nascimento: {
        type: DataTypes.STRING,
    },
    endereco_usuarios: {
        type: DataTypes.STRING,
    },
    bairro_usuario: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    senha: {
        type: DataTypes.STRING,
    },
    cpf_cnpj: {
        type: DataTypes.STRING,
    },
    tipo_usuario: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
  });


  async function cadastrarUsuario(req, res) {
    const usuario = await Usuario.create({
      id_cidade: req.body.id_cidade,
      cep: req.body.cep,
      nome: req.body.nome,
      dt_nascimento: req.body.dt_nascimento,
      endereco_usuarios: req.body.endereco_usuarios,
      bairro_usuario: req.body.bairro_usuario,
      email: req.body.email,
      senha: req.body.senha,
      cpf_cnpj: req.body.cpf_cnpj,
      tipo_usuario: 'U',
      status: 'A',
    });
    res.json(usuario);
  }

  async function cadastrarUsuarioAdm(req, res) {
    const usuario = await Usuario.create({
      id_cidade: req.body.id_cidade,
      cep: req.body.cep,
      nome: req.body.nome,
      dt_nascimento: req.body.dt_nascimento,
      endereco_usuarios: req.body.endereco_usuarios,
      bairro_usuario: req.body.bairro_usuario,
      email: req.body.email,
      senha: req.body.senha,
      cpf_cnpj: req.body.cpf_cnpj,
      tipo_usuario: 'U',
      status: 'A',
    });
    res.json(usuario);
  }

  async function login(req, res) {
    const usuario = await Usuario.findOne({
      where: {
        email: req.body.email,
        senha: req.body.senha,
      },
    });
    if (usuario.senha === req.body.senha) {
        const token = jsonWebToken.sign(
          {
            usuario: usuario,
          },
          process.env.JWT_SECRET
        );
        res.json({
          token: token,
        });
      }
    }

    async function authMiddleware(req, res, next) {
      const token = req.headers.authorization;
      try {
        jsonWebToken.verify(token, process.env.JWT_SECRET);
        next();
        } catch (error) {
          res.status(401).send(error.message);
        }
    }

    async function buscarUsuarios(req, res) {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    }

    const Produtos = sequelize.define('produtos', {
      id_usuariom: {
        type: DataTypes.INTEGER,
      },
      descricao_produto: {
        type: DataTypes.STRING,
      },
      preco_produto: {
        type: DataTypes.FLOAT,
      },
      observacao_produto: {
        type: DataTypes.STRING,
      },
      marca_produto: {
        type: DataTypes.STRING,
      },
      peso_produto: {
        type: DataTypes.FLOAT,
      },
      imagem: {
        type: DataTypes.STRING,
      },
      cod_referencial: {
        type: DataTypes.STRING
      },
    });

    const Cidades = sequelize.define('cidades', {
      id_cidade: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Indica que é uma chave primária
        autoIncrement: true, // Indica que é autoincrementável
      },
      nome_cidade: {
        type: Sequelize.STRING, // Tipo de dado do campo (string)
      },
      sg_estado: {
        type: Sequelize.STRING, // Tipo de dado do campo (string)
      },
      // Outros atributos da tabela cidades
    });

    async function cadastrarProdutos(req, res) {
      const usuario = await Produtos.create({
        id_usuariom: req.body.id_usuariom,
        descricao_produto: req.body.descricao_produto,
        preco_produto: req.body.preco_produto,
        observacao_produto: req.body.observacao_produto,
        marca_produto: req.body.marca_produto,
        peso_produto: req.body.peso_produto,
        imagem: req.body.imagem,
        cod_referencial: req.body.cod_referencial,
      });
      res.json(usuario);
    }

    async function buscarProdutos(req, res) {
      const produtos = await Produtos.findAll();
      res.json(produtos);
    };

    async function deletarCliente(req, res) {
      const cliente = await Usuario.findByPk(req.params.id);
      cliente.destroy();
      res.json({message: 'Cliente excluido com sucesso'});
    }

    async function deltetarProduto(req, res) {
      const produto = await Produtos.findByPk(req.params.id);
      produto.destroy();
      res.json({message: 'Produto excluido com sucesso'});
    }

    async function editarProduto(req, res) {
      const produto = await Produtos.findByPk(req.params.id);
      produto.descricao_produto = req.body.descricao_produto;
      produto.preco_produto = req.body.preco_produto;
      produto.observacao_produto = req.body.observacao_produto;
      produto.marca_produto = req.body.marca_produto;
      produto.peso_produto = req.body.peso_produto;
      produto.imagem = req.body.imagem;
      produto.cod_referencial = req.body.cod_referencial;
      produto.save();

      res.json(produto);

    }

    async function editarUsuario(req, res) {
      const usuario = await Usuario.findByPk(req.params.id);
      usuario.id_cidade = req.body.id_cidade;
      usuario.cep = req.body.cep;
      usuario.nome = req.body.nome;
      usuario.dt_nascimento = req.body.dt_nascimento;
      usuario.endereco_usuarios = req.body.endereco_usuarios;
      usuario.bairro_usuario = req.body.bairro_usuario;
      usuario.email = req.body.email;
      usuario.senha = req.body.senha;
      usuario.cpf_cnpj = req.body.cpf_cnpj;
      usuario.tipo_usuario = req.body.tipo_usuario;
      usuario.status = req.body.status;
      usuario.save();

      res.json(usuario);

    }

    app.get('/api/buscarCidadePorCodigo/:codigoCidade', async (req, res) => {
      const codigoCidade = req.params.codigoCidade;
      console.log(codigoCidade)
    
      try {
        // Consulta o banco de dados para buscar o nome da cidade com base no código
        const cidade = await Cidades.findOne({ where: { id_cidade: codigoCidade } });
        console.log(cidade)
    
        if (cidade) {
          res.json({ nomeCidade: cidade.nome_cidade });
        } else {
          res.status(404).json({ mensagem: 'Cidade não encontrada' });
        }
      } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar cidade' });
      }
    });
 
    
    
    

app.post('/cadastrar', cadastrarUsuario);
app.post('/login', login);
//app.use(authMiddleware);
app.get('/buscarClientes', buscarUsuarios);
app.post('/createProdutos', cadastrarProdutos);
app.get('/getProdutos', buscarProdutos);
app.delete('/deleteUsuario/:id', deletarCliente);
app.delete('/deletePrduto/:id', deltetarProduto);
app.patch('/editarProduto/:id', editarProduto);
app.patch('/editarUsuario/:id', editarUsuario);
app.post('/cadastrarAdm', cadastrarUsuarioAdm);