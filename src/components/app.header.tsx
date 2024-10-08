'use client';

import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import styles from '@/styles/app_header.module.css';
import { useUser } from '@/context/UserContext';

const AppHeader = () => {
    const { user, setUser } = useUser();

    const updateUserFromLocal = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        updateUserFromLocal();

        const handleUserLoggedIn = () => {
            updateUserFromLocal();
        };

        const handleUserLoggedOut = () => {
            updateUserFromLocal();
        };

        window.addEventListener('userLoggedIn', handleUserLoggedIn);
        window.addEventListener('userLoggedOut', handleUserLoggedOut);

        return () => {
            window.removeEventListener('userLoggedIn', handleUserLoggedIn);
            window.removeEventListener('userLoggedOut', handleUserLoggedOut);
        };
    }, [setUser]);

    return (
        <Navbar sticky="top" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand className='navbar-brand'>
                    <Link href={"/"} className={`nav-link`}>Manage User</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100 d-flex justify-content-between">
                        <div className="d-flex">
                            {user && user.role === 'ADMIN' && (
                                <Link href={"/users"} className={`nav-link ${styles.navLink}`}>User List</Link>
                            )}
                            {user && user.role === 'USER' && (
                                <Link href={"/employees"} className={`nav-link ${styles.navLink}`}>User Home</Link>
                            )}
                        </div>
                        <div className="d-flex align-items-center">
                            {user ? (
                                <>
                                    <span className={`nav-link ${styles.navLink}`} style={{ marginRight: '10px' }}>
                                        Welcome, {user.name}
                                    </span>
                                    <Link href={"/auth/logout"} className={`nav-link ${styles.navLink}`}>Logout</Link>
                                </>
                            ) : (
                                <>
                                    <Link href={"/auth/login"} className={`nav-link ${styles.navLink}`}>Login</Link>
                                    <Link href={"/auth/register"} className={`nav-link ${styles.navLink} ms-3`}>Register</Link>
                                </>
                            )}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppHeader;
