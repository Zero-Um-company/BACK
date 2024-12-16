const formService = require('../services/formService');

const formController = {
    criarForm: async (req,res) => {
        try {
            const form = await formService.criarForm(req);
            res.status(201).send({success: true, message: "Formulário criado com sucesso", form});
        } catch (error) {
            res.status(400).send({success: false, message: error.message});
        }
    },
    getFormById: async (req,res) => {
        try {
            const form = await formService.getFormById(req.params.id);
            res.status(200).send({success: true, form});
        } catch (error) {
            res.status(400).send({success: false, message: error.message});
        }
    },
    listAllForms: async (req,res) => {
        try {
            const forms = await formService.listarForms();
            res.status(200).send({success: true, forms});
        } catch (error) {
            console.log("Bati aqui");
            res.status(400).send({success: false, message: error.message});
        }
    },
    editarForm: async (req,res) => {
        try {
            const form = await formService.editarForm(req);
            res.status(200).send({success: true, message: "Formulário editado com sucesso", form});
        } catch (error) {
            res.status(400).send({success: false, message: error.message});
        }
    },
    deletarForm: async (req,res) => {
        try {
            const deletedForm = await formService.deletarForm(req);
            res.status(200).send({success: true, message: "Formulário deletado com sucesso", deletedForm});
        } catch (error) {
            res.send(400).send({success: false, message: error.message});
        }
    }  
}

module.exports = formController;