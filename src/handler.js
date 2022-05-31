/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unneeded-ternary */
const { nanoid } = require('nanoid');
const books = require('./books');

exports.addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } =
        request.payload;

    if (!name) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            })
            .code(400);
    }
    if (readPage > pageCount) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
    }

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const newBook = {
        id,
        name,
        year,
        author,
        reading,
        summary,
        readPage,
        finished,
        insertedAt,
        pageCount,
        publisher,
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.findIndex((v) => v.id === id) !== -1 ? true : false;

    if (isSuccess) {
        return h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            })
            .code(201);
    }

    return h
        .response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        })
        .code(500);
};

exports.getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
});

exports.getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    return h
        .response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        })
        .code(404);
};

exports.editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    if (!id) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan',
            })
            .code(404);
    }

    const { name, year, author, summary, publisher, pageCount, readPage, reading } =
        request.payload;

    if (!name) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            })
            .code(400);
    }
    if (readPage > pageCount) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
    }

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        return {
            status: 'success',
            message: 'Buku berhasil diperbarui',
        };
    }

    return h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
};

exports.deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        return {
            status: 'success',
            message: 'Buku berhasil dihapus',
        };
    }

    return h
        .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
};
