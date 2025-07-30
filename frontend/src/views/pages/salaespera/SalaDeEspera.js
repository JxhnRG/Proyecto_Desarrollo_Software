import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../axiosInstance'

import { CCard, CCardBody, CContainer, CRow, CCol, CButton } from '@coreui/react'

const SalaDeEspera = () => {
  const [ticket, setTicket] = useState(null)
  const [tiempoRestante, setTiempoRestante] = useState(null)
  const [yaAvisado, setYaAvisado] = useState(false) // ✅ bandera para evitar alerta duplicada
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get('/tickets/mis-tickets/')
        const data = response.data

        if (!Array.isArray(data)) {
          console.error('Respuesta inesperada del servidor:', data)
          alert('Hubo un problema al cargar tu ticket.')
          navigate('/gestionturnos')
          return
        }

        if (data.length === 0) {
          navigate('/gestionturnos')
          return
        }

        const ultimoTicket = data[data.length - 1]

        if (ultimoTicket.estado === 'finalizado') {
          navigate('/ticket-finalizado')
          return
        }

        setTicket(ultimoTicket)

        const segundos = (ultimoTicket.posicion_en_fila + 1) * 5 * 60
        setTiempoRestante(segundos)
      } catch (error) {
        console.error('Error al obtener ticket:', error)
        navigate('/login')
      }
    }

    fetchTicket()
  }, [navigate])

  // ⏳ Temporizador
  useEffect(() => {
    if (tiempoRestante === null) return

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo)
          eliminarTicketYRedirigir()
          return 0
        }

        if (prev === 60 && !yaAvisado) {
          alert('⚠️ Queda 1 minuto para tu atención. Por favor, prepárate.')
          setYaAvisado(true)
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [tiempoRestante, yaAvisado])

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
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard>
              <CCardBody>
                <h2>🎫 Sala de Espera</h2>
                <p>
                  <strong>Tu código:</strong> {ticket.codigo_ticket}
                </p>
                <p>
                  <strong>Sede asignada:</strong> {ticket.punto_nombre || 'No disponible'}
                </p>
                <p>
                  <strong>Prioridad:</strong> {ticket.prioridad ? '✅ Sí' : '❌ No'}
                </p>
                <p>
                  <strong>Posición en fila:</strong> {ticket.posicion_en_fila}
                </p>

                <p className="fs-4 mt-4">
                  ⏳ Tiempo estimado restante: {minutos.toString().padStart(2, '0')}:
                  {segundos.toString().padStart(2, '0')}
                </p>

                <CButton color="danger" onClick={cancelarTicketYRedirigir}>
                  Cancelar turno
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
