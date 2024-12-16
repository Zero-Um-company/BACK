const formManager = require('../managers/formManager');

const formService = {
    criarForm: async (req) => {
        try {
            return await formManager.createForm(req.body);
        } catch (error) {
            throw new Error(`Erro ao criar formulário: ${error.message}`);
        }
    },
    getFormById: async (id) => {
        try {
            return await formManager.getForm(id);
        } catch (error) {
            throw new Error(`Erro ao recuperar formulário: ${error.message}`);
        }
    },
    editarForm: async (req) => {
        try {
            return await formManager.updateForm(req.body, req.params.id);
        } catch (error) {
            throw new Error(`Erro ao editar formulário: ${error.message}`);
        }
    },
    deletarForm: async (req) => {
        try {
            return await formManager.deleteForm(req.params.id);
        } catch (error) {
            throw new Error(`Erro ao deletar formulário: ${error.message}`);
        }
    },
    listarForms: async () => {
        try {
            return await formManager.listForms();
        } catch (error) {
            throw new Error(`Erro ao listar formulários: ${error.message}`);
        }
    }
}

module.exports = formService;