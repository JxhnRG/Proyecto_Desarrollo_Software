import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const GestionTurnos = () => {
  const [nombre, setNombre] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario')

    if (storedUser) {
      const usuario = JSON.parse(storedUser)
      setNombre(usuario.nombre)
    }

  }, [])

  const handleSeleccionarTurno = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('No se encontró el token.')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/tickets/crear/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const ticket = response.data
      navigate('/sala-espera', { state: ticket })
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.error || 'Error desconocido'
      alert(`Error al generar el ticket:\n${mensaje}`)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="text-center">
              <CCardBody>
                <h2 className="mb-4">Bienvenido, {nombre || 'Usuario'} 👋</h2>
                <p className="mb-4">Aquí puedes gestionar tus turnos fácilmente.</p>
                <CButton color="primary" size="lg" onClick={handleSeleccionarTurno}>
                  Seleccionar un turno
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default GestionTurnos
