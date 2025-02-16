import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminLogin.css";
import {AuthService} from "../services/AuthService";
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📌 Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulación de autenticación (Reemplazar con la autenticación real)
    setTimeout(() => {
      // Iniciar sesión con el correo y contraseña
      let  is_auth= AuthService.autenticarUsuario(email, password)
      console.log(is_auth)
      if(is_auth){
        localStorage.setItem("adminAuth", "true"); // Guardar sesión
        navigate("/dashboard"); // Redirigir al Dashboard
      }else{
        setError("❌ Credenciales incorrectas.");
      }

      /*if (email === "admin@panel.com" && password === "admin123") {
        localStorage.setItem("adminAuth", "true"); // Guardar sesión
        navigate("/dashboard"); // Redirigir al Dashboard
      } else {
        setError("❌ Credenciales incorrectas.");
      }*/
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🔐 Admin Panel - Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>📧 Correo Electrónico:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>🔑 Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Cargando..." : "🚀 Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
