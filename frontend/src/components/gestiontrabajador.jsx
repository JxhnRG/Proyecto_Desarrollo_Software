import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const obtenerTextoPrioridad = (valor) => (valor ? 'Prioritaria' : 'Normal')
const obtenerColorPrioridad = (valor) => (valor ? 'danger' : 'secondary')

const GestionTrabajador = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null)
  const navigate = useNavigate()

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tickets/')
      const ticketsEsperando = response.data.filter((ticket) => ticket.estado === 'esperando')
      // Ordenar primero los de prioridad
      ticketsEsperando.sort((a, b) => (b.prioridad ? 1 : 0) - (a.prioridad ? 1 : 0))
      setTickets(ticketsEsperando)
    } catch (error) {
      console.error('Error al obtener tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
    const intervalo = setInterval(fetchTickets, 5000)
    return () => clearInterval(intervalo)
  }, [])

  if (loading) {
    return <CSpinner color="primary" />
  }

  return (
    <CCard>
      <CCardHeader>Tickets restantes</CCardHeader>
      <CCardBody>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Código del Ticket</CTableHeaderCell>
              <CTableHeaderCell>Prioridad</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Acción</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tickets.map((ticket) => (
              <CTableRow
                key={ticket.id}
                style={{
                  cursor: 'pointer',
                  background:
                    ticketSeleccionado && ticketSeleccionado.id === ticket.id
                      ? '#e9ecef'
                      : 'inherit',
                }}
                onClick={() => setTicketSeleccionado(ticket)}
              >
                <CTableDataCell>{ticket.codigo_ticket}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={obtenerColorPrioridad(ticket.prioridad)}>
                    {obtenerTextoPrioridad(ticket.prioridad)}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{ticket.estado}</CTableDataCell>
                <CTableDataCell>
                  {ticketSeleccionado && ticketSeleccionado.id === ticket.id
                    ? '✔️ Seleccionado'
                    : ''}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-primary"
            disabled={!ticketSeleccionado}
            onClick={() => navigate('/atencion')}
          >
            Atender
          </button>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default GestionTrabajador
