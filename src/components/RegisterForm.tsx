'use client';

import { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/register.module.css';
import { useRouter } from 'next/navigation';
// import bcrypt from 'bcryptjs';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');


    const router = useRouter();
    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return password.length >= 6 && hasUpperCase && hasLowerCase && hasNumber;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // const hashedPassword = await bcrypt.hash(password, 10);

        if (!validateEmail(email)) {
            toast.error('Invalid email format', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (username.length < 3) {
            toast.error('Username must be at least 3 characters', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (!validatePassword(password)) {
            toast.error('Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, and one number', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (password !== repassword) {
            toast.error('Passwords do not match', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        try {
            const checkResponse = await fetch(`http://localhost:8000/users?email=${email}`);
            const existingUsers = await checkResponse.json();
            if (existingUsers.length > 0) {
                toast.error('Email already in use');
                return;
            }
        } catch (_error) {
            console.error(_error);
            toast.error('Error checking email');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password,
                    role: 'USER',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                toast.success('Registration successful!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setEmail('');
                setUsername('');
                setPassword('');
                setRePassword('');

                router.push('/auth/login');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed');
            }
        } catch (_error) {
            console.error(_error);
            toast.error('An error occurred while registering');
        }
    };

    return (
        <Container className={`${styles.container}`}>
            <ToastContainer />
            <Card className={`${styles.formCard}`}>
                <Card.Body>
                    <h2 className="text-center mb-4">Register</h2>
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

                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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

                        <Form.Group className="mb-3" controlId="formRePassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={repassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Register
                        </Button>
                    </Form>

                    <div className="mt-3 text-center">
                        <p>Already have an account? <Link href="/auth/login">Login here</Link></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterForm;
