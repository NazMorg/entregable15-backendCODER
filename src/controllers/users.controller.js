import { usersService } from '../services/users.service.js';
import { errorMessages } from '../middlewares/error.enum.js';

class UsersController {
    userSignup = async (req, res) => {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ error: errorMessages.ALL_DATA_IS_REQUIRED });
        }
        const createdUser = await usersService.createOne(req.body);
        if (!createdUser) {
            res.redirect("/signup");
        }
        res.status(200).redirect("/");
    }

    userLogout = (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    }

    getPremium = async (req, res) => {
        try {
            const userId = req.params.uid;
            const newUserStatus = req.body;
            const userFound = await usersService.findById(userId);
            userFound.isPremium = newUserStatus.isPremium;
            const updatedUserData = { ...userFound };
            console.log(updatedUserData)

            const updatedUser = await usersService.updateOne(userId, updatedUserData);
            if (!updatedUser) {
                res.status(400).json({ message: errorMessages.USER_NOT_UPDATED });
            }
            res.status(200).json({ message: "Usuario Actualizado" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const usersController = new UsersController();