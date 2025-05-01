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
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'

const CrearTrabajador = () => {
  const [formData, setFormData] = useState({
    correo: '',
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    rol: 'trabajador',
    prioridad: 1,
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('accessToken')
      console.log('Token:', token)
      await axios.post('http://localhost:8000/api/usuarios/registro/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSuccess('Usuario creado exitosamente')
      setError(null)
    } catch (err) {
      setError('Error al crear el usuario')
      setSuccess(null)
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
                  <h1>Crear Trabajador</h1>
                  <p className="text-body-secondary">Completa la información</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      type="email"
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Rol</CInputGroupText>
                    <CFormSelect name="rol" value={formData.rol} onChange={handleChange}>
                      <option value="admin">Admin</option>
                      <option value="trabajador">Trabajador</option>
                      <option value="cliente">Cliente</option>
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Prioridad</CInputGroupText>
                    <CFormInput
                      type="number"
                      name="prioridad"
                      value={formData.prioridad}
                      onChange={handleChange}
                      min={1}
                    />
                  </CInputGroup>

                  {error && <p className="text-danger">{error}</p>}
                  {success && <p className="text-success">{success}</p>}

                  <div className="d-grid">
                    <CButton type="submit" color="success">
                      Crear Cuenta
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

export default CrearTrabajador
