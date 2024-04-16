// ArticuloServer.jsx
import axios from 'axios';

class ArticuloServer {

    //Todos los articulos
    static async getArticulos() {
        try {
            const res = await axios.get('http://localhost:8000/api/articulos');
            return res.data;
        } catch (error) {
            console.error('Error al obtener los artículos:', error);
            throw error;
        }
    }

    //Crear articulo
    static async createArticulo(titulo, cuerpo, autor) {
        try {
            const res = await axios.post('http://localhost:8000/api/articulos', { titulo, cuerpo, autor });
            return res.data;
        } catch (error) {
            console.error('Error al crear el artículo:', error);
            throw error;
        }
    }

    //Actualizar articulo
    static async updateArticulo(id, titulo, cuerpo, autor) {
        try {
            const res = await axios.put(`http://localhost:8000/api/articulos/${id}`, { titulo, cuerpo, autor });
            return res.data;
        } catch (error) {
            console.error('Error al actualizar el artículo:', error);
            throw error;
        }
    }

    //Borrar articulo
    static async deleteArticulo(id) {
        try {
            await axios.delete(`http://localhost:8000/api/articulos/${id}`);
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
            throw error;
        }
    }
}

export default ArticuloServer;
