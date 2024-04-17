'use client'
import React, { useState, useEffect } from 'react';
import ArticuloServer from './ArticuloServer';
import ReactPaginate from 'react-paginate';

export default function ArticuloClient() {
    const [articulos, setArticulos] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [autor, setAutor] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    // Paginacion
    const [pageNumber, setPageNumber] = useState(0);
    const articlesPerPage = 5;
    const pagesVisited = pageNumber * articlesPerPage;

    const displayArticles = articulos
        .slice(pagesVisited, pagesVisited + articlesPerPage)
        .map((articulo) => (
            <tr key={articulo.id}>
                <td>{articulo.id}</td>
                <td>{articulo.titulo}</td>
                <td>{articulo.cuerpo}</td>
                <td>{articulo.autor}</td>
                <td>
                    <button type="button" className="btn btn-primary" onClick={() => startEdit(articulo)} data-bs-toggle="modal" data-bs-target="#crearyactModal">
                        Editar
                    </button>
                    {" "}
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(articulo.id)}>
                        Eliminar
                    </button>
                </td>
            </tr>
        ));

    const pageCount = Math.ceil(articulos.length / articlesPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };// Fin Paginacion

    async function fetchData() {
        try {
            const data = await ArticuloServer.getArticulos();
            setArticulos(data);
        } catch (error) {
            console.error('Error al obtener los artículos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (event) => {
        event.preventDefault();
        try {
            const response = await ArticuloServer.createArticulo(titulo, cuerpo, autor);
            if (response.success) {
                setArticulos([...articulos, response.articulo]);
                // Limpiar los campos después de la creación
                setTitulo('');
                setCuerpo('');
                setAutor('');
            }

        } catch (error) {
            console.error('Error al crear el artículo:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        if (isEditing && editingId) {
            try {
                const response = await ArticuloServer.updateArticulo(editingId, titulo, cuerpo, autor);
                if (response.success) {
                    setArticulos(articulos.map(art => art.id === editingId ? response.articulo : art));
                    // Restablecer el formulario y salir del modo de edición
                    setTitulo('');
                    setCuerpo('');
                    setAutor('');
                    setIsEditing(false);
                    setEditingId(null);
                }

            } catch (error) {
                console.error('Error al actualizar el artículo:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await ArticuloServer.deleteArticulo(id);
            setArticulos(articulos.filter(art => art.id !== id));
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
        }
    };

    const limpiarCampos = () => {
        setTitulo('');
        setCuerpo('');
        setAutor('');
    };

    const startEdit = (articulo) => {
        setEditingId(articulo.id);
        setTitulo(articulo.titulo);
        setCuerpo(articulo.cuerpo);
        setAutor(articulo.autor);
        setIsEditing(true);
    };

    return (
        <section>
            <div className="modal fade" id="crearyactModal" tabIndex="-1" aria-labelledby="crearyactModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="crearyactModalLabel">{isEditing ? 'Actualizar articulo' : 'Crear articulo'}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={isEditing ? handleUpdate : handleCreate}>
                                <div className="mb-3">
                                    <label htmlFor="formTitulo" className="form-label">Título</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="formTitulo"
                                        placeholder="Ingrese el título"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        minLength={5}
                                        maxLength={200}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="formCuerpo" className="form-label">Cuerpo</label>
                                    <textarea
                                        className="form-control"
                                        id="formCuerpo"
                                        rows={3}
                                        placeholder="Ingrese el cuerpo"
                                        value={cuerpo}
                                        onChange={(e) => setCuerpo(e.target.value)}
                                        minLength={5}
                                        maxLength={200}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="formAutor" className="form-label">Autor</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="formAutor"
                                        placeholder="Ingrese el autor"
                                        value={autor}
                                        onChange={(e) => setAutor(e.target.value)}
                                        minLength={5}
                                        maxLength={200}
                                    />
                                </div>
                                <br />

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => limpiarCampos()}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">{isEditing ? 'Actualizar' : 'Crear'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearyactModal" onClick={() => limpiarCampos()}>
                Crear articulo
            </button>
            <br />
            <hr />

            <div style={{ display: 'flex', justifyContent: 'center' }} >
                <table className="table table-bordered table-striped table-hover table-responsive">
                    <thead>
                        <tr style={{ textAlign: "center" }}>
                            <th scope="col">Numero</th>
                            <th scope="col">Título</th>
                            <th scope="col">Cuerpo</th>
                            <th scope="col">Autor</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {displayArticles}
                    </tbody>
                </table>
            </div>
            {/* Controles de paginacion */}
            <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Siguiente"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
            />
        </section>
    );
}
