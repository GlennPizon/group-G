
// ✅ POST /register (Create a new user)
router.post("/register", async (req: Request, res: Response) => {
    try {
        const userRepository: Repository<User> = AppDataSource.getRepository(User);
        const id = random();
        const { email, password, title, firstname, lastname, role } = req.body;

        if (!email || !password || !title || !firstname || !lastname || role === undefined) {
            res.status(StatusCodes.BAD_REQUEST).send("Please provide all required fields");
            return;
        }

        const userExists = await userRepository.findOne({ where: { email } });
        if (userExists) {
            res.status(StatusCodes.BAD_REQUEST).send("Email already exists");
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

        await userRepository.save(newUser);
        res.status(StatusCodes.CREATED).send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});
