import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CContainer, CRow, CCol, CButton } from '@coreui/react'

/**
 * Página de Sala de Espera
 * Muestra los detalles del ticket generado
 */
const SalaDeEspera = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const ticket = location.state

  // Si no viene ticket, redirige al inicio de turnos
  if (!ticket) {
    navigate('/gestionturnos')
    return null
  }

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="text-center">
              <CCardBody>
                <h2 className="mb-4">🎫 Tu turno ha sido generado</h2>
                <p className="fs-4">
                  Código: <strong>{ticket.codigo}</strong>
                </p>
                <p>Prioridad: {ticket.prioridad ? '✅ Sí' : '❌ No'}</p>
                <p>
                  Sede asignada: <strong>{ticket.sede || 'No disponible'}</strong>
                </p>
                <p>
                  ⏱️ Tiempo estimado de espera:{' '}
                  <strong>{ticket.tiempo_espera} minutos</strong>
                </p>
                <p>🕒 Por favor espera tu llamado...</p>
                <CButton color="primary" onClick={() => navigate('/seleccionacceso')}>
                  Volver al inicio
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default SalaDeEspera
