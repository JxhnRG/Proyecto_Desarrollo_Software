import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../axiosInstance'
import { CCard, CCardBody, CContainer, CRow, CCol, CButton, CAlert } from '@coreui/react'

const SalaDeEspera = () => {
  const [ticket, setTicket] = useState(null)
  const [tiempoRestante, setTiempoRestante] = useState(null)
  const [yaAvisado, setYaAvisado] = useState(false)
  const [anuncio, setAnuncio] = useState(null)

  const imagenesPublicidad = ['/ads/ad1.png', '/ads/ad2.png', '/ads/ad3.png', '/ads/ad4.jpg']
  const [indicePublicidad, setIndicePublicidad] = useState(0)
  const navigate = useNavigate()

  const marcarComoAtendiendo = async () => {
    try {
      await api.post(`/tickets/${ticket.codigo_ticket}/marcar-atendiendo/`)
    } catch (error) {
      console.error('Error al marcar como atendiendo:', error.response?.data || error.message)
    }
  }

  // Obtener ticket del usuario
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get('/tickets/mis-tickets/')
        const data = response.data

        if (!Array.isArray(data) || data.length === 0) {
          navigate('/gestionturnos')
          return
        }

        const ultimoTicket = data[data.length - 1]

        if (ultimoTicket.estado === 'finalizado') {
          navigate('/ticket-finalizado')
          return
        }

        setTicket(ultimoTicket)

        const posicion = parseInt(ultimoTicket.posicion_en_fila) || 1
        const segundos = posicion * 2 * 60
        setTiempoRestante(segundos)
      } catch (error) {
        console.error('Error al obtener ticket:', error)
        navigate('/')
      }
    }

    fetchTicket()
  }, [navigate])

  // Contador de tiempo
  useEffect(() => {
    if (tiempoRestante === null) return

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo)
          marcarComoAtendiendo().then(() => navigate('/atencion'))
          return 0
        }

        if (prev === 5 && !yaAvisado) {
          alert('⚠️ Quedan 5 segundos para tu atención. Prepárate.')
          setYaAvisado(true)
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [tiempoRestante, yaAvisado, ticket])

  // Cambio de publicidad cada 15s
  useEffect(() => {
    const intervaloPublicidad = setInterval(() => {
      setIndicePublicidad((prev) => (prev + 1) % imagenesPublicidad.length)
    }, 15000)

    return () => clearInterval(intervaloPublicidad)
  }, [])

  // Obtener anuncio más reciente cada 5 segundos
  useEffect(() => {
    const fetchAnuncio = async () => {
      try {
        const res = await api.get('/punto-atencion/anuncios/actual/')

        if (res.data && res.data.mensaje !== anuncio) {
          setAnuncio(res.data.mensaje)
        }
      } catch (err) {
        console.error('Error al obtener anuncio:', err)
      }
    }

    const interval = setInterval(fetchAnuncio, 5000)
    fetchAnuncio()

    return () => clearInterval(interval)
  }, [anuncio])

  const cancelarTicketYRedirigir = async () => {
    try {
      await api.post('/tickets/cancelar/')
      navigate('/ticket-finalizado')
    } catch (error) {
      console.error('Error al cancelar el ticket:', error)
      navigate('/ticket-finalizado')
    }
  }

  if (!ticket || tiempoRestante === null) return null

  const minutos = Math.floor(tiempoRestante / 60)
  const segundos = tiempoRestante % 60

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="align-items-center">
          <CCol lg={2} className="d-none d-lg-block text-center">
            <img
              src={imagenesPublicidad[indicePublicidad]}
              alt="Publicidad izquierda"
              className="img-fluid rounded shadow"
            />
          </CCol>

          <CCol xs={12} lg={8}>
            <CCard>
              <CCardBody>
                <h2>🎫 Sala de Espera</h2>

                {anuncio && (
                  <CAlert color="info" className="text-center">
                    📢 <strong>Anuncio:</strong> {anuncio}
                  </CAlert>
                )}

                <p><strong>Tu código:</strong> {ticket.codigo_ticket}</p>
                <p><strong>Sede asignada:</strong> {ticket.punto_nombre || 'No disponible'}</p>
                <p><strong>Prioridad:</strong> {ticket.prioridad ? '✅ Sí' : '❌ No'}</p>
                <p><strong>Posición en fila:</strong> {ticket.posicion_en_fila}</p>

                <p className="fs-4 mt-4">
                  ⏳ Tiempo estimado restante: {minutos.toString().padStart(2, '0')}:
                  {segundos.toString().padStart(2, '0')}
                </p>

                <CButton color="danger" onClick={cancelarTicketYRedirigir}>
                  Cancelar turno
                </CButton>
              </CCardBody>
            </CCard>

            <div className="d-block d-lg-none text-center mt-4">
              <img
                src={imagenesPublicidad[indicePublicidad]}
                alt="Publicidad móvil"
                className="img-fluid rounded shadow"
              />
            </div>
          </CCol>

          <CCol lg={2} className="d-none d-lg-block text-center">
            <img
              src={imagenesPublicidad[(indicePublicidad + 1) % imagenesPublicidad.length]}
              alt="Publicidad derecha"
              className="img-fluid rounded shadow"
            />
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default SalaDeEspera
