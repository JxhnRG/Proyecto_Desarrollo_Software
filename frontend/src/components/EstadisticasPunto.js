import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CAlert,
  CBadge,
  CProgress,
  CProgressBar,
  CButton,
} from '@coreui/react'
import axiosInstance from '../axiosInstance'

const EstadisticasPunto = () => {
  const [estadisticas, setEstadisticas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Cargando estadísticas...')
      const response = await axiosInstance.get('/api/punto-atencion/estadisticas/')
      console.log('Respuesta recibida:', response.data)

      if (response.data && response.data.success) {
        setEstadisticas(response.data.estadisticas || [])
      } else {
        setError('Error al cargar estadísticas: ' + (response.data?.error || 'Error desconocido'))
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err)

      if (err.response) {
        // El servidor respondió con un código de error
        if (err.response.status === 401) {
          setError('Error de autenticación. Por favor, inicie sesión nuevamente.')
        } else if (err.response.status === 403) {
          setError('No tiene permisos para ver las estadísticas.')
        } else if (err.response.status >= 500) {
          setError('Error interno del servidor. Intente nuevamente.')
        } else {
          setError(
            `Error del servidor: ${err.response.status} - ${err.response.data?.error || 'Error desconocido'}`,
          )
        }
      } else if (err.request) {
        // La petición fue enviada pero no se recibió respuesta
        setError(
          'Error de conexión al servidor. Verifique que el servidor esté ejecutándose en http://localhost:8000',
        )
      } else {
        // Algo más pasó
        setError('Error inesperado: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'esperando':
        return 'warning'
      case 'atendiendo':
        return 'primary'
      case 'finalizados':
        return 'success'
      case 'cancelados':
        return 'danger'
      default:
        return 'secondary'
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
    return <CAlert color="info">No hay datos de estadísticas disponibles.</CAlert>
  }

  return (
    <>
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
            {/* Resumen General */}
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
                  <div className="text-muted small">Tiempo Promedio</div>
                  <div className="fs-5 fw-semibold">
                    {punto.resumen.tiempo_promedio_atencion} min
                  </div>
                </div>
              </CCol>
              <CCol sm={6} md={3}>
                <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                  <div className="text-muted small">Hora Pico</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.hora_pico}</div>
                </div>
              </CCol>
            </CRow>

            {/* Estadísticas por Estado */}
            <CRow className="mb-4">
              <CCol md={6}>
                <h6>📊 Tickets por Estado</h6>
                <CTable small>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Cantidad</CTableHeaderCell>
                      <CTableHeaderCell>%</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {Object.entries(punto.tickets_por_estado).map(([estado, cantidad]) => {
                      const porcentaje =
                        punto.resumen.total_tickets > 0
                          ? ((cantidad / punto.resumen.total_tickets) * 100).toFixed(1)
                          : 0
                      return (
                        <CTableRow key={estado}>
                          <CTableDataCell>
                            <CBadge color={getBadgeColor(estado)}>
                              {estado.charAt(0).toUpperCase() + estado.slice(1)}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{cantidad}</CTableDataCell>
                          <CTableDataCell>
                            <CProgress thin>
                              <CProgressBar color={getBadgeColor(estado)} value={porcentaje} />
                            </CProgress>
                            {porcentaje}%
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </CCol>

              <CCol md={6}>
                <h6>🎯 Tickets por Prioridad</h6>
                <CTable small>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Prioridad</CTableHeaderCell>
                      <CTableHeaderCell>Cantidad</CTableHeaderCell>
                      <CTableHeaderCell>%</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>
                        <CBadge color="danger">Prioritarios</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{punto.tickets_por_prioridad.prioritarios}</CTableDataCell>
                      <CTableDataCell>
                        {punto.resumen.total_tickets > 0
                          ? (
                              (punto.tickets_por_prioridad.prioritarios /
                                punto.resumen.total_tickets) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>
                        <CBadge color="info">Normales</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{punto.tickets_por_prioridad.normales}</CTableDataCell>
                      <CTableDataCell>
                        {punto.resumen.total_tickets > 0
                          ? (
                              (punto.tickets_por_prioridad.normales / punto.resumen.total_tickets) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>

            {/* Estadísticas de Turnos */}
            <CRow className="mb-4">
              <CCol md={12}>
                <h6>🔄 Gestión de Turnos</h6>
                <CRow>
                  <CCol md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="text-muted small">Total Turnos</div>
                      <div className="fs-4 fw-bold text-primary">{punto.turnos.total}</div>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="text-muted small">Completados</div>
                      <div className="fs-4 fw-bold text-success">{punto.turnos.completados}</div>
                    </div>
                  </CCol>
                  <CCol md={4}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="text-muted small">En Proceso</div>
                      <div className="fs-4 fw-bold text-warning">{punto.turnos.en_proceso}</div>
                    </div>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            {/* Tickets por Día (Última Semana) */}
            <CRow>
              <CCol md={12}>
                <h6>📅 Tickets por Día (Última Semana)</h6>
                <CTable small striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Tickets</CTableHeaderCell>
                      <CTableHeaderCell>Visual</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {punto.tickets_por_dia.map((dia) => {
                      const maxTickets = Math.max(...punto.tickets_por_dia.map((d) => d.tickets))
                      const porcentaje = maxTickets > 0 ? (dia.tickets / maxTickets) * 100 : 0
                      return (
                        <CTableRow key={dia.fecha}>
                          <CTableDataCell>{dia.fecha}</CTableDataCell>
                          <CTableDataCell>{dia.tickets}</CTableDataCell>
                          <CTableDataCell>
                            <CProgress thin>
                              <CProgressBar color="info" value={porcentaje} />
                            </CProgress>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      ))}
    </>
  )
}

export default EstadisticasPunto
