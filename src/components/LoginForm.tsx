'use client';

import { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/login.module.css';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
// import bcrypt from 'bcryptjs';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const { setUser } = useUser();
    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error('Invalid email format');
            return;
        }

        if (password.length === 0) {
            toast.error('Password cannot be empty');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/users?email=${email}`);
            const users: IUser[] = await response.json();

            if (users.length > 0) {
                const user = users[0];
                // const isPasswordValid = await bcrypt.compare(password, user.password);
                const isPasswordValid = password === user.password;
                if (isPasswordValid) {
                    toast.success('Login successful!');

                    localStorage.setItem('user', JSON.stringify(user));
                    // setTimeout(() => {
                    //     router.push('/');
                    // }, 3000);
                    window.dispatchEvent(new Event('userLoggedIn'));
                    setUser(user);
                    router.push('/');
                } else {
                    toast.error('Invalid email or password');
                }
            } else {
                toast.error('Invalid email or password');
            }
        } catch (_error) {
            console.error('Error during login:', _error);
            toast.error('An error occurred while logging in');
        }
    };

    return (
        <Container className={`${styles.container}`}>
            <ToastContainer />
            <Card className={`${styles.formCard}`}>
                <Card.Body>
                    <h2 className="text-center mb-4">Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>

                    <div className="mt-3 text-center">
                        <p>Don't have an account? <Link href="/auth/register">Register here</Link></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginForm;
