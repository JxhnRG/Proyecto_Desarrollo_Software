import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CBadge,
} from '@coreui/react'

const obtenerTextoPrioridad = (valor) => (valor ? 'Prioritaria' : 'Normal')
const obtenerColorPrioridad = (valor) => (valor ? 'danger' : 'secondary')

const GestionTrabajador = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tickets/')
      setTickets(response.data)
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
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tickets.map((ticket) => (
              <CTableRow key={ticket.id}>
                <CTableDataCell>{ticket.codigo_ticket}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={obtenerColorPrioridad(ticket.prioridad)}>
                    {obtenerTextoPrioridad(ticket.prioridad)}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>{ticket.estado}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default GestionTrabajador
