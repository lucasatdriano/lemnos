export const validateProduto = (form) => {
    const errors = {};

    if (!form.nome) {
        errors.nome = 'Nome do produto é obrigatório';
    } else if (form.nome.length < 3) {
        errors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    if (!form.descricao) {
        errors.descricao = 'Descrição do produto é obrigatória';
    } else if (form.descricao.length < 5) {
        errors.descricao = 'Descrição deve ter no mínimo 5 caracteres';
    }

    if (!form.preco) {
        errors.preco = 'Preço do produto é obrigatório';
    } else if (parseFloat(form.preco) <= 0) {
        errors.preco = 'Preço deve ser maior que zero';
    }

    if (form.desconto === undefined || form.desconto === '') {
        errors.desconto = 'Desconto é obrigatório';
    } else {
        const desconto = parseFloat(form.desconto);
        if (isNaN(desconto) || desconto < 0 || desconto > 100) {
            errors.desconto = 'Desconto deve ser entre 0 e 100%';
        }
    }

    if (!form.cor) {
        errors.cor = 'Cor do produto é obrigatória';
    } else if (form.cor.length < 2) {
        errors.cor = 'Cor deve ter no mínimo 2 caracteres';
    }

    if (!form.modelo) {
        errors.modelo = 'Modelo do produto é obrigatório';
    } else if (form.modelo.length < 2) {
        errors.modelo = 'Modelo deve ter no mínimo 2 caracteres';
    }

    if (!form.peso) {
        errors.peso = 'Peso do produto é obrigatório';
    } else if (parseFloat(form.peso) <= 0) {
        errors.peso = 'Peso deve ser maior que zero';
    }

    if (!form.altura) {
        errors.altura = 'Altura do produto é obrigatória';
    } else if (parseFloat(form.altura) <= 0) {
        errors.altura = 'Altura deve ser maior que zero';
    }

    if (!form.comprimento) {
        errors.comprimento = 'Comprimento do produto é obrigatório';
    } else if (parseFloat(form.comprimento) <= 0) {
        errors.comprimento = 'Comprimento deve ser maior que zero';
    }

    if (!form.largura) {
        errors.largura = 'Largura do produto é obrigatória';
    } else if (parseFloat(form.largura) <= 0) {
        errors.largura = 'Largura deve ser maior que zero';
    }

    if (!form.fabricante) {
        errors.fabricante = 'Fabricante do produto é obrigatório';
    } else if (form.fabricante.length < 2) {
        errors.fabricante = 'Fabricante deve ter no mínimo 2 caracteres';
    }

    if (!form.fornecedor) {
        errors.fornecedor = 'Fornecedor do produto é obrigatório';
    }

    if (!form.categoria) {
        errors.categoria = 'Categoria do produto é obrigatória';
    }

    if (!form.subCategoria) {
        errors.subCategoria = 'Subcategoria do produto é obrigatória';
    }

    if (!form.imagemPrincipal) {
        errors.imagemPrincipal = 'Imagem principal do produto é obrigatória';
    } else if (!form.imagemPrincipal.match(/^https?:\/\/.+\..+/)) {
        errors.imagemPrincipal = 'Digite uma URL válida para a imagem';
    }

    if (form.imagens && form.imagens.length > 0) {
        form.imagens.forEach((imagem, index) => {
            if (imagem && !imagem.match(/^https?:\/\/.+\..+/)) {
                errors[`imagem${index + 2}`] =
                    `URL da imagem ${index + 2} é inválida`;
            }
        });
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};
