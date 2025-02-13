import { getCurrentUser } from 'aws-amplify/auth';

export const getCurrentUserAsync = async (setUsername : React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const user = await getCurrentUser();
        // Get username - you can choose what to display:
        // Option 1: Username
        setUsername(user.username);

        // Option 2: If you want to display their email
        // setUsername(user.attributes.email);

        // Option 3: If you want to display their name (if collected during sign up)
        // setUsername(user.attributes.name);

    } catch (error) {
        console.error('Error getting user:', error);
    }
};