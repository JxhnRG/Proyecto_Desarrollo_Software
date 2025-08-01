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
import api from '../../../axiosInstance'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const obtenerTextoPrioridad = (valor) => (valor ? 'Prioritaria' : 'Normal')
const obtenerColorPrioridad = (valor) => (valor ? 'danger' : 'secondary')

const estadosOrden = {
  esperando: 0,
  atendiendo: 1,
  cancelado: 2,
  finalizado: 3,
}

const GestionTrabajador = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null)
  const navigate = useNavigate()

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets')
      const todosLosTickets = response.data

      todosLosTickets.sort((a, b) => {
        const estadoA = estadosOrden[a.estado] ?? 99
        const estadoB = estadosOrden[b.estado] ?? 99
        return estadoA - estadoB
      })

      setTickets(todosLosTickets)
    } catch (error) {
      console.error('Error al obtener tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelarTicketSeleccionado = async () => {
    if (!ticketSeleccionado || !ticketSeleccionado.codigo_ticket) {
      console.error('No hay ticket seleccionado o le falta ID')
      return
    }

    try {
      const response = await api.post(
        `/tickets/${encodeURIComponent(ticketSeleccionado.codigo_ticket)}/cancelar/`,
      )

      console.log('✅ Ticket cancelado:', response.data)
      fetchTickets()
      setTicketSeleccionado(null)
    } catch (error) {
      console.error('❌ Error al cancelar el ticket:', error)
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

      {/* Tabla con scroll */}
      <CCardBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                key={ticket.codigo_ticket} // <- usa codigo_ticket como clave única
                style={{
                  cursor: 'pointer',
                  background: ticketSeleccionado?.id === ticket.id ? '#e9ecef' : 'inherit',
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
                  {ticketSeleccionado?.id === ticket.id ? '✔️ Seleccionado' : ''}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Botones fuera del scroll */}
      <div className="d-flex justify-content-center gap-3 p-3 border-top">
        <button
          className="btn btn-danger"
          disabled={!ticketSeleccionado || ticketSeleccionado.estado !== 'esperando'}
          onClick={cancelarTicketSeleccionado}
        >
          Cancelar Ticket
        </button>
      </div>
    </CCard>
  )
}

export default GestionTrabajador
