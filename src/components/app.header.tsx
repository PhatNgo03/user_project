'use client'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link'
import styles from '@/styles/app_header.module.css'

const AppHeader = () => {
    return (
        <Navbar sticky="top" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand className='navbar-brand'>
                    <Link href={"/"} className={`nav-link `}>Manage User</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link href={"/users"} className={`nav-link ${styles.navLink}`}> User List </Link>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppHeader;
