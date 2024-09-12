// Seleciona os elementos do DOM
const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');
const profilePhoto = document.querySelector('.upload-photo img');
const saveButton = document.getElementById('saveButton');
const removeButton = document.querySelector('.photo-buttons button:nth-child(4)'); // Botão Remove
const updateButton = document.querySelector('.update-btn'); // Botão de atualizar perfil

// Função para carregar a imagem salva do localStorage ao carregar a página
window.onload = function() {
    const savedImage = localStorage.getItem('profilePhoto');
    if (savedImage) {
        profilePhoto.src = savedImage; // Define a imagem de perfil com a foto salva
    }
};

// Evento para simular clique no input file quando o botão Upload é clicado
uploadButton.addEventListener('click', () => {
    fileInput.click(); // Simula o clique no input file
});

// Evento que lida com a seleção da imagem e exibe no local correto
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        // Quando o arquivo for carregado, atualiza o src da imagem
        reader.onload = function(e) {
            profilePhoto.src = e.target.result; // Mostra a imagem selecionada no quadro
        };

        // Lê o arquivo como uma URL de dados (base64)
        reader.readAsDataURL(file);
    }
});

// Evento para salvar a imagem no localStorage
saveButton.addEventListener('click', () => {
    const currentImage = profilePhoto.src;
    if (currentImage !== 'placeholder.jpg') {
        // Salva a imagem atual no localStorage
        localStorage.setItem('profilePhoto', currentImage);

        // Alerta de sucesso (opcional)
        alert('Foto de perfil salva com sucesso!');
    } else {
        alert('Por favor, faça o upload de uma foto antes de salvar.');
    }
});

// Evento para remover a imagem e restaurar o placeholder
removeButton.addEventListener('click', () => {
    profilePhoto.src = 'placeholder.jpg'; // Restaura a imagem padrão
    fileInput.value = ''; // Limpa o input file
    localStorage.removeItem('profilePhoto'); // Remove a imagem salva no localStorage
});

// O botão "Atualizar Perfil" apenas recarrega a página para verificar a imagem salva
updateButton.addEventListener('click', () => {
    window.location.reload();
});

document.getElementById('cpf').addEventListener('input', function(e) {
    var value = e.target.value;
    var cpfPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número
                          .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o terceiro dígito
                          .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o sexto dígito
                          .replace(/(\d{3})(\d)/, '$1-$2') // Adiciona traço após o nono dígito
                          .replace(/(-\d{2})\d+?$/, '$1'); // Impede entrada de mais de 11 dígitos
    e.target.value = cpfPattern;
  });

document.getElementeById('mobile').addEventListener('input', function(e) {
    var value = e.target.value;
    var mobilePattern = value.replace(/\D/g, '')
                             .replace((/(\d{2})(\d)/,"($1) $2"))
                             .replace((/(\d)(\d{4})$/,"$1-$2"));
    e.target.value = mobilePattern;
})