const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username: username,
        password: password
    })
    res.json({ message: 'User created successfully' });
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find({})
    res.json({
        courses: courses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId
    const username = req.headers.username
    try {
        await User.updateOne({ username: username }, { $push: { purchasedCourses: courseId } });
        res.status(200).json({
            msg: "Course purchased successfully"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }


});


router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    })
    const courses = await Course.find({
        _id: { $in: user.purchasedCourses }
    })
    res.json({
        Courses: courses
    })
});

module.exports = router