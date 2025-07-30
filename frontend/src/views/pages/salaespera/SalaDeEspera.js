import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../../../axiosInstance"

import {
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

const SalaDeEspera = () => {
  const [ticket, setTicket] = useState(null)
  const [tiempoRestante, setTiempoRestante] = useState(null)
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

        // ✅ Si el ticket ya está finalizado, redirigir
        if (ultimoTicket.estado === 'finalizado') {
          navigate('/ticket-finalizado')
          return
        }

        setTicket(ultimoTicket)

        // ⏱️ Calcular el tiempo estimado en segundos
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
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [tiempoRestante])

  const eliminarTicketYRedirigir = async () => {
    try {
      await api.post('/tickets/finalizar-mi-ticket/')
      alert('⏱️ Tu tiempo ha terminado. Serás redirigido.')
      navigate('/atencion')
    } catch (error) {
      console.error('Error al finalizar ticket automáticamente:', error)
      navigate('/atencion')
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
                <p><strong>Tu código:</strong> {ticket.codigo_ticket}</p>
                <p><strong>Sede asignada:</strong> {ticket.punto_nombre || 'No disponible'}</p>
                <p><strong>Prioridad:</strong> {ticket.prioridad ? '✅ Sí' : '❌ No'}</p>
                <p><strong>Posición en fila:</strong> {ticket.posicion_en_fila}</p>

                <p className="fs-4 mt-4">
                  ⏳ Tiempo estimado restante: {minutos.toString().padStart(2, '0')}:{segundos.toString().padStart(2, '0')}
                </p>
<<<<<<< HEAD

                <CButton color="danger" onClick={eliminarTicketYRedirigir}>
                  Cancelar turno
=======
                <p>Prioridad: {ticket.prioridad ? '✅ Sí' : '❌ No'}</p>
                <p>
                  Sede asignada: <strong>{ticket.sede || 'No disponible'}</strong>
                </p>
                <p>
                  ⏱️ Tiempo estimado de espera:{' '}
                  <strong>{ticket.tiempo_espera} minutos</strong>
                </p>
                <p>🕒 Por favor espera tu llamado...</p>
                <CButton color="primary" onClick={() => navigate('/')}>
                  Volver al inicio
>>>>>>> 3daaf74a9b7d37d32a2e8c0cc31b3538c653cf7c
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
