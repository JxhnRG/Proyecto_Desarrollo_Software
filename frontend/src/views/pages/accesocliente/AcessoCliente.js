import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow
} from '@coreui/react'
import axios from 'axios'

const AccesoCliente = () => {
  const [cedula, setCedula] = useState('')
  const [error, setError] = useState(null)

  const manejarAcceso = async (e) => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:8000/api/tickets/crear-ticket/', { cedula: cedula })
      window.location.href = '/#/lista-de-tickets'
    } catch (err) {
      setError('Error al crear el ticket. Verifica la cédula.')
      console.error(err)
    }
  }

  const irARegistro = () => {
    window.location.href = '/#/registroclientes'
  }

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard>
              <CCardBody>
                <h2>Acceso para Clientes</h2>
                <CForm onSubmit={manejarAcceso}>
                  <CFormInput
                    label="Cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="Ingrese su cédula"
                    required
                  />
                  {error && <p className="text-danger mt-2">{error}</p>}
                  <div className="d-grid gap-2 mt-3">
                    <CButton type="submit" color="success">Continuar</CButton>
                    <CButton type="button" color="secondary" onClick={irARegistro}>
                      ¿No estás registrado?
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

export default AccesoCliente
