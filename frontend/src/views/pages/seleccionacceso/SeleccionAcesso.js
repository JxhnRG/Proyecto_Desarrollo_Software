import React from 'react'
import { CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'

const SeleccionAcceso = () => {
  const redirigirTrabajador = () => {
    window.location.href = '/#/login'
  }

  const redirigirCliente = () => {
    window.location.href = '/#/accesocliente'
  }

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard>
              <CCardBody className="text-center">
                <h2>Seleccione su tipo de acceso</h2>
                <CButton color="primary" className="m-3" onClick={redirigirTrabajador}>
                  Soy Trabajador / Admin
                </CButton>
                <CButton color="success" className="m-3" onClick={redirigirCliente}>
                  Soy Cliente
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default SeleccionAcceso
