import React, { useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked } from '@coreui/icons'

/**
 * Componente de inicio de sesión
 * Permite a cualquier tipo de usuario autenticarse en el sistema
 */
const Login = () => {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  /**
   * Maneja el evento de login y realiza la autenticación contra el backend
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/usuarios/login/',
        { correo, password }
      )

      const user = data.usuario

      // 🔐 Guardamos el token y los datos del usuario en localStorage
      localStorage.setItem('access_Token', data.access)
      localStorage.setItem('refresh_Token', data.refresh)
      localStorage.setItem('rol', user.rol)
      localStorage.setItem('usuario', JSON.stringify({
        nombre: user.nombre,
        fecha_nacimiento: user.fecha_nacimiento,
        prioridad: user.prioridad,
      }))

      console.log('Datos del usuario:', user)

      // 👉 Redireccionamos según el rol del usuario
      if (user.rol === 'admin') {
        window.location.href = '/#/seleccionadmin'
      } else if (user.rol === 'trabajador') {
        window.location.href = '/#/gestiontrabajador'
      } else if (user.rol === 'cliente') {
        window.location.href = '/#/gestionturnos'
      } else {
        window.location.href = '/'
      }

    } catch (err) {
      // ❌ Si las credenciales son incorrectas
      setError('Credenciales incorrectas')
      console.error(err)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              {/* Formulario de login */}
              <CCard className="p-4">
                <CCardBody>
                  <h1>Iniciar sesión</h1>
                  <p className="text-medium-emphasis">Accede con tu cuenta</p>
                  <CForm onSubmit={handleLogin}>
                    {/* Campo: correo */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Correo"
                        autoComplete="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {/* Campo: contraseña */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {/* Mensaje de error si falla el login */}
                    {error && <div className="text-danger mb-3">{error}</div>}

                    {/* Botón de login */}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Entrar
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          ¿Olvidó su contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Lado derecho: panel de bienvenida */}
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Bienvenido</h2>
                    <p>Accede y gestiona tu panel de control de manera sencilla</p>
                    <CButton
                      color="primary"
                      className="mt-3"
                      active
                      tabIndex={-1}
                      href="#/register"
                    >
                      Registrarse
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
