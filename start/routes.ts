/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const SessionController = () => import('#controllers/session_controller')
const LogController = () => import('../app/controllers/log_controller.js')
import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from './kernel.js'
const HostsController = () => import('#controllers/hosts_controller')
transmit.registerRoutes()

/*
███████ ██████   ██████  ███    ██ ████████ ███████ ███    ██ ██████      ██████   ██████  ██    ██ ████████ ███████ ███████ 
██      ██   ██ ██    ██ ████   ██    ██    ██      ████   ██ ██   ██     ██   ██ ██    ██ ██    ██    ██    ██      ██      
█████   ██████  ██    ██ ██ ██  ██    ██    █████   ██ ██  ██ ██   ██     ██████  ██    ██ ██    ██    ██    █████   ███████ 
██      ██   ██ ██    ██ ██  ██ ██    ██    ██      ██  ██ ██ ██   ██     ██   ██ ██    ██ ██    ██    ██    ██           ██ 
██      ██   ██  ██████  ██   ████    ██    ███████ ██   ████ ██████      ██   ██  ██████   ██████     ██    ███████ ███████ 
*/
router
  .get('/', ({ inertia }) => {
    return inertia.render('Home')
  })
  .as('front.home')
  .use(middleware.auth())

router.get('/hosts', [HostsController, 'index']).as('front.hosts').use(middleware.auth())

router.get('/logs', [LogController, 'index']).as('front.logs').use(middleware.auth())

router
  .get('/login', ({ inertia }) => {
    return inertia.render('Login')
  })
  .as('front.login')

/*
 █████  ██████  ██     ██████   ██████  ██    ██ ████████ ███████ ███████ 
██   ██ ██   ██ ██     ██   ██ ██    ██ ██    ██    ██    ██      ██      
███████ ██████  ██     ██████  ██    ██ ██    ██    ██    █████   ███████ 
██   ██ ██      ██     ██   ██ ██    ██ ██    ██    ██    ██           ██ 
██   ██ ██      ██     ██   ██  ██████   ██████     ██    ███████ ███████ 
*/

router
  .group(() => {
    router.post('/login', [SessionController, 'store'])
    router.post('/logout', [SessionController, 'destroy']).use(middleware.auth())
    router.get('/logs', [LogController, 'get'])
    router.post('/logs', [LogController, 'store'])
    router.put('/hosts/:idHost', [HostsController, 'update']).use(middleware.auth())
    router.post('/hosts', [HostsController, 'create']).use(middleware.auth())
    router.delete('/hosts/:idHost', [HostsController, 'delete']).use(middleware.auth())
  })
  .prefix('api')
