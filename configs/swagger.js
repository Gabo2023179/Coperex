import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Caso Coperex",
            version: "1.0.0",
            description: "API para un sistema de gestión de ingreso de empresas",
            contact:{
                name: "Gabriel Contreras",
                email: "jcontreras-2023179@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/coperex/v1"
            }
        ]
    },
    apis:[
        "./src/auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/company/comapny.routes.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}