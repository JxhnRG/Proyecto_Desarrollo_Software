import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CButton,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react'

const FinalizarTicket = () => {
  const navigate = useNavigate()

  const handleNuevoTicket = () => {
    navigate('/gestionturnos')  // O la ruta donde se solicita un nuevo ticket
  }

  const handleLogout = () => {
    localStorage.removeItem('access')  // O el método que uses para manejar tokens
    localStorage.removeItem('refresh')
    navigate('/')
  }

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard>
              <CCardBody className="text-center">
                <h2>✅ Ticket Finalizado</h2>
                <p>Gracias por usar nuestro sistema de atención.</p>
                <CButton color="primary" className="me-3" onClick={handleNuevoTicket}>
                  Solicitar nuevo ticket
                </CButton>
                <CButton color="danger" onClick={handleLogout}>
                  Cerrar sesión
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default FinalizarTicket
