import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CRow } from '@coreui/react'

const AccesoCliente = () => {
  const [cedula, setCedula] = useState('')

  const manejarAcceso = (e) => {
    e.preventDefault()
    // Aquí va la lógica de verificación (por ahora solo redirigimos)
    window.location.href = '/#/solicitar-turno'
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
