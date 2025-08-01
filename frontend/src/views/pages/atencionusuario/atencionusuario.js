import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom' // ⬅️ Importamos useNavigate
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormTextarea,
  CButton,
  CSpinner,
  CBadge,
} from '@coreui/react'

const AtencionUsuario = () => {
  const { id } = useParams()
  const navigate = useNavigate() // ⬅️ Hook para redirigir
  const [ticket, setTicket] = useState(null)
  const [respuesta, setRespuesta] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accesstoken')

    axios
      .get(`/api/tickets/tickets/${id}/respuesta/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTicket(res.data)
        setRespuesta(res.data.respuesta || '')
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const finalizarAtencion = () => {
    const token = localStorage.getItem('accesstoken')

    axios
      .patch(
        `/api/tickets/tickets/${id}/respuesta/`,
        { respuesta },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        alert('Atención finalizada')
        navigate('/gestiontrabajador') // ⬅️ Redirigir a la vista deseada
      })
      .catch((err) => console.error(err))
  }

  if (loading) return <CSpinner color="primary" />

  return (
    <CCard className="p-4 bg-dark text-white">
      <CCardHeader>
        <h4>🧾 Atención al Usuario</h4>
      </CCardHeader>
      <CCardBody>
        <p>
          <strong>Código del ticket:</strong> {ticket.codigo_ticket}
        </p>
        <p>
          <strong>Sede:</strong> {ticket.punto.nombre}
        </p>
        <p>
          <strong>Prioridad:</strong>{' '}
          <CBadge color={ticket.prioridad ? 'danger' : 'secondary'}>
            {ticket.prioridad ? '❗ Sí' : '❌ No'}
          </CBadge>
        </p>
        <p>
          <strong>Descripción:</strong> {ticket.descripcion || 'No especificada.'}
        </p>

        <div className="mt-4">
          <label>
            <strong>📝 Solución</strong>
          </label>
          <CFormTextarea
            rows={5}
            placeholder="Ej: Consulta sobre documentación..."
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
          />
        </div>

        <CButton className="mt-3" color="primary" onClick={finalizarAtencion}>
          Finalizar atención
        </CButton>
      </CCardBody>
    </CCard>
  )
}

export default AtencionUsuario