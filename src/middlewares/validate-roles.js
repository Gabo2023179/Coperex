import User from "../user/user.model.js";

export const hasRoles = (...roles) => {
    return(req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                message: "Se requiere validar el role antes de validar el token"
            })
        }

        if(req.usuario.role === "ADMIN" && req.body.role){
            return res.status(400).json({
                success: false,
                message: "Ya tienes el rol ADMIN"
            });
        }

        
        
        

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                message: `Usuario no autorizado, El recurso requiere uno de los siguientes roles: ${roles}`
            })
        }
        next()
    }

}
    
    export const validateUpdateRole = (req, res, next) => {
        
        if (req.usuario.role === "CLIENT" && req.body.role) {
            return res.status(400).json({
                success: false,
                message: "No tienes permiso para cambiar tu propio rol. Solo un ADMIN puede hacerlo."
            });
        }
        
        next();
    }

    export const adminCantEditOtherAdmin = async (req, res, next) => {
       
        if(role === "ADMIN_ROLE"){
            const { uid } = req.body
            const user = await User.findById(uid)

            if(user.role === "ADMIN_ROLE"){
                res.status(401).json({
                    success: false,
                    message: "Unable to edit other admins"
                })
            }
        }else if(role === "CLIENT_ROLE"){
            if(data.uid){
                res.status(401).json({
                    success: false,
                    message: "Only admins are authorized to edit other users"
                })
            }else if(data.role){
                res.status(401).json({
                    success: false,
                    message: "Only admins are authorized to edit roles"
                })
            }else if(data.status){
                res.status(405).json({
                    success: false,
                    message: "Unable to switch status in update method"
                })
            }
            next()
        }

    }

