# API de Games

Essa APi é utilizada para uma loga de jogos com banco de dados falso.

## Endpoints

> GET /games

Esse endpoint é respónsavel por retornar a listagem de todos os jogos cadastrados no banco de dados.

Parametros:
~~~javascript
None
~~~

Exemplo de respostas:
~~~javascript
[
  {
    "id": 65,
    "title": "Sea of Thieves",
    "year": "2018",
    "price": "80"
  },
  {
    "id": 23,
    "title": "Minecraft",
    "year": 2012,
    "price": 20
  }
]
~~~

Caso não aconteça alguma resposta, o motivo pode ser:
* Token inválido

---

> POST /auth

Esse endpoint é respónsavel fazer o processo de autenticação.

Parametros:
~~~javascript
{"user": "username", "password": "password"}
~~~

Exemplo de respostas:

~~~javascript
{
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlciI..."
}
~~~

Caso não aconteça alguma resposta, o motivo pode ser:
* Usuário incorreto
* Senha incorreta
