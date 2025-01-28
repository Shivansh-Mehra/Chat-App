export const checkUser = (req,res,next) => {
    if(!req.isAuthenticated()) {
        res.status(401).send("You are not logged in");
        
    } else {
        next();
    }
}