'use client'
// ArticuloClient.jsx
import React, { useState, useEffect } from 'react';
import ArticuloServer from './ArticuloServer';
import ReactPaginate from 'react-paginate';
import { Table, Button, Modal, Form } from 'react-bootstrap';

export default function ArticuloClient() {
    const [articulos, setArticulos] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [autor, setAutor] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    //Modal
    const [show, setShow] = useState(false);

    //Cerrar modal y limpiar campos
    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
        setEditingId(null);
        limpiarCampos();
    };

    //Mostrar modal y limpiar campos
    const handleShow = () => {
        setShow(true);
        limpiarCampos();
    };

    const limpiarCampos = () => {
        setTitulo('');
        setCuerpo('');
        setAutor('');
    };

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
                    <Button variant="primary" onClick={() => startEdit(articulo)} data-bs-toggle="modal" data-bs-target="#crearyactModal">
                        Editar
                    </Button>
                    {" "}
                    <Button variant="danger" onClick={() => handleDelete(articulo.id)}>
                        Eliminar
                    </Button>
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
                handleClose();
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
                    handleClose();
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

    const startEdit = (articulo) => {
        handleShow();
        setEditingId(articulo.id);
        setTitulo(articulo.titulo);
        setCuerpo(articulo.cuerpo);
        setAutor(articulo.autor);
        setIsEditing(true);
    };

    return (
        <section>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Actualizar articulo' : 'Crear articulo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={isEditing ? handleUpdate : handleCreate}>

                        <Form.Group className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el título"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                minLength={5}
                                maxLength={200}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cuerpo</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Ingrese el cuerpo"
                                value={cuerpo}
                                onChange={(e) => setCuerpo(e.target.value)}
                                minLength={5}
                                maxLength={200}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Autor</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el autor"
                                value={autor}
                                onChange={(e) => setAutor(e.target.value)}
                                minLength={5}
                                maxLength={200}
                                required
                            />
                        </Form.Group>
                        <br />

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                            <Button variant="primary" type="submit">{isEditing ? 'Actualizar' : 'Crear'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Button variant="primary" onClick={handleShow}>
                Crear articulo
            </Button>
            <br />
            <hr />

            <div style={{ display: 'flex', justifyContent: 'center' }} >
                <Table striped bordered hover responsive>
                    <thead>
                        <tr style={{ textAlign: "center" }}>
                            <th>Numero</th>
                            <th>Título</th>
                            <th>Cuerpo</th>
                            <th>Autor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {displayArticles}
                    </tbody>
                </Table>
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
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
            />
        </section>
    );
}
