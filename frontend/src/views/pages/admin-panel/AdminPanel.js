import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
  CCollapse
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import EstadisticasPunto from '../../../components/EstadisticasDetalladas'

const AdminPanel = () => {
  const navigate = useNavigate()
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false)

  const irACrearTrabajador = () => {
    navigate('/creartrabajador')
  }

  const toggleEstadisticas = () => {
    setMostrarEstadisticas(!mostrarEstadisticas)
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
            <CCardHeader>
              <strong>🏢 Estadísticas por Punto</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">Visualice estadísticas detalladas por punto de atención.</p>
                <CButton 
                  color="info" 
                  variant="outline" 
                  onClick={toggleEstadisticas}
                >
                  {mostrarEstadisticas ? '🔼 Ocultar Estadísticas' : '📊 Ver Estadísticas'}
                </CButton>
              </div>
              <CCollapse visible={mostrarEstadisticas}>
                <hr className="my-3" />
                <EstadisticasPunto />
              </CCollapse>
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
