const { Form } = require('../models/Form');
const formValidator = require('../validators/formValidator');

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
        const { error, value } = formValidator.validate(newForm);
        if (error) {
            throw new Error(`Erro de validação: ${error.details.map(e => e.message).join(", ")}`);
        }
        const form = await Form.findById(id);
        if (!oldForm) {
            throw new Error('Formulário não encontrado');
        }
        form.set(value);
        return await form.save();
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