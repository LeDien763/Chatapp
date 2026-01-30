export const authMe = async (req, res) => {
    return res.status(200).json({
        message: "User is authenticated",
        userId: req.userId
    });
}