import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const navigate = useNavigate()

  const irACrearTrabajador = () => {
    navigate('/creartrabajador')
  }

  return (
    <CContainer className="py-4">
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader><strong>📢 Anuncios</strong></CCardHeader>
            <CCardBody>
              <p>Gestione anuncios o llame a usuarios desde aquí.</p>
            </CCardBody>
          </CCard>

          <CCard className="mb-4">
            <CCardHeader><strong>📊 Reportes de Atención</strong></CCardHeader>
            <CCardBody>
              <p>Genere reportes de atención y tiempos promedio.</p>
            </CCardBody>
          </CCard>

          <CCard className="mb-4">
            <CCardHeader><strong>🏢 Estadísticas por Punto</strong></CCardHeader>
            <CCardBody>
              <p>Visualice estadísticas por punto de atención.</p>
            </CCardBody>
          </CCard>

          <div className="text-end mt-4">
            <CButton color="primary" onClick={irACrearTrabajador}>
              ➕ Crear Trabajador
            </CButton>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminPanel
