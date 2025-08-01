import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CButton
} from '@coreui/react'

const EstadisticasPunto = () => {
  const [estadisticas, setEstadisticas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('EstadisticasPunto component mounted')
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Iniciando carga de estadísticas...')
      
      // Hacer petición directa sin axiosInstance primero
      const response = await fetch('http://localhost:8000/api/punto-atencion/estadisticas/')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Data received:', data)
      
      if (data && data.success) {
        setEstadisticas(data.estadisticas || [])
        console.log('Estadísticas cargadas exitosamente:', data.estadisticas)
      } else {
        setError('Error al cargar estadísticas: ' + (data?.error || 'Error desconocido'))
      }
    } catch (err) {
      console.error('Error completo:', err)
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <CCard>
        <CCardBody className="text-center">
          <CSpinner color="primary" />
          <p className="mt-2">Cargando estadísticas...</p>
        </CCardBody>
      </CCard>
    )
  }

  if (error) {
    return (
      <CCard>
        <CCardBody>
          <CAlert color="danger">
            <strong>❌ Error:</strong> {error}
          </CAlert>
          <div className="text-center">
            <CButton color="primary" onClick={cargarEstadisticas}>
              🔄 Reintentar
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    )
  }

  if (estadisticas.length === 0) {
    return (
      <CCard>
        <CCardBody>
          <CAlert color="info">
            No hay estadísticas disponibles.
          </CAlert>
          <div className="text-center">
            <CButton color="primary" onClick={cargarEstadisticas}>
              📊 Cargar Estadísticas
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <>
      <div className="mb-3">
        <CButton color="success" onClick={cargarEstadisticas} disabled={loading}>
          🔄 Actualizar Estadísticas
        </CButton>
      </div>
      
      {estadisticas.map((punto, index) => (
        <CCard key={punto.punto_id} className="mb-4">
          <CCardHeader>
            <strong>📍 {punto.punto_nombre}</strong>
            {punto.punto_direccion && (
              <small className="text-muted ms-2">
                {punto.punto_direccion}, {punto.punto_ciudad}
              </small>
            )}
          </CCardHeader>
          <CCardBody>
            {/* Resumen Básico */}
            <CRow className="mb-4">
              <CCol sm={6} md={3}>
                <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3">
                  <div className="text-muted small">Total Tickets</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.total_tickets}</div>
                </div>
              </CCol>
              <CCol sm={6} md={3}>
                <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                  <div className="text-muted small">Tickets Hoy</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.tickets_hoy}</div>
                </div>
              </CCol>
              <CCol sm={6} md={3}>
                <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                  <div className="text-muted small">Esperando</div>
                  <div className="fs-5 fw-semibold">{punto.tickets_por_estado.esperando}</div>
                </div>
              </CCol>
              <CCol sm={6} md={3}>
                <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                  <div className="text-muted small">Finalizados</div>
                  <div className="fs-5 fw-semibold">{punto.tickets_por_estado.finalizados}</div>
                </div>
              </CCol>
            </CRow>

            {/* Estadísticas por Estado */}
            <CRow>
              <CCol md={6}>
                <h6>📊 Tickets por Estado</h6>
                <ul className="list-unstyled">
                  <li>✅ Esperando: {punto.tickets_por_estado.esperando}</li>
                  <li>⏳ Atendiendo: {punto.tickets_por_estado.atendiendo}</li>
                  <li>✅ Finalizados: {punto.tickets_por_estado.finalizados}</li>
                  <li>❌ Cancelados: {punto.tickets_por_estado.cancelados}</li>
                </ul>
              </CCol>

              <CCol md={6}>
                <h6>🎯 Tickets por Prioridad</h6>
                <ul className="list-unstyled">
                  <li>🔴 Prioritarios: {punto.tickets_por_prioridad.prioritarios}</li>
                  <li>🔵 Normales: {punto.tickets_por_prioridad.normales}</li>
                </ul>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      ))}
    </>
  )
}

export default EstadisticasPunto