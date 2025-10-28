# Project Structure

marsos-backend
├── k8s
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── ingress.yaml
│   ├── secret.yaml
│   └── service.yaml
├── scripts
│   └── docker-entrypoint.sh
├── src
│   ├── lib
│   │   ├── auth.js
│   │   └── supabaseAdmin.js
│   ├── middleware
│   │   ├── helmetCsp.js
│   │   ├── rateLimiter.js
│   │   ├── requestLogger.js
│   │   ├── requireServiceRole.js
│   │   ├── verifyAdminApp.js
│   │   └── verifyJwt.js
│   ├── server
│   │   ├── controllers
│   │   │   ├── adminController.js
│   │   │   ├── adminProductsController.js
│   │   │   ├── adminUsersController.js
│   │   │   ├── internalController.js
│   │   │   └── publicController.js
│   │   ├── routes
│   │   │   ├── adminProductsRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── adminStats.js
│   │   │   ├── adminUsers.js
│   │   │   ├── internal.js
│   │   │   └── public.js
│   │   ├── validators
│   │   │   └── adminUsersSchema.js
│   │   └── app.js
│   ├── utils
│   │   ├── errors.js
│   │   ├── response.js
│   │   └── safeCompare.js
│   ├── env.js
│   ├── index.js
│   └── logger.js
├── .dockerignore
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package-lock.json
└── package.json
