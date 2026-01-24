const User = require('../../Auth/db')
const { validationInput } = require('../../utils/utils')

const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const userId = req.user.id
        console.log(await User.findOne({_id:userId}))

        const { name, phone } = req.body
        const value = validationInput({ name, phone })
        if (value) {
            return res.status(400).json({ message: `Missing field: ${value}` })
        }
        console.log(name,phone)
        const user = await User.updateOne(
            {_id: userId },
            {
                name,
                phone
            }
        )

        res.status(200).json({
            message: 'Profile updated successfully',
            data: user
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}



module.exports = { updateProfile }