'use client'
import { useRouter } from 'next/navigation'
import { Button } from 'react-bootstrap';

const User = () => {
    const router = useRouter()

    const handleBtn = () => {
        router.push("/")
    }

    return (
        <div>
            User page
            <div>
                <Button variant="danger mt-3">Phat Ngo</Button>
                <button onClick={() => handleBtn()}>Back Home</button>
            </div>
        </div>


    )
}

export default User;