import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
/**
 * Componente de gestión de turnos
 * Permite al usuario autenticado generar un nuevo ticket
 */

const GestionTurnos = () => {
  const [nombre, setNombre] = useState('')  // Estado para guardar el nombre del usuario
  const navigate = useNavigate()
  useEffect(() => {
    // Al cargar el componente, obtenemos el nombre del usuario desde localStorage
    const storedUser = localStorage.getItem('usuario')
    if (storedUser) {
      const usuario = JSON.parse(storedUser)
      setNombre(usuario.nombre)
    }
  }, [])

  /**
   * Función que genera un nuevo ticket para el usuario autenticado
   */
  const handleSeleccionarTurno = async () => {
    const storedUser = localStorage.getItem('usuario')
    const token = localStorage.getItem('accessToken')

    // Validación: usuario y token deben existir
    if (!storedUser || !token) {
      alert('No se encontró el usuario o el token.')
      return
    }

    const usuario = JSON.parse(storedUser)

    try {
      // Hacemos una petición POST para generar el ticket
      const response = await axios.post(
        'http://localhost:8000/api/tickets/crear/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,  // 🔐 Autenticación con JWT
          },
        }
      )

      // ✅ Si se genera correctamente, mostramos la información
      const ticket = response.data
      navigate('/sala-espera', { state: ticket })
    } catch (error) {
      // 🚨 En caso de error, lo mostramos al usuario
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
