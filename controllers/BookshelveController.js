const Bookshelve = require('../models/Bookshelve');

// visualizações:

module.exports.index = (req, res) => {

    Bookshelve.getAll()
        .then(results => {
            res.json(results);
        })
        .catch(error => {
            res.json({ 'message': 'Erro interno ao obter Estantes', error: error });
        });

};

module.exports.showBookshelve = (req, res) => {
    const bookshelveId = req.params.id;

    Bookshelve.getById(bookshelveId)
        .then(bookshelve => {
            if (bookshelve.length > 0) {
                return res.json(bookshelve);
            }
            return res.status(404).json({ message: 'Estante não encontrada' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Erro interno ao obter estante por ID', error: error });
        });

};

// metodos:

module.exports.createBookshelve = async (req, res, next) => {
    const { name } = req.body

    try {

        if (!name) {
            next(new Error('Dados não informados ao criar estante'))
        }

        const newBookshelve = new Bookshelve({ name });

        const savedBookshelve = await newBookshelve.save();
        res.json({ message: 'Estante criada com sucesso', savedBookshelve });
    } catch (error) {
        next(new Error('Erro interno ao criar estante'));
    }
};

module.exports.editBookshelve = async (req, res, next) => {
    const bookshelveId = req.params.id;
    const { name } = req.body;

    try {

        const existingBookshelve = await Bookshelve.getById(bookshelveId);

        if (existingBookshelve.length === 0) {
            return res.status(404).json({ error: 'Estante não encontrada' });
        }

        if (!name) {
            next(new Error('Dados não informados ao criar estante'))
        }

        const updatedBookshelve = new Bookshelve({ name });
        updatedBookshelve.id = bookshelveId;

        await updatedBookshelve.update();

        res.json({ message: 'Estante atualizado com sucesso', updatedBookshelve });
    } catch (error) {
        next(new Error('Erro interno ao editar estante'));
    }

};

module.exports.deleteBookshelve = async (req, res, next) => {
    const bookshelveId = req.params.id

    try {
        const existingBookshelve = await Bookshelve.getById(bookshelveId);

        if (existingBookshelve.length === 0) {
            return res.status(404).json({ error: 'Estante não encontrada' });
        }

        Bookshelve.deleteById(bookshelveId)

        res.json({ message: 'Estante excluida com sucesso' });
    } catch (error) {
        next(new Error('Erro interno ao excluir estante'));
    }

};