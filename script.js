const apiURL = "http://localhost:3000";
const list = document.getElementById("lista");
const cadastro = document.getElementById("bar-cadastro");
const form = document.getElementById("formulario");
const cancel = document.getElementById("cancelar");
const nome = document.getElementById("nome");
const imagem = document.getElementById("imagem");
const genero = document.getElementById("genero");
const nota = document.getElementById("nota");
const btnSub = document.getElementById("btnSub");

let edit = false;
let idEdit;

const getFilmeById = async (id) => {
  const response = await fetch(`${apiURL}/${id}`);
  return await response.json();
};

const data = async () => {
  const mdata = await fetch(apiURL);
  const dados = await mdata.json();

  dados.map((dados) => {
    if (dados != null) {
      if (!dados.assistido) {
        dados.assistido = "❌";
      } else {
        dados.assistido = "✅";
      }
      list.insertAdjacentHTML(
        "beforeend",
        `
          <div class="card mb-3" style="max-width: 540px;" id="model-film">
          <div class="row g-0">
              <div class="col-md-4">
              <img src="${dados.imagem}" class="img-fluid rounded-start" alt=${dados.nome}>
              </div>
              <div class="col-md-8">
              <div class="card-body">
                  <h5 class="card-title">${dados.nome}</h5>
                  <p class="card-text">${dados.genero}</p>
                  <span class="badge bg-primary">${dados.nota}</span>
                  <p class="card-text"><small class="text-muted">Assistido: ${dados.assistido}</small></p>
                  <div>
                      <button class="btn btn-primary" onclick="editf('${dados.id}')">Editar</button>
                      <button class="btn btn-danger" onclick="deleteFilm('${dados.id}')">Excluir</button>
                      <button class="btn btn-success" onclick="assistir('${dados.id}')">Status</button>
                  </div>
              </div>
              </div>
          </div>
          </div>
              `
      );
    }
  });
};

const showForm = () => {
  form.style.opacity = 0;
  form.style.display = "flex";
  setTimeout(() => {
    form.style.opacity = 1;
  }, 300);
};
const hideForm = () => {
  setTimeout(() => {
    form.style.opacity = 0;
  }, 200);
  setTimeout(() => {
    form.style.display = "none";
    edit = false;
    idEdit = null;
    ResForm();
    clearFields();
  }, 300);
};

const ResForm = () => {
  cadastro.innerHTML = "Cadastrar";
  btnSub.innerHTML = "Enviar";
};

const submitForm = async (event) => {
  event.preventDefault();
  const filme = {
    nome: nome.value,
    imagem: imagem.value,
    genero: genero.value,
    nota: nota.value,
    assistido: false,
  };
  if (edit) {
    filmeEdit(filme, idEdit);
  } else {
    createFilm(filme);
  }
  clearFields();
  list.innerHTML = "";
  ResForm();
};

const createFilm = async (filme) => {
  const req = new Request(`${apiURL}/create`, {
    method: "POST",
    body: JSON.stringify(filme),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });

  const res = await (await fetch(req)).json();

  const result = await res.json();
  data();
};

const assistir = async (id) => {
  const filme = await getFilmeById(id);

  if (filme.assistido === false) {
    filme.assistido = true;
  } else {
    console.log("rodou else");
    filme.assistido = false;
  }

  const request = new Request(`${apiURL}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(filme),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  alert("Status alterado");
  const response = await (await fetch(request)).json();
  list.innerHTML = "";

  data();
};

const editf = async (id) => {
  const filme = await getFilmeById(id);
  btnSub.innerHTML = "Editar";
  cadastro.innerHTML = "Edição";

  edit = true;
  idEdit = id;

  nome.value = filme.nome;
  genero.value = filme.genero;
  imagem.value = filme.imagem;
  nota.value = filme.nota;

  showForm();
};

const filmeEdit = async (filme, id) => {
  const request = new Request(`${apiURL}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(filme),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  const res = await (await fetch(request)).json();

  edit = false;
  idEdit = null;
  hideForm();
  data();
};

const deleteFilm = async (id) => {
  const req = new Request(`${apiURL}/delete/${id}`, {
    method: "DELETE",
  });
  const res = await (await fetch(req)).json();

  list.innerHTML = "";
  data();
};

cadastro.addEventListener("click", (e) => {
  e.preventDefault();
  showForm();
});
cancel.addEventListener("click", (e) => {
  hideForm();
});

const clearFields = () => {
  nome.value = "";
  imagem.value = "";
  genero.value = "";
  nota.value = 0;
};

data();
