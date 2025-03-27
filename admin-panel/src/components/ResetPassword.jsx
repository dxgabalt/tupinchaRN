import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase_admin } from '../services/supabaseAdmin'
import "../styles/resetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('access_token')
    const type = searchParams.get('type')

    if (token && type === 'recovery') {
      // Establecer la sesión con el token recibido
      const setSession = async () => {
        const { error } = await supabase_admin.auth.setSession({
          access_token: token,
          refresh_token: token,
        })
        if (error) {
          console.error('Error al establecer la sesión:', error.message)
        }
      }

      setSession()
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase_admin.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setError('Hubo un error al actualizar la contraseña.')
      console.error('Error al actualizar contraseña:', error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  return (
    <div className="container">
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Nueva contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="form-control">
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">¡Contraseña actualizada correctamente!</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
