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
import { cilUser, cilAddressBook, cilEnvelopeClosed } from '@coreui/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' // 👈 Importación añadida

const RegistroCliente = () => {
  const navigate = useNavigate() // 👈 Hook para redireccionar

  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    fecha_nacimiento: '',
    discapacidad: false,
    prioridad: false,
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const username = formData.cedula
    const password = 'cliente123'
    const rol = 'cliente'

    const finalData = {
      ...formData,
      username,
      password,
      rol,
    }

    try {
      await axios.post('http://localhost:8000/api/usuarios/registro/', finalData)
      setSuccess('Cliente registrado correctamente')
      setError(null)
      window.location.href = '/'
    } catch (err) {
      setError('Error al registrar el cliente')
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
                  <h1>Registro de Cliente</h1>
                  <p className="text-body-secondary">Ingrese sus datos para registrarse</p>

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
                      <CIcon icon={cilAddressBook} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Cédula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Correo Electrónico"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Fecha de Nacimiento</CInputGroupText>
                    <CFormInput
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <div className="mb-3 form-check form-switch">
                    <CFormCheck
                      type="checkbox"
                      name="prioridad"
                      checked={formData.prioridad}
                      onChange={(e) =>
                        setFormData({ ...formData, prioridad: e.target.checked })
                      }
                      label="¿Prioridad?"
                    />
                  </div>

                  {error && <p className="text-danger">{error}</p>}
                  {success && <p className="text-success">{success}</p>}

                  <div className="d-grid mb-2">
                    <CButton type="submit" color="primary">
                      Registrarse
                    </CButton>
                  </div>

                  {/* 👇 Botón para volver al login */}
                  <div className="d-grid">
                    <CButton color="secondary" onClick={() => navigate('/')}>
                      ← Volver al Login
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

export default RegistroCliente
