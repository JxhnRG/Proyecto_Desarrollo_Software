import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

// Componente de registro de usuario cliente
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    password2: '',
    f_nacimiento: '',
    discapacidad: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.password2) {
      alert('Las contraseñas no coinciden')
      return
    }

    const payload = {
      username: formData.username,
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      password: formData.password,
      f_nacimiento: formData.f_nacimiento,
      discapacidad: formData.discapacidad,
      rol: 'cliente',
    }

    try {
      const response = await fetch('http://localhost:8000/api/usuarios/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert('Registro exitoso')
      } else {
        const errorData = await response.json()
        alert('Error en el registro: ' + JSON.stringify(errorData))
      }
    } catch (error) {
      console.error(error)
      alert('Error de red o del servidor')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Registro</h1>
                  <p className="text-body-secondary">Crea tu cuenta</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Nombre</CInputGroupText>
                    <CFormInput
                      name="nombre"
                      placeholder="Nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Apellido</CInputGroupText>
                    <CFormInput
                      name="apellido"
                      placeholder="Apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="username"
                      placeholder="Usuario"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="correo"
                      placeholder="Correo"
                      autoComplete="email"
                      value={formData.correo}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password2"
                      placeholder="Repite la contraseña"
                      autoComplete="new-password"
                      value={formData.password2}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Fecha de Nacimiento</CInputGroupText>
                    <CFormInput
                      type="date"
                      name="f_nacimiento"
                      value={formData.f_nacimiento}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <div className="mb-3">
                    <CFormCheck
                      type="checkbox"
                      id="discapacidad"
                      name="discapacidad"
                      checked={formData.discapacidad}
                      onChange={handleChange}
                    />
                    <label htmlFor="discapacidad" style={{ marginLeft: '0.5rem' }}>
                      ¿Tiene alguna discapacidad?
                    </label>
                  </div>

                  {/* Botón de enviar */}
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Crear Cuenta
                    </CButton>
                  </div>

                  {/* Botón para ir al login */}
                  <div className="d-grid mt-2">
                    <CButton color="secondary" variant="outline" onClick={() => window.location.href = '/'}>
                      Ya tengo cuenta
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register

