import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const CrearTrabajador = React.lazy(() => import('./views/pages/creartrabajador/CrearTrabajador'))
const GestionTurnos = React.lazy(() => import('./views/pages/gestionturnos/GestionTurnos'))
const SeleccionAcceso = React.lazy(() => import('./views/pages/seleccionacceso/SeleccionAcesso'))
const AccesoCliente = React.lazy(() => import('./views/pages/accesocliente/AcessoCliente'))
const RegistroClientes = React.lazy(() => import('./views/pages/registroclientes/RegistroClientes'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const SalaDeEspera = React.lazy(() => import('./views/pages/salaespera/SalaDeEspera'))
const Atencion = React.lazy(() => import('./views/pages/atencion/Atencion'))
const FinalizarTicket = React.lazy(() => import('./views/pages/finalizarticket/FinalizarTicket'))
const GestionTrabajadorPage = React.lazy(() => import('./views/pages/gestiontrabajador/GestionTrabajador.js'))
const AdminPanel = React.lazy(() => import('./views/pages/admin-panel/AdminPanel'))
const SeleccionAdmin = React.lazy(() => import('./views/pages/seleccionadmin/SeleccionAdmin'))
const AtencionUsuario = React.lazy(() => import("./views/pages/atencionusuario/atencionusuario.js"))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/" name="Login Page" element={<Login />} />
          <Route exact path="/creartrabajador" name="Crear Trabajador" element={<CrearTrabajador />} />
          <Route exact path="/gestionturnos" name="gestion Turno" element={<GestionTurnos />} />
          <Route exact path="/seleccionacceso" name="Seleccion Acceso" element={<SeleccionAcceso />} />
          <Route exact path="/accesocliente" name="Acceso Cliente" element={<AccesoCliente />} />
          <Route exact path="/registroclientes" name="Registro Clientes" element={<RegistroClientes />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
          <Route exact path="/sala-espera" name="Sala de Espera" element={<SalaDeEspera />} />
          <Route exact path="/atencion" name="Atención" element={<Atencion />} />
          <Route exact path="/ticket-finalizado" name="FinalizarTicket" element={<FinalizarTicket />} />
          <Route exact path="/gestiontrabajador" name="Gestion Trabajador" element={<GestionTrabajadorPage />} />
          <Route exact path="/seleccionadmin" name="Seleccion Admin" element={<SeleccionAdmin />} />
          <Route exact path="/paneladmin" name="Panel Admin" element={<AdminPanel />} />
          <Route path="/tickets/:id/atencion" element={<AtencionUsuario />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
