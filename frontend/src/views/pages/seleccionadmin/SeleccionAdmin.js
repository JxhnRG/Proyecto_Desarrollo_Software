import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

const SeleccionAdmin = () => {
  const navigate = useNavigate()

  const irACrearTrabajadores = () => {
    navigate('/creartrabajador')
  }

  const irAPanelAdmin = () => {
    navigate('/paneladmin') // Asegúrate de que esta ruta esté definida en App.js
  }

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard>
              <CCardBody className="text-center">
                <h2 className="mb-4">Bienvenido Administrador</h2>
                <p>¿Qué deseas hacer hoy?</p>
                <CButton
                  color="primary"
                  className="m-3"
                  onClick={irACrearTrabajadores}
                >
                  Crear Trabajadores
                </CButton>
                <CButton
                  color="info"
                  className="m-3"
                  onClick={irAPanelAdmin}
                >
                  Ir al Panel Administrativo
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default SeleccionAdmin
