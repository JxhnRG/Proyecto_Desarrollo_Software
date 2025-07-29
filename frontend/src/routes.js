import React from 'react'
import AcessoCliente from './views/pages/accesocliente/AcessoCliente'
import CrearTrabajador from './views/pages/creartrabajador/CrearTrabajador'
import GestionTurnos from './views/pages/gestionturnos/GestionTurnos'
import Login from './views/pages/login/Login'
import Page404 from './views/pages/page404/Page404'
import Page500 from './views/pages/page500/Page500'
import Register from './views/pages/register/Register'
import RegistroClientes from './views/pages/registroclientes/RegistroClientes'
import SalaDeEspera from './views/pages/salaespera/SalaDeEspera'
import SeleccionAcesso from './views/pages/seleccionacceso/SeleccionAcesso'
import TicketsPorPrioridad from './views/pages/listatickets/listatickets'




const routes = [
  //{
  //path: '/',
  //exact: true,
  //name: 'Seleccion de Acceso',
  //element: <SeleccionAcesso />,
  //},
  {
    path: '/',
    name: 'Login',
    element: <Login />,
  },
  {
    path: '/register',
    name: 'Register',
    element: <Register />,
  },
  {
    path: '/404',
    name: 'Page404',
    element: <Page404 />,
  },
  {
    path: '/500',
    name: 'Page500',
    element: <Page500 />,
  },
  {
    path: '/sala-espera',
    name: 'Sala de Espera',
    element: <SalaDeEspera />,
  },
  {
    path: '/acceso-cliente',
    name: 'Acceso Cliente',
    element: <AcessoCliente />,
  },
  {
    path: '/registro-clientes',
    name: 'Registro Clientes',
    element: <RegistroClientes />,
  },
  {
    path: '/crear-trabajador',
    name: 'Crear Trabajador',
    element: <CrearTrabajador />,
  },
  {
    path: '/gestion-turnos',
    name: 'Gestión de Turnos',
    element: <GestionTurnos />,
  },
  {
    path : '/tickets',
    name: 'Tickets por Prioridad',
    element: <TicketsPorPrioridad />,
  }
]

export default routes
