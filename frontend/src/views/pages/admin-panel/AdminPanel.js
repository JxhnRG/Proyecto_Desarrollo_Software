import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormSelect,
  CSpinner,
  CFormTextarea,
  CListGroup,
  CListGroupItem,
  CCollapse,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import api from '../../../axiosInstance'
import EstadisticasPunto from '../../../components/EstadisticasDetalladas'

const AdminPanel = () => {
  const navigate = useNavigate()
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false)
  const [sedes, setSedes] = useState([])
  const [sedeSeleccionada, setSedeSeleccionada] = useState('')
  const [tiempoPromedio, setTiempoPromedio] = useState(null)
  const [cargando, setCargando] = useState(false)

  const [reportes, setReportes] = useState([])
  const [nuevoReporte, setNuevoReporte] = useState('')
  const [cargandoReportes, setCargandoReportes] = useState(false)
  const [nuevoAnuncio, setNuevoAnuncio] = useState('')
  const [enviandoAnuncio, setEnviandoAnuncio] = useState(false)

  const irACrearTrabajador = () => {
    navigate('/creartrabajador')
  }
  const toggleEstadisticas = () => {
    setMostrarEstadisticas(!mostrarEstadisticas)
  }

  // Obtener sedes
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const res = await api.get('/punto-atencion/puntos/')
        setSedes(res.data)
      } catch (err) {
        console.error('Error al cargar sedes:', err)
      }
    }

    fetchSedes()
  }, [])

  // Obtener tiempo promedio
  useEffect(() => {
    const fetchTiempoPromedio = async () => {
      if (!sedeSeleccionada || tiempoPromedio !== null) return
      setCargando(true)

      try {
        const res = await api.get(`/tickets/admin/tiempo-promedio/${sedeSeleccionada}/`)
        setTiempoPromedio(res.data)
      } catch (err) {
        console.error('Error al obtener tiempo promedio:', err)
      } finally {
        setCargando(false)
      }
    }

    fetchTiempoPromedio()
  }, [sedeSeleccionada])

  // Obtener reportes
  useEffect(() => {
    const cargarReportes = async () => {
      if (!sedeSeleccionada) return
      setCargandoReportes(true)
      try {
        const res = await api.get(`/punto-atencion/reportes/${sedeSeleccionada}/`)
        setReportes(res.data)
      } catch (err) {
        console.error('Error cargando reportes:', err)
      } finally {
        setCargandoReportes(false)
      }
    }

    cargarReportes()
  }, [sedeSeleccionada])

  // Enviar nuevo reporte
  const enviarReporte = async () => {
    if (!nuevoReporte.trim()) return
    try {
      await api.post(`/punto-atencion/reportes/${sedeSeleccionada}/`, {
        retroalimentacion: nuevoReporte,
      })
      setNuevoReporte('')
      const res = await api.get(`/punto-atencion/reportes/${sedeSeleccionada}/`)
      setReportes(res.data)
    } catch (err) {
      console.error('Error enviando reporte:', err)
    }
  }
  const enviarAnuncio = async () => {
    if (!nuevoAnuncio.trim()) return
    setEnviandoAnuncio(true)

    try {
      await api.post('/punto-atencion/anuncios/', { mensaje: nuevoAnuncio })
      setNuevoAnuncio('')
      alert('✅ Anuncio enviado a sala de espera.')
    } catch (err) {
      console.error('Error al enviar anuncio:', err)
      alert('❌ Error al enviar anuncio.')
    } finally {
      setEnviandoAnuncio(false)
    }
  }

  return (
    <CContainer className="py-4">
      <CRow>
        <CCol xs={12}>
          {/* Anuncios */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>📢 Anuncios a Sala de Espera</strong>
            </CCardHeader>
            <CCardBody>
              <p>Escriba un mensaje para mostrar en pantalla de la sala de espera:</p>
              <CFormTextarea
                rows={2}
                value={nuevoAnuncio}
                onChange={(e) => setNuevoAnuncio(e.target.value)}
                placeholder=""
                className="mb-2"
              />
              <CButton onClick={enviarAnuncio} color="info" disabled={enviandoAnuncio}>
                📤 {enviandoAnuncio ? 'Enviando...' : 'Enviar Anuncio'}
              </CButton>
            </CCardBody>
          </CCard>
          {/* Reportes de atención */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>📊 Reportes de Atención</strong>
            </CCardHeader>
            <CCardBody>
              <p>Seleccione una sede para consultar su tiempo promedio de atención:</p>

              <CFormSelect
                value={sedeSeleccionada}
                onChange={(e) => {
                  setSedeSeleccionada(e.target.value)
                  setTiempoPromedio(null)
                }}
                className="mb-3"
              >
                <option value="">Seleccione una sede</option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </option>
                ))}
              </CFormSelect>

              {cargando ? (
                <CSpinner color="primary" />
              ) : (
                tiempoPromedio && (
                  <>
                    <p className="fs-5">
                      ⏱ <strong>Tiempo promedio:</strong> {tiempoPromedio.tiempo_formateado}
                    </p>
                    <p>
                      <strong>Solicitudes atendidas:</strong> {tiempoPromedio.cantidad_tickets}
                    </p>
                  </>
                )
              )}
            </CCardBody>
          </CCard>

          {/* Reporte de texto por sede */}
          {sedeSeleccionada && (
            <CCard className="mb-4">
              <CCardHeader>
                <strong>📝 Retroalimentación de Atención</strong>
              </CCardHeader>
              <CCardBody>
                {cargandoReportes ? (
                  <CSpinner />
                ) : (
                  <>
                    <h6>Historial de reportes:</h6>
                    <CListGroup className="mb-3">
                      {reportes.length > 0 ? (
                        reportes.map((rep) => (
                          <CListGroupItem key={rep.id}>
                            <small className="text-muted">
                              {new Date(rep.fecha).toLocaleString()} - Autor ID:{' '}
                              {rep.autor || 'Desconocido'}
                            </small>
                            <br />
                            {rep.retroalimentacion}
                          </CListGroupItem>
                        ))
                      ) : (
                        <CListGroupItem>No hay reportes aún.</CListGroupItem>
                      )}
                    </CListGroup>

                    <h6>Nuevo reporte:</h6>
                    <CFormTextarea
                      rows={3}
                      value={nuevoReporte}
                      onChange={(e) => setNuevoReporte(e.target.value)}
                      placeholder="Escriba aquí su reporte..."
                      className="mb-2"
                    />
                    <CButton onClick={enviarReporte} color="success">
                      📤 Enviar Reporte
                    </CButton>
                  </>
                )}
              </CCardBody>
            </CCard>
          )}

          {/* Estadísticas */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>🏢 Estadísticas por Punto</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">Visualice estadísticas detalladas por punto de atención.</p>
                <CButton color="info" variant="outline" onClick={toggleEstadisticas}>
                  {mostrarEstadisticas ? '🔼 Ocultar Estadísticas' : '📊 Ver Estadísticas'}
                </CButton>
              </div>
              <CCollapse visible={mostrarEstadisticas}>
                <hr className="my-3" />
                <EstadisticasPunto />
              </CCollapse>
            </CCardBody>
          </CCard>

          {/* Botón crear trabajador */}
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
