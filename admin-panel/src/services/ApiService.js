const API_URL = "https://tu-api.com"; // Reemplaza con la URL real de la API

const ApiService = {
  async obtenerUsuarios() {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      return await response.json();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  },

  async obtenerUsuario(id) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return null;
    }
  },

  async actualizarUsuario(id, data) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  },
};

export default ApiService;
