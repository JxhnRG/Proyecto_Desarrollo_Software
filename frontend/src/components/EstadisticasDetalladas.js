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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem
} from '@coreui/react'

const EstadisticasDetalladas = () => {
  const [estadisticas, setEstadisticas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resumenGeneral, setResumenGeneral] = useState({})
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Cargando estadísticas detalladas...')
      const response = await fetch('http://localhost:8000/api/punto-atencion/estadisticas/')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Data received:', data)
      
      if (data && data.success) {
        setEstadisticas(data.estadisticas || [])
        setResumenGeneral(data.resumen_general || {})
        console.log('Estadísticas cargadas exitosamente')
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

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'esperando': return 'warning'
      case 'atendiendo': return 'primary'
      case 'finalizados': case 'finalizado': return 'success'
      case 'cancelados': case 'cancelado': return 'danger'
      default: return 'secondary'
    }
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success'
    if (percentage >= 60) return 'info'
    if (percentage >= 40) return 'warning'
    return 'danger'
  }

  if (loading) {
    return (
      <CCard>
        <CCardBody className="text-center">
          <CSpinner color="primary" />
          <p className="mt-2">Cargando estadísticas detalladas...</p>
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
      {/* Resumen General del Sistema */}
      {resumenGeneral.total_tickets_sistema && (
        <CCard className="mb-4">
          <CCardHeader>
            <strong>📈 Resumen General del Sistema</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={4}>
                <div className="text-center p-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Total Tickets Sistema</div>
                  <div className="fs-3 fw-bold text-primary">{resumenGeneral.total_tickets_sistema}</div>
                </div>
              </CCol>
              <CCol md={4}>
                <div className="text-center p-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Puntos Activos</div>
                  <div className="fs-3 fw-bold text-success">{resumenGeneral.total_puntos_activos}</div>
                </div>
              </CCol>
              <CCol md={4}>
                <div className="text-center p-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Eficiencia Promedio</div>
                  <div className="fs-3 fw-bold text-info">{resumenGeneral.promedio_eficiencia}%</div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

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
            {/* Resumen Principal */}
            <CRow className="mb-4">
              <CCol sm={6} md={2}>
                <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Total Tickets</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.total_tickets}</div>
                </div>
              </CCol>
              <CCol sm={6} md={2}>
                <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Tickets Hoy</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.tickets_hoy}</div>
                </div>
              </CCol>
              <CCol sm={6} md={2}>
                <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Tiempo Promedio</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.tiempo_promedio_atencion} min</div>
                </div>
              </CCol>
              <CCol sm={6} md={2}>
                <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Hora Pico</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.hora_pico}</div>
                </div>
              </CCol>
              <CCol sm={6} md={2}>
                <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Eficiencia</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.eficiencia}%</div>
                </div>
              </CCol>
              <CCol sm={6} md={2}>
                <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3 bg-dark text-white rounded">
                  <div className="text-white-50 small">Última Semana</div>
                  <div className="fs-5 fw-semibold">{punto.resumen.tickets_ultima_semana}</div>
                </div>
              </CCol>
            </CRow>

            {/* Pestañas para diferentes vistas */}
            <CNav variant="tabs" className="mb-3">
              <CNavItem>
                <CNavLink
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                  style={{ cursor: 'pointer' }}
                >
                  📊 Estados y Prioridades
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                  style={{ cursor: 'pointer' }}
                >
                  📅 Análisis Temporal
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                  style={{ cursor: 'pointer' }}
                >
                  🔄 Turnos y Rendimiento
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                  style={{ cursor: 'pointer' }}
                >
                  📋 Tickets Recientes
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              {/* Pestaña 1: Estados y Prioridades */}
              <CTabPane visible={activeTab === 0}>
                <CRow>
                  <CCol md={6}>
                    <h6>📊 Tickets por Estado</h6>
                    <CTable small striped>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Estado</CTableHeaderCell>
                          <CTableHeaderCell>Cantidad</CTableHeaderCell>
                          <CTableHeaderCell>Porcentaje</CTableHeaderCell>
                          <CTableHeaderCell>Progreso</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {Object.entries(punto.tickets_por_estado).map(([estado, cantidad]) => {
                          const porcentaje = punto.resumen.total_tickets > 0 
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
                              <CTableDataCell>{porcentaje}%</CTableDataCell>
                              <CTableDataCell style={{ width: '30%' }}>
                                <CProgress thin>
                                  <CProgressBar 
                                    color={getBadgeColor(estado)} 
                                    value={porcentaje}
                                  />
                                </CProgress>
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </CCol>

                  <CCol md={6}>
                    <h6>🎯 Análisis de Prioridades</h6>
                    <CTable small striped>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Prioridad</CTableHeaderCell>
                          <CTableHeaderCell>Cantidad</CTableHeaderCell>
                          <CTableHeaderCell>Porcentaje</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow>
                          <CTableDataCell>
                            <CBadge color="danger">🔴 Prioritarios</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{punto.tickets_por_prioridad.prioritarios}</CTableDataCell>
                          <CTableDataCell>
                            {punto.resumen.total_tickets > 0 
                              ? ((punto.tickets_por_prioridad.prioritarios / punto.resumen.total_tickets) * 100).toFixed(1)
                              : 0}%
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell>
                            <CBadge color="info">🔵 Normales</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{punto.tickets_por_prioridad.normales}</CTableDataCell>
                          <CTableDataCell>
                            {punto.resumen.total_tickets > 0 
                              ? ((punto.tickets_por_prioridad.normales / punto.resumen.total_tickets) * 100).toFixed(1)
                              : 0}%
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>

                    <div className="mt-3">
                      <h6>📈 Indicadores de Rendimiento</h6>
                      <ul className="list-unstyled">
                        <li>✅ Tasa de Finalización: <strong>{punto.resumen.tasa_finalizacion}%</strong></li>
                        <li>❌ Tasa de Cancelación: <strong>{punto.resumen.tasa_cancelacion}%</strong></li>
                        <li>⚡ Eficiencia General: <strong>{punto.resumen.eficiencia}%</strong></li>
                        <li>📊 Promedio Diario: <strong>{punto.rendimiento?.promedio_diario || 0} tickets/día</strong></li>
                      </ul>
                    </div>
                  </CCol>
                </CRow>
              </CTabPane>

              {/* Pestaña 2: Análisis Temporal */}
              <CTabPane visible={activeTab === 1}>
                <CRow>
                  <CCol md={12}>
                    <h6>📅 Tickets por Día (Última Semana)</h6>
                    <CTable small striped responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Fecha</CTableHeaderCell>
                          <CTableHeaderCell>Total</CTableHeaderCell>
                          <CTableHeaderCell>Esperando</CTableHeaderCell>
                          <CTableHeaderCell>Finalizados</CTableHeaderCell>
                          <CTableHeaderCell>Cancelados</CTableHeaderCell>
                          <CTableHeaderCell>Actividad</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {punto.tickets_por_dia && punto.tickets_por_dia.map((dia) => {
                          const maxTickets = Math.max(...punto.tickets_por_dia.map(d => d.total))
                          const porcentaje = maxTickets > 0 ? (dia.total / maxTickets) * 100 : 0
                          return (
                            <CTableRow key={dia.fecha}>
                              <CTableDataCell>
                                <strong>{dia.fecha_legible}</strong>
                                <br />
                                <small className="text-muted">{dia.dia_semana}</small>
                              </CTableDataCell>
                              <CTableDataCell><strong>{dia.total}</strong></CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="warning">{dia.esperando}</CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="success">{dia.finalizados}</CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="danger">{dia.cancelados}</CBadge>
                              </CTableDataCell>
                              <CTableDataCell style={{ width: '20%' }}>
                                <CProgress thin>
                                  <CProgressBar 
                                    color={getProgressColor(porcentaje)} 
                                    value={porcentaje}
                                  />
                                </CProgress>
                                <small>{porcentaje.toFixed(0)}%</small>
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
              </CTabPane>

              {/* Pestaña 3: Turnos y Rendimiento */}
              <CTabPane visible={activeTab === 2}>
                <CRow>
                  <CCol md={6}>
                    <h6>🔄 Gestión de Turnos</h6>
                    <CRow>
                      <CCol md={6}>
                        <div className="text-center p-3 bg-dark text-white rounded mb-3">
                          <div className="text-white-50 small">Total Turnos</div>
                          <div className="fs-4 fw-bold text-primary">{punto.turnos.total}</div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="text-center p-3 bg-dark text-white rounded mb-3">
                          <div className="text-white-50 small">Completados</div>
                          <div className="fs-4 fw-bold text-success">{punto.turnos.completados}</div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="text-center p-3 bg-dark text-white rounded mb-3">
                          <div className="text-white-50 small">En Proceso</div>
                          <div className="fs-4 fw-bold text-warning">{punto.turnos.en_proceso}</div>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="text-center p-3 bg-dark text-white rounded mb-3">
                          <div className="text-white-50 small">Pendientes</div>
                          <div className="fs-4 fw-bold text-info">{punto.turnos.pendientes}</div>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <h6>⏱️ Tiempos de Atención</h6>
                    {punto.turnos.tiempos_detalle && punto.turnos.tiempos_detalle.length > 0 ? (
                      <CListGroup>
                        {punto.turnos.tiempos_detalle.slice(0, 5).map((tiempo, idx) => (
                          <CListGroupItem key={idx} className="d-flex justify-content-between align-items-center">
                            <span>Ticket {tiempo.ticket}</span>
                            <CBadge color={tiempo.tiempo_minutos <= 5 ? 'success' : tiempo.tiempo_minutos <= 10 ? 'warning' : 'danger'}>
                              {tiempo.tiempo_minutos} min
                            </CBadge>
                          </CListGroupItem>
                        ))}
                      </CListGroup>
                    ) : (
                      <CAlert color="info">No hay datos de tiempos de atención disponibles.</CAlert>
                    )}
                  </CCol>
                </CRow>
              </CTabPane>

              {/* Pestaña 4: Tickets Recientes */}
              <CTabPane visible={activeTab === 3}>
                <h6>📋 Últimos Tickets Procesados</h6>
                {punto.tickets_recientes && punto.tickets_recientes.length > 0 ? (
                  <CTable small striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Código</CTableHeaderCell>
                        <CTableHeaderCell>Estado</CTableHeaderCell>
                        <CTableHeaderCell>Prioridad</CTableHeaderCell>
                        <CTableHeaderCell>Usuario</CTableHeaderCell>
                        <CTableHeaderCell>Fecha</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {punto.tickets_recientes.map((ticket, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell><strong>{ticket.codigo}</strong></CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getBadgeColor(ticket.estado)}>
                              {ticket.estado}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={ticket.prioridad === 'Prioritaria' ? 'danger' : 'info'}>
                              {ticket.prioridad}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{ticket.usuario}</CTableDataCell>
                          <CTableDataCell><small>{ticket.fecha}</small></CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <CAlert color="info">No hay tickets recientes para mostrar.</CAlert>
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      ))}
    </>
  )
}

export default EstadisticasDetalladas