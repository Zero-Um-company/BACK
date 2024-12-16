const { Form } = require('../models/Form');
const formValidator = require('../validators/formValidator');
const updateFormValidator = require('../validators/updateForm');

const formManager = {
    createForm: async (form) => {
        const { error, value } = formValidator.validate(form);
        if (error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
        const newForm = new Form(value);
        return await newForm.save();
    },
    getForm: async (id) => {
        const form = await Form.findById(id);
        if (!form) {
            throw new Error('Formulário não encontrado');
        }
        return form;
    },
    listForms: async () => {
        return await Form.find();
    },
    updateForm: async (newForm, id) => {
        const { error, value } = updateFormValidator.validate(newForm);
        if (error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
        const oldForm = await Form.findById(id);
        if (!oldForm) {
            throw new Error('Formulário não encontrado');
        }
        oldForm.set(value);
        return await oldForm.save();
    },
    deleteForm: async (id) => {
        const deletedForm = await Form.findById(id);
        if (!deletedForm) {
            throw new Error('Formulário não encontrado');
        }
        
        return await Form.findByIdAndDelete(id);
    }
}

module.exports = formManager;