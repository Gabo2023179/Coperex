import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Adoption System API",
            version: "1.0.0",
            description: "API para un sistema de gestión de adopciones de mascotas",
            contact:{
                name: "Braulio Echeverria",
                email: "braulioecheverria@kinal.org.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3001/adoptionSystem/v1"
            }
        ]
    },
    apis:[
        "./src/auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/pet/pet.routes.js",
        "./src/appointment/appointment.routes.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}