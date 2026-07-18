import express from "express"; //importa a biblioteca express(lida com rotas HTTP e devolve respostas).
import cors from "cors";

const app = express(); //cria a aplicação para podermos utilizar
app.use(express.json());// traduz a requisição em json
app.use(cors());//permite req e res de portas ou caminhos diferentes. Sem ele, o navegador bloquaria.

const PORT = process.env.PORT || 3000;//se nao rodar na porta de ambiente do servidor, pode rodar na 3000 local.

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});