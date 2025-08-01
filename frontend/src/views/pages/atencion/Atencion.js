import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../axiosInstance'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormTextarea,
  CRow,
} from '@coreui/react'

const Atencion = () => {
  const [problema, setProblema] = useState('')
  const [ticket, setTicket] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get('/tickets/mis-tickets/')
        const data = response.data

        if (!Array.isArray(data)) {
          console.error('Respuesta inesperada del servidor:', data)
          alert('Hubo un problema al cargar tu ticket. Intenta de nuevo.')
          navigate('/gestionturnos')
          return
        }

        if (data.length === 0) {
          navigate('/ticket-finalizado')
        } else {
          // Usa el más reciente
          const ultimoTicket = data[data.length - 1]
          setTicket(ultimoTicket)
        }
      } catch (error) {
        console.error('Error al obtener ticket:', error)
        navigate('/login') // en caso de error por token inválido
      }
    }

    fetchTicket()
  }, [navigate])

  const finalizarAtencion = async () => {
    if (!problema.trim()) {
      alert('Por favor escribe el motivo del problema.')
      return
    }

    try {
      await api.post('/tickets/finalizar-mi-ticket/', { problema }) // usa axiosInstance
      alert('✅ Atención finalizada correctamente.')
      navigate('/ticket-finalizado')
    } catch (error) {
      console.error('Error al finalizar atención:', error)
      alert('Ocurrió un error al finalizar la atención.')
    }
  }

  if (!ticket) return null

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard>
              <CCardBody>
                <h2>🧾 Atención al Usuario</h2>
                <p>
                  <strong>Código del ticket:</strong> {ticket.codigo_ticket}
                </p>
                <p>
                  <strong>Sede:</strong> {ticket.punto_nombre || 'No disponible'}
                </p>
                <p>
                  <strong>Prioridad:</strong> {ticket.prioridad ? '✅ Sí' : '❌ No'}
                </p>

                <CForm className="mt-4">
                  <CFormTextarea
                    label="📋 Motivo del problema o atención brindada"
                    rows={5}
                    value={problema}
                    onChange={(e) => setProblema(e.target.value)}
                    placeholder="Ej: Consulta sobre documentación..."
                  />
                  <CButton className="mt-3" color="primary" onClick={finalizarAtencion}>
                    Finalizar atención
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Atencion
