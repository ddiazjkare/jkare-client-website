import mongoose from "../lib/mongodb";

const UserSchema = new mongoose.Schema(
    {
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ''
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            country: {
                type: String,
                required: false
            },
            state: {
                type: String,
                required: false
            },
            postal_code: {
                type: String,
                required: false
            },
            line2: {
                type: String,
                default: ''
            },
            city: {
                type: String,
                required: false
            },
            line1: {
                type: String,
                required: false
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
        },
        fullName: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: true,
            match: [/^\d{10,15}$/, 'Invalid phone number format']
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true // Automatically creates createdAt and updatedAt fields
    }
);


const Users = mongoose.models.Users || mongoose.model('Users', UserSchema, "Users");
export default Users;
