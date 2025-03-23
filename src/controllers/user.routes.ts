import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {v4 as random} from 'uuid';
import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error } from 'console';



//Configure the connection of the repository

const repo: Repository<User> = AppDataSource.getRepository(User);

//Router for the user controller
const router = Router();

//Create a new user
router.post(
    '/register',
    async (req: Request, res: Response) => {
        try {
            const id = random();
            const { email, password, title, firstname, lastname, role } = req.body;

            if(!email || !password || !title || !firstname || !lastname || !role === undefined){
                res.status(StatusCodes.BAD_REQUEST).send('Please provide all required fields');
                return;
            }

            const user = await repo.findOne({where : {email}});
            if(user){
                res.status(StatusCodes.BAD_REQUEST).send('Email already exists');
                return;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User();
                
                  newUser.id = id;
                  newUser.email = email;
                  newUser.password = hashedPassword;
                  newUser.title = title;
                  newUser.firstname = firstname;
                  newUser.lastname = lastname;
                  newUser.role = role;


            await repo.save(newUser);
            res.status(StatusCodes.CREATED).send('User created successfully');

            

        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            
        }}
);


// ✅ Add this new route to fetch all users
router.get("/users", async (req, res) => {
    try {
        const users = await repo.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

export default router;
